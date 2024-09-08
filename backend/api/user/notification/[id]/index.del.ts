// /server/api/admin/notifications/index.delete.ts
import { createError } from "@b/utils/error";
import {
  deleteRecordParams,
  deleteRecordResponses,
  handleSingleDelete,
} from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Deletes a specific notification",
  operationId: "deleteNotification",
  tags: ["Notifications"],
  parameters: deleteRecordParams("notification"), // Assumes your function is designed to handle this input
  responses: deleteRecordResponses("notification"), // Assumes this function provides standardized responses
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { user, params, query } = data;
  if (!user?.id) throw createError(401, "Unauthorized");

  return handleSingleDelete({
    model: "notification",
    id: params.id,
    query,
    where: { userId: user.id },
  });
};
