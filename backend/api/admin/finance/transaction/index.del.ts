// /server/api/admin/wallets/transactions/delete.del.ts

import {
  commonBulkDeleteParams,
  commonBulkDeleteResponses,
  handleBulkDelete,
} from "@b/utils/query";

export const metadata = {
  summary: "Bulk deletes transactions by IDs",
  operationId: "bulkDeleteTransactions",
  tags: ["Admin", "Transaction"],
  parameters: commonBulkDeleteParams("Transactions"),
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
              description: "Array of transaction IDs to delete",
            },
          },
          required: ["ids"],
        },
      },
    },
  },
  responses: commonBulkDeleteResponses("Transactions"),
  requiresAuth: true,
  permission: "Access Transaction Management",
};

export default async (data: Handler) => {
  const { body, query } = data;
  const { ids } = body;
  return handleBulkDelete({
    model: "transaction",
    ids,
    query,
  });
};
