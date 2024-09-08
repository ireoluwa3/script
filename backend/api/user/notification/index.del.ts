// /server/api/admin/notifications/delete.del.ts

import { createError } from "@b/utils/error";
import {
  commonBulkDeleteParams,
  commonBulkDeleteResponses,
  handleBulkDelete,
} from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Bulk deletes notifications by IDs",
  operationId: "bulkDeleteNotifications",
  tags: ["Notifications"],
  parameters: commonBulkDeleteParams("Notifications"),
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            ids: {
              type: "array",
              items: { type: "string" },
              description: "Array of notification IDs to delete",
            },
          },
          required: ["ids"],
        },
      },
    },
  },
  responses: commonBulkDeleteResponses("Notifications"),
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { user, body, query } = data;
  if (!user?.id) throw createError(401, "Unauthorized");

  const { ids } = body;
  return handleBulkDelete({
    model: "notification",
    ids,
    query,
    where: { userId: user.id },
  });
};
