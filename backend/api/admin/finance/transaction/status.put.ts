// /server/api/admin/wallets/transactions/updateTransactionStatus.put.ts

import { sendTransactionStatusUpdateEmail } from "@b/utils/emails";
import { createError } from "@b/utils/error";
import { models } from "@b/db";

export const metadata = {
  summary: "Updates the status of a transaction",
  operationId: "updateTransactionStatus",
  tags: ["Admin", "Wallets"],
  requestBody: {
    required: true,
    description: "Payload to update the transaction status",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            referenceId: {
              type: "string",
              description: "Reference ID of the transaction",
            },
            status: {
              type: "string",
              description: "New status for the transaction",
              enum: [
                "PENDING",
                "COMPLETED",
                "FAILED",
                "CANCELLED",
                "EXPIRED",
                "REJECTED",
                "REFUNDED",
                "TIMEOUT",
              ],
            },
            message: {
              type: "string",
              nullable: true,
              description: "Optional message explaining the status update",
            },
          },
          required: ["referenceId", "status"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "Transaction status updated successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: {
                type: "string",
                description: "Unique identifier of the transaction",
              },
              status: {
                type: "string",
                description: "New status of the transaction",
              },
              message: {
                type: "string",
                nullable: true,
                description: "Optional message explaining the status update",
              },
              balance: {
                type: "number",
                description:
                  "New balance of the wallet after the transaction status update",
              },
            },
          },
        },
      },
    },
    401: {
      description: "Unauthorized, admin permission required",
    },
    404: {
      description: "Transaction not found",
    },
    500: {
      description: "Internal server error",
    },
  },
  requiresAuth: true,
  permission: "Access Transaction Management",
};

export default async (data: Handler) => {
  try {
    const { referenceId, status, message } = data.body;
    const response = await updateTransactionStatusQuery(
      referenceId,
      status,
      message
    );
    return {
      ...response,
      message: "Transaction status updated successfully",
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export async function updateTransactionStatusQuery(
  referenceId: string,
  status: string,
  message?: string
): Promise<Transaction> {
  const transaction = await models.transaction.findOne({
    where: { id: referenceId },
  });

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  const updateData: any = {
    status: status,
    metadata: transaction.metadata,
  };

  const wallet = await models.wallet.findOne({
    where: { id: transaction.walletId },
  });

  if (!wallet) {
    throw new Error("Wallet not found");
  }

  let balance = Number(wallet.balance);

  if (status === "REJECTED") {
    if (message) {
      updateData.metadata.note = message;
    }
    if (transaction.type === "WITHDRAW") {
      balance += Number(transaction.amount);
    }
  } else if (status === "COMPLETED" && transaction.type === "DEPOSIT") {
    balance += Number(transaction.amount) - Number(transaction.fee);
  }

  if (wallet.balance !== balance) {
    await models.wallet.update(
      { balance: balance },
      {
        where: { id: wallet.id },
      }
    );
  }

  await models.transaction.update(updateData, {
    where: { id: referenceId },
  });

  const updatedTransaction = await models.transaction.findOne({
    where: { id: referenceId },
  });

  if (!updatedTransaction) {
    throw createError(500, "Failed to update transaction status");
  }

  const trx = updatedTransaction.get({ plain: true });

  try {
    const user = await models.user.findOne({
      where: { id: transaction.userId },
    });

    await sendTransactionStatusUpdateEmail(
      user,
      trx,
      wallet,
      balance,
      updateData.metadata?.note || null
    );
  } catch (error) {
    console.error(error);
  }

  return trx as unknown as Transaction;
}
