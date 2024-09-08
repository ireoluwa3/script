// /server/api/admin/users/[id].delete.ts

import {
  deleteRecordParams,
  deleteRecordResponses,
  handleSingleDelete,
} from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Deletes a specific user by UUID",
  operationId: "deleteUserByUuid",
  tags: ["Admin", "CRM", "User"],
  parameters: deleteRecordParams("user"),
  responses: deleteRecordResponses("User"),
  requiresAuth: true,
  permission: "Access User Management",
};

export default async (data: Handler) => {
  const { params, query } = data;
  return handleSingleDelete({
    model: "user",
    id: params.id,
    query,
  });
};
