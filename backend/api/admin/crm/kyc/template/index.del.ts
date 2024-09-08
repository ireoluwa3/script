// /server/api/kyc/templates/delete.del.ts

import {
  commonBulkDeleteParams,
  commonBulkDeleteResponses,
  handleBulkDelete,
} from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Bulk deletes KYC templates by IDs",
  operationId: "bulkDeleteKycTemplates",
  tags: ["Admin", "CRM", "KYC Template"],
  parameters: commonBulkDeleteParams("KYC Templates"),
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
              description: "Array of KYC template IDs to delete",
            },
          },
          required: ["ids"],
        },
      },
    },
  },
  responses: commonBulkDeleteResponses("KYC Templates"),
  requiresAuth: true,
  permission: "Access KYC Template Management",
};

export default async (data: Handler) => {
  const { body, query } = data;
  const { ids } = body;
  return handleBulkDelete({
    model: "kycTemplate",
    ids,
    query,
  });
};
