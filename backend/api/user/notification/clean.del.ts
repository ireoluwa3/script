// /server/api/admin/notifications/delete.del.ts

import { models } from "@b/db";
import { createError } from "@b/utils/error";
import { commonBulkDeleteResponses } from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "delete all notifications",
  operationId: "bulkDeleteNotifications",
  tags: ["Notifications"],
  parameters: [
    {
      in: "query",
      name: "type",
      description: "Type of notification",
      schema: {
        type: "string",
      },
    },
  ],
  responses: commonBulkDeleteResponses("Notifications"),
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { user, query } = data;
  if (!user?.id) throw createError(401, "Unauthorized");

  const { type } = query;

  await models.notification.destroy({
    where: { userId: user.id, type },
  });

  return { message: "Notifications deleted" };
};
