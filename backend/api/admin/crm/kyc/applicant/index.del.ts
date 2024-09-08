// /server/api/kyc/applications/delete.del.ts

import {
  commonBulkDeleteParams,
  commonBulkDeleteResponses,
  handleBulkDelete,
} from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Bulk deletes KYC applications by IDs",
  operationId: "bulkDeleteKycApplications",
  tags: ["Admin", "CRM", "KYC"],
  parameters: commonBulkDeleteParams("KYC Applications"),
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
              description: "Array of KYC application IDs to delete",
            },
          },
          required: ["ids"],
        },
      },
    },
  },
  responses: commonBulkDeleteResponses("KYC Applications"),
  requiresAuth: true,
  permission: "Access KYC Application Management",
};

export default async (data: Handler) => {
  const { body, query } = data;
  const { ids } = body;
  return handleBulkDelete({
    model: "kyc",
    ids,
    query,
  });
};
