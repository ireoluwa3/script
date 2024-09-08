// /server/api/admin/support/tickets/index.get.ts

import { models } from "@b/db";
import {
  getFiltered,
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { crudParameters, paginationSchema } from "@b/utils/constants";
import { baseSupportTicketSchema } from "./utils";
import { createError } from "@b/utils/error";
import { Op } from "sequelize";

export const metadata: OperationObject = {
  summary: "Lists all support tickets with pagination and optional filtering",
  operationId: "listSupportTickets",
  tags: ["Admin", "CRM", "Support Ticket"],
  parameters: crudParameters,
  responses: {
    200: {
      description:
        "Paginated list of support tickets with detailed information",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: baseSupportTicketSchema,
                },
              },
              pagination: paginationSchema,
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Support Tickets"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
  permission: "Access Support Ticket Management",
};

export default async (data: Handler) => {
  const { query, user } = data;
  if (!user?.id)
    throw createError({ statusCode: 401, message: "Unauthorized" });

  return getFiltered({
    model: models.supportTicket,
    query,
    sortField: query.sortField || "createdAt",
    where: { userId: { [Op.ne]: user.id } },
    includeModels: [
      {
        model: models.user,
        as: "user",
        attributes: ["firstName", "lastName", "email", "avatar"],
      },
      {
        model: models.user,
        as: "agent",
        attributes: ["firstName", "lastName", "email", "avatar"],
      },
    ],
  });
};
