import { models } from "@b/db";
import {
  getFiltered,
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { crudParameters, paginationSchema } from "@b/utils/constants";
import { createError } from "@b/utils/error";

export const metadata: OperationObject = {
  summary: "List all notifications",
  description: "Retrieves a paginated list of all notifications for users.",
  operationId: "getNotifications",
  tags: ["Notifications"],
  parameters: crudParameters, // Includes pagination and filtering parameters
  responses: {
    200: {
      description: "Notifications retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string", description: "Notification ID" },
                    type: { type: "string", description: "Notification type" },
                    title: {
                      type: "string",
                      description: "Notification title",
                    },
                    message: {
                      type: "string",
                      description: "Notification message",
                    },
                    link: {
                      type: "string",
                      description: "Link associated with the notification",
                    },
                    createdAt: {
                      type: "string",
                      format: "date-time",
                      description: "Creation date of the notification",
                    },
                    updatedAt: {
                      type: "string",
                      format: "date-time",
                      description: "Last update date of the notification",
                    },
                  },
                },
              },
              pagination: paginationSchema,
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Notifications"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { user, query } = data;
  if (!user?.id) throw createError(401, "Unauthorized");

  return getFiltered({
    model: models.notification,
    query,
    where: { userId: user.id },
    sortField: query.sortField || "createdAt",
    paranoid: false,
    includeModels: [
      {
        model: models.user,
        as: "user",
        attributes: ["id", "avatar", "firstName", "lastName"],
      },
    ],
  });
};
