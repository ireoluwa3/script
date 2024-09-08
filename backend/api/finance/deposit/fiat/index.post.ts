// /server/api/wallets/fiat/customDeposit.post.ts

import { models } from "@b/db";
import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { createError } from "@b/utils/error";

export const metadata: OperationObject = {
  summary: "Performs a custom fiat deposit transaction",
  description:
    "Initiates a custom fiat deposit transaction for the currently authenticated user",
  operationId: "createCustomFiatDeposit",
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
              description: "Deposit method ID",
            },
            amount: {
              type: "number",
              description: "Amount to deposit",
            },
            currency: {
              type: "string",
              description: "Currency to deposit",
            },
            customFields: {
              type: "object",
              description: "Custom data for the deposit",
            },
          },
          required: ["methodId", "amount", "currency", "customFields"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "Custom deposit transaction initiated successfully",
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
    404: notFoundMetadataResponse("Deposit Method"),
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

  let wallet = await models.wallet.findOne({
    where: { userId: user.id, currency: currency, type: "FIAT" },
  });
  if (!wallet) {
    wallet = await models.wallet.create({
      userId: user.id,
      currency: currency,
      type: "FIAT",
    });
  }

  const method = await models.depositMethod.findByPk(methodId);
  if (!method) {
    throw new Error("Deposit method not found");
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

  const transaction = await models.transaction.create({
    userId: user.id,
    walletId: wallet.id,
    type: "DEPOSIT",
    amount: parsedAmount,
    fee: taxAmount,
    status: "PENDING",
    metadata: JSON.stringify({
      method: method.title,
      ...customFields,
    }),
    description: `Deposit ${parsedAmount} ${wallet.currency} by ${method.title}`,
  });

  return {
    transaction,
    currency: wallet.currency,
    method: method.title,
  };
};
