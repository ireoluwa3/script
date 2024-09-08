import { updateRecord, updateRecordResponses } from "@b/utils/query";
import { apiKeyUpdateSchema } from "../utils";

export const metadata: OperationObject = {
  summary: "Updates a specific API Key",
  operationId: "updateApiKey",
  tags: ["Admin", "API Keys"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      description: "ID of the API key to update",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  requestBody: {
    description: "New data for the API key",
    content: {
      "application/json": {
        schema: apiKeyUpdateSchema,
      },
    },
  },
  responses: updateRecordResponses("API Key"),
  requiresAuth: true,
  permission: "Access API Key Management",
};

export default async (data) => {
  const { body, params } = data;
  const { id } = params;

  // Destructure the fields to be updated from the request body
  const { key, permissions, ipWhitelist } = body;

  // Ensure that permissions and ipWhitelist are properly formatted
  const updatedData = {
    ...(key && { key }),
    ...(permissions && {
      permissions: Array.isArray(permissions) ? permissions : [],
    }),
    ...(ipWhitelist && {
      ipWhitelist: Array.isArray(ipWhitelist) ? ipWhitelist : [],
    }),
  };

  // Update the record in the database
  return await updateRecord("apiKey", id, updatedData);
};
