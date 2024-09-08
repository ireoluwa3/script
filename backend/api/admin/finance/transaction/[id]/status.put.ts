import { updateRecordResponses, updateStatus } from "@b/utils/query";

export const metadata = {
  summary: "Updates the status of a wallet transaction",
  operationId: "updateWalletTransactionStatus",
  tags: ["Admin", "Wallet Transactions"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      description: "ID of the wallet transaction to update",
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
              enum: [
                "COMPLETED",
                "FAILED",
                "CANCELLED",
                "EXPIRED",
                "REJECTED",
                "REFUNDED",
                "TIMEOUT",
              ],
            },
          },
          required: ["status"],
        },
      },
    },
  },
  responses: updateRecordResponses("Wallet Transaction"),
  requiresAuth: true,
  permission: "Access Transaction Management",
};

export default async (data: Handler) => {
  const { body, params } = data;
  const { id } = params;
  const { status } = body;
  return updateStatus("transaction", id, status);
};
