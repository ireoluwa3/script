// /server/api/admin/support-tickets/[id].get.ts

import {
  getRecord,
  unauthorizedResponse,
  notFoundMetadataResponse,
  serverErrorResponse,
} from "@b/utils/query";
import { supportTicketSchema } from "../utils"; // Assuming the schema is in a separate file.
import { models } from "@b/db";

export const metadata: OperationObject = {
  summary: "Retrieves a specific support ticket by ID",
  operationId: "getSupportTicketById",
  tags: ["Admin", "CRM", "Support Ticket"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      description: "ID of the support ticket to retrieve",
      schema: { type: "string" },
    },
  ],
  responses: {
    200: {
      description: "Support ticket details",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: supportTicketSchema,
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Support ticket not found"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
  permission: "Access Support Ticket Management",
};

export default async (data: Handler) => {
  const { params } = data;

  return await getRecord("supportTicket", params.id, [
    {
      model: models.user,
      as: "agent",
      attributes: ["avatar", "firstName", "lastName", "lastLogin"],
    },
    {
      model: models.user,
      as: "user",
      attributes: ["firstName", "lastName", "email", "avatar"],
    },
  ]);
};
