// /server/api/wallets/fiat/customWithdraw.post.ts

import { models, sequelize } from "@b/db";
import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { createError } from "@b/utils/error";

export const metadata: OperationObject = {
  summary: "Performs a custom fiat withdraw transaction",
  description:
    "Initiates a custom fiat withdraw transaction for the currently authenticated user",
  operationId: "createCustomFiatWithdraw",
  tags: ["Wallets"],
  requiresAuth: true,
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            methodId: {
              type: "string",
              description: "Withdraw method ID",
            },
            amount: {
              type: "number",
              description: "Amount to withdraw",
            },
            currency: {
              type: "string",
              description: "Currency to withdraw",
            },
            customFields: {
              type: "object",
              description: "Custom data for the withdraw",
            },
          },
          required: ["methodId", "amount", "currency", "customFields"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "Custom withdraw transaction initiated successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "Success message",
              },
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Withdraw Method"),
    500: serverErrorResponse,
  },
};

export default async (data: Handler) => {
  const { user, body } = data;
  if (!user?.id)
    throw createError({ statusCode: 401, message: "Unauthorized" });

  const { methodId, amount, currency, customFields } = body;

  const userPk = await models.user.findByPk(user.id);
  if (!userPk)
    throw createError({ statusCode: 404, message: "User not found" });

  const wallet = await models.wallet.findOne({
    where: { userId: user.id, currency: currency, type: "FIAT" },
  });
  if (!wallet) {
    throw new Error("Wallet not found");
  }

  const method = await models.withdrawMethod.findByPk(methodId);
  if (!method) {
    throw new Error("Withdraw method not found");
  }

  const currencyData = await models.currency.findOne({
    where: { id: wallet.currency },
  });
  if (!currencyData) {
    throw new Error("Currency not found");
  }

  const parsedAmount = parseFloat(amount);
  const fixedFee = method.fixedFee || 0;
  const percentageFee = method.percentageFee || 0;
  const taxAmount = parseFloat(
    Math.max((parsedAmount * percentageFee) / 100 + fixedFee, 0).toFixed(2)
  );

  if (wallet.balance < parsedAmount + taxAmount) {
    throw new Error("Insufficient funds");
  }

  const transaction = await sequelize.transaction(async (t) => {
    wallet.balance -= parsedAmount + taxAmount;
    await wallet.save({ transaction: t });

    return await models.transaction.create(
      {
        userId: user.id,
        walletId: wallet.id,
        type: "WITHDRAW",
        amount: parsedAmount,
        fee: taxAmount,
        status: "PENDING",
        metadata: JSON.stringify({
          method: method.title,
          ...customFields,
        }),
        description: `Withdrawal of ${parsedAmount} ${wallet.currency} by ${method.title}`,
      },
      { transaction: t }
    );
  });

  return {
    transaction,
    currency: wallet.currency,
    method: method.title,
    balance: wallet.balance,
  };
};
