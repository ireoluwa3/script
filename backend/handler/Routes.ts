import fs from "fs/promises";
import path from "path";
import { Request, Response } from "..";
import { authenticate, rateLimit, rolesGate } from "../handler/Middleware";
import { handleWsMethod } from "./Websocket";
import { sanitizePath } from "@b/utils/validation";
import { isProduction } from "@b/utils/constants";
import { logError } from "@b/utils/logger";

const fileExtension = isProduction ? ".js" : ".ts";

export async function setupApiRoutes(app, startPath, basePath = "/api") {
  const entries = await fs.readdir(startPath, { withFileTypes: true });

  const sortedEntries = entries.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return 1;
    if (!a.isDirectory() && b.isDirectory()) return -1;
    if (a.isDirectory() && b.isDirectory()) {
      const aHasBrackets = a.name.includes("[");
      const bHasBrackets = b.name.includes("[");
      if (aHasBrackets && !bHasBrackets) return 1;
      if (!aHasBrackets && bHasBrackets) return -1;
    }
    return 0;
  });

  for (const entry of sortedEntries) {
    const entryPath = sanitizePath(path.join(startPath, entry.name));

    if (
      entry.isDirectory() ||
      entry.name === `queries${fileExtension}` ||
      entry.name === `utils${fileExtension}`
    ) {
      if (entry.isDirectory()) {
        await setupApiRoutes(
          app,
          entryPath,
          `${basePath}/${entry.name.replace(/\[(\w+)\]/, ":$1")}`
        );
      }
      continue;
    }

    const [fileName, method] = entry.name.split(".");
    let routePath = basePath + (fileName !== "index" ? `/${fileName}` : "");
    routePath = routePath
      .replace(/\[(\w+)\]/g, ":$1")
      .replace(/\.get|\.post|\.put|\.delete|\.del|\.ws/, "");

    if (typeof app[method] === "function") {
      if (method === "ws") {
        handleWsMethod(app, routePath, entryPath);
      } else {
        handleHttpMethod(app, method, routePath, entryPath);
      }
    }
  }
}

async function handleHttpMethod(app, method, routePath, entryPath) {
  app[method](routePath, async (res, req) => {
    let metadata, handler;

    try {
      const handlerModule = await import(entryPath);
      handler = handlerModule.default;
      metadata = handlerModule.metadata;

      if (!metadata) {
        throw new Error(`Metadata not found for ${entryPath}`);
      }
      req.setMetadata(metadata);
    } catch (error) {
      logError("route", error, entryPath);
      res.handleError(500, "Internal Server Error");
      return;
    }

    try {
      await req.parseBody();
    } catch (error) {
      logError("route", error, entryPath);
      res.handleError(400, `Invalid request body: ${error.message}`);
      return;
    }

    if (!metadata.requiresAuth) {
      return await handleRequest(res, req, handler, entryPath);
    }

    await rateLimit(res, req, async () => {
      await authenticate(res, req, routePath, async () => {
        await rolesGate(app, res, req, routePath, method, async () => {
          await handleRequest(res, req, handler, entryPath);
        });
      });
    });
  });
}

async function handleRequest(
  res: Response,
  req: Request,
  handler,
  entryPath: string
) {
  try {
    const result = await handler(req);
    res.sendResponse(req, 200, result);
  } catch (error) {
    logError("route", error, entryPath);
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    res.handleError(statusCode, message);
  }
}
