import { parseParams } from "@b/utils/ws";
import { authenticate, rateLimit, rolesGate } from "./Middleware";
import { Request } from "./Request";
import { Response } from "./Response";
import { makeUuid } from "@b/utils/passwords";
import { getRecord, getRecords } from "@b/utils/query";
import { logError } from "@b/utils/logger";

const clients = new Map();

export async function handleWsMethod(app, routePath, entryPath) {
  app.ws(routePath, {
    upgrade: async (response, request, context) => {
      const res = new Response(response);
      const req = new Request(response, request);
      let metadata;

      req.params = parseParams(routePath, req.url);
      try {
        const handlerModule = await import(entryPath);
        metadata = handlerModule.metadata;
        if (!metadata) {
          throw new Error(`Metadata not found for ${entryPath}`);
        }
        req.setMetadata(metadata);
      } catch (error) {
        logError("websocket", error, entryPath);
        res.cork(async () => {
          res.handleError(500, "Internal Server Error");
        });
        return;
      }

      try {
        if (metadata.requiresAuth) {
          await rateLimit(res, req, async () => {
            await authenticate(res, req, routePath, async () => {
              await rolesGate(app, res, req, routePath, "ws", async () => {
                res.cork(async () => {
                  res.upgrade(
                    {
                      user: req.user,
                      params: req.params,
                      query: req.query,
                      path: req.url,
                    },
                    req.headers["sec-websocket-key"],
                    req.headers["sec-websocket-protocol"],
                    req.headers["sec-websocket-extensions"],
                    context
                  );
                });
              });
            });
          });
        } else {
          res.cork(async () => {
            res.upgrade(
              {
                user: {
                  id: req.query?.userId || makeUuid(),
                  role: req.query?.userId ? "user" : "guest",
                },
                params: req.params,
                query: req.query,
                path: req.url,
              },
              req.headers["sec-websocket-key"],
              req.headers["sec-websocket-protocol"],
              req.headers["sec-websocket-extensions"],
              context
            );
          });
        }
      } catch (error) {
        logError("websocket", error, entryPath);
        res.cork(async () => {
          res.close();
        });
      }
    },
    open: (ws) => {
      if (!ws.user || typeof ws.user.id === "undefined") {
        console.error("User or user ID is undefined", ws.user);
        return;
      }
      const clientId = ws.user.id;
      // Initialize client with empty subscriptions set
      addClient(ws.path, clientId, ws, undefined);
    },
    message: async (ws, message, isBinary) => {
      const handlerModule = await import(entryPath);
      const handler = handlerModule.default;
      const preparedMessage = Buffer.from(message).toString("utf-8");
      try {
        const parsedMessage = JSON.parse(preparedMessage);
        if (
          parsedMessage.action === "SUBSCRIBE" ||
          parsedMessage.action === "UNSUBSCRIBE"
        ) {
          handleSubscriptionChange(ws, parsedMessage);
        }

        const result = await handler(ws, parsedMessage, isBinary);
        if (result) {
          sendMessageToClient(ws.user.id, result);
        }
      } catch (error) {
        logError("websocket", error, entryPath);
        console.error(`Failed to parse message: ${error}`);
      }
    },
    close: (ws) => {
      removeClient(ws.path, ws.user.id);
    },
  });
}

export const addClient = (route, clientId, ws, subscription) => {
  if (!route || !clientId || !ws) return;
  if (!clients.has(route)) {
    clients.set(route, new Map());
  }
  const routeClients = clients.get(route);
  if (!routeClients.has(clientId)) {
    // Ensure only valid, non-empty subscriptions are added
    routeClients.set(clientId, {
      ws,
      subscriptions: new Set(subscription ? [subscription] : []),
    });
  } else {
    const clientDetails = routeClients.get(clientId);
    if (subscription) {
      clientDetails.subscriptions.add(subscription);
    }
  }
};

export const removeClient = (route, clientId) => {
  if (clients.has(route)) {
    const routeClients = clients.get(route);
    routeClients.delete(clientId);
    if (routeClients.size === 0) {
      clients.delete(route);
    }
  }
};

export const removeSubscription = (route, clientId, subscription) => {
  if (clients.has(route) && clients.get(route).has(clientId)) {
    const clientDetails = clients.get(route).get(clientId);
    clientDetails.subscriptions.delete(subscription);
    if (clientDetails.subscriptions.size === 0) {
      clients.get(route).delete(clientId);
    }
  }
};

function handleSubscriptionChange(ws, parsedMessage) {
  if (!parsedMessage.payload) {
    throw new Error("Invalid subscription payload");
  }

  const clientId = ws.user.id;
  const path = ws.path;
  // Use the stringified payload as the subscription key
  const subscription = JSON.stringify(parsedMessage.payload);

  switch (parsedMessage.action) {
    case "SUBSCRIBE":
      addClient(path, clientId, ws, subscription);
      break;
    case "UNSUBSCRIBE":
      removeSubscription(path, clientId, subscription);
      break;
    default:
      throw new Error(`Unsupported action: ${parsedMessage.action}`);
  }
}

export const sendMessageToClient = (clientId, message, isBinary = false) => {
  const route = "/api/user";
  if (clients.has(route) && clients.get(route).has(clientId)) {
    const clientDetails = clients.get(route).get(clientId);
    try {
      clientDetails.ws.cork(() => {
        if (isBinary) {
          // If the message should be sent as binary, we need to convert it to a buffer
          const bufferMessage = Buffer.from(JSON.stringify(message));
          clientDetails.ws.send(bufferMessage, true); // The second parameter indicates it's a binary message
        } else {
          clientDetails.ws.send(JSON.stringify(message));
        }
      });
    } catch (error) {
      logError("websocket", error, route);
      clients.get(route).delete(clientId);
    }
  } else {
    console.error(`Client ${clientId} not found in route ${route}`);
  }
};

export const sendMessageToRoute = (route, payload, data) => {
  try {
    const subscription = JSON.stringify(payload);
    const message = JSON.stringify(data);
    if (clients.has(route)) {
      const routeClients = clients.get(route);
      routeClients.forEach((clientDetails) => {
        if (clientDetails.subscriptions.has(subscription)) {
          try {
            clientDetails.ws.cork(() => {
              clientDetails.ws.send(message);
            });
          } catch (error) {
            logError("websocket", error, route);
          }
        }
      });
    }
  } catch (error) {
    console.log("Error in sendMessageToRoute", error);
  }
};

export const sendMessageToRouteClients = (route, data) => {
  const message = JSON.stringify(data);
  if (clients.has(route)) {
    const routeClients = clients.get(route);
    routeClients.forEach((clientDetails) => {
      try {
        clientDetails.ws.cork(() => {
          clientDetails.ws.send(message);
        });
      } catch (error) {
        logError("websocket", error, route);
      }
    });
  }
};

export const getClients = () => clients;
export const hasClients = (route) => clients.has(route);
export const getRouteClients = (route) => {
  if (clients.has(route)) {
    return clients.get(route);
  }
  return new Map();
};
export const getRouteClient = (route, clientId) => {
  if (clients.has(route) && clients.get(route).has(clientId)) {
    return clients.get(route).get(clientId);
  }
  return null;
};
export const getRouteClientSubscriptions = (route, clientId) => {
  if (clients.has(route) && clients.get(route).has(clientId)) {
    return clients.get(route).get(clientId).subscriptions;
  }
  return new Set();
};
export const getRouteSubscriptions = (route) => {
  if (clients.has(route)) {
    const subscriptions = new Set();
    clients.get(route).forEach((clientDetails) => {
      clientDetails.subscriptions.forEach((subscription) => {
        subscriptions.add(subscription);
      });
    });
    return subscriptions;
  }
  return new Set();
};
export const getRouteClientCount = (route) => {
  if (clients.has(route)) {
    return clients.get(route).size;
  }
  return 0;
};

/**
 * Utility function to handle WebSocket messages for announcements or notifications.
 *
 * @param {string} type - The type of message (e.g., "announcement" or "notification").
 * @param {string} model - The model name to fetch records from.
 * @param {string|string[]} id - The ID or array of IDs of the record(s).
 * @param {object} data - The data to update the record with.
 * @param {boolean | undefined} status - Flag indicating whether to fetch the full record from the database.
 *                                          - true: create
 *                                          - false: delete
 *                                          - undefined: update
 */
export const handleRouteClientsMessage = async ({
  type,
  model,
  id,
  data,
  method,
  status,
}: {
  type: string;
  method: "create" | "update" | "delete";
  model?: string;
  id?: string | string[];
  data?: object;
  status?: boolean;
}) => {
  let payload;

  const sendMessage = (
    method: "create" | "update" | "delete",
    payload: any
  ) => {
    sendMessageToRouteClients("/api/user", {
      type: type,
      method: method,
      payload,
    });
  };

  if (method === "update") {
    if (!id) throw new Error("ID is required for update method");
    if (status === true) {
      if (!model) throw new Error("Model is required for update method");
      // Fetch the full record to create
      if (Array.isArray(id)) {
        const records = await getRecords(model, id);
        if (!records || records.length === 0) {
          throw new Error(`Records with IDs ${id.join(", ")} not found`);
        }
        payload = records;
      } else {
        const record = await getRecord(model, id);
        if (!record) {
          throw new Error(`Record with ID ${id} not found`);
        }
        payload = record;
      }
      sendMessage("create", payload);
    } else if (status === false) {
      // Send a delete message
      sendMessage(
        "delete",
        Array.isArray(id) ? id.map((id) => ({ id })) : { id: id }
      );
    } else {
      // Send an update message
      payload = { id: id, data };
      sendMessage("update", payload);
    }
  } else {
    // Handle create or delete directly
    if (method === "create") {
      if (data) {
        payload = data;
      } else {
        if (!model || !id)
          throw new Error("Model and ID are required for create method");
        if (Array.isArray(id)) {
          const records = await getRecords(model, id);
          if (!records || records.length === 0) {
            throw new Error(`Records with IDs ${id.join(", ")} not found`);
          }
          payload = records;
        } else {
          const record = await getRecord(model, id);
          if (!record) {
            throw new Error(`Record with ID ${id} not found`);
          }
          payload = record;
        }
      }
      sendMessage("create", payload);
    } else if (method === "delete") {
      if (!id) throw new Error("ID is required for update method");
      sendMessage(
        "delete",
        Array.isArray(id) ? id.map((id) => ({ id })) : { id: id }
      );
    }
  }
};

/**
 * Utility function to handle WebSocket messages for a specific client.
 *
 * @param {string} type - The type of message (e.g., "announcement" or "notification").
 * @param {string} clientId - The ID of the client to send the message to.
 * @param {string} model - The model name to fetch records from.
 * @param {string|string[]} id - The ID or array of IDs of the record(s).
 * @param {object} data - The data to update the record with.
 * @param {boolean | undefined} status - Flag indicating whether to fetch the full record from the database.
 *                                          - true: create
 *                                          - false: delete
 *                                          - undefined: update
 */
export const handleClientMessage = async ({
  type,
  clientId,
  model,
  id,
  data,
  method,
  status,
}: {
  type: string;
  method: "create" | "update" | "delete";
  clientId: string;
  model?: string;
  id?: string | string[];
  data?: object;
  status?: boolean;
}) => {
  let payload;

  const sendMessage = (
    method: "create" | "update" | "delete",
    payload: any
  ) => {
    sendMessageToClient(clientId, {
      type: type,
      method: method,
      payload,
    });
  };

  if (method === "update") {
    if (!id) throw new Error("ID is required for update method");
    if (status === true) {
      if (!model) throw new Error("Model is required for update method");
      // Fetch the full record to create
      if (Array.isArray(id)) {
        const records = await getRecords(model, id);
        if (!records || records.length === 0) {
          throw new Error(`Records with IDs ${id.join(", ")} not found`);
        }
        payload = records;
      } else {
        const record = await getRecord(model, id);
        if (!record) {
          throw new Error(`Record with ID ${id} not found`);
        }
        payload = record;
      }
      sendMessage("create", payload);
    } else if (status === false) {
      // Send a delete message
      sendMessage(
        "delete",
        Array.isArray(id) ? id.map((id) => ({ id })) : { id: id }
      );
    } else {
      // Send an update message
      payload = { id: id, data };
      sendMessage("update", payload);
    }
  } else {
    // Handle create or delete directly
    if (method === "create") {
      if (data) {
        payload = data;
      } else {
        if (!model || !id)
          throw new Error("Model and ID are required for create method");
        if (Array.isArray(id)) {
          const records = await getRecords(model, id);
          if (!records || records.length === 0) {
            throw new Error(`Records with IDs ${id.join(", ")} not found`);
          }
          payload = records;
        } else {
          const record = await getRecord(model, id);
          if (!record) {
            throw new Error(`Record with ID ${id} not found`);
          }
          payload = record;
        }
      }
      sendMessage("create", payload);
    } else if (method === "delete") {
      if (!id) throw new Error("ID is required for delete method");
      sendMessage(
        "delete",
        Array.isArray(id) ? id.map((id) => ({ id })) : { id: id }
      );
    }
  }
};
