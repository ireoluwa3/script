import { updateRecordResponses, updateStatus } from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Updates the status of a KYC application",
  operationId: "updateKycApplicationStatus",
  tags: ["Admin", "CRM", "KYC"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      description: "ID of the KYC application to update",
      schema: { type: "string" },
    },
  ],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            status: {
              type: "string",
              description: "New status to apply",
              enum: ["PENDING", "APPROVED", "REJECTED"],
            },
          },
          required: ["status"],
        },
      },
    },
  },
  responses: updateRecordResponses("KYC Application"),
  requiresAuth: true,
  permission: "Access KYC Application Management",
};

export default async (data: Handler) => {
  const { body, params } = data;
  const { id } = params;
  const { status } = body;
  return updateStatus("kyc", id, status);
};
