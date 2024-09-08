import { updateRecordResponses, updateStatus } from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Bulk updates the status of KYC applications",
  operationId: "bulkUpdateKycStatus",
  tags: ["Admin", "CRM", "KYC"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            ids: {
              type: "array",
              description: "Array of KYC application IDs to update",
              items: { type: "string" },
            },
            status: {
              type: "string",
              description: "New status to apply to the KYC applications",
              enum: ["PENDING", "APPROVED", "REJECTED"],
            },
          },
          required: ["ids", "status"],
        },
      },
    },
  },
  responses: updateRecordResponses("KYC"),
  requiresAuth: true,
  permission: "Access KYC Application Management",
};

export default async (data: Handler) => {
  const { body } = data;
  const { ids, status } = body;
  return updateStatus("kyc", ids, status);
};
