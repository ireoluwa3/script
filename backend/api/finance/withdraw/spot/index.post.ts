import ExchangeManager from "@b/utils/exchange";
// /server/api/finance/withdraw/spot/index.post.ts

import { models, sequelize } from "@b/db";
import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { createError } from "@b/utils/error";

export const metadata: OperationObject = {
  summary: "Performs a withdraw transaction",
  description:
    "Initiates a withdraw transaction for the currently authenticated user",
  operationId: "createWithdraw",
  tags: ["Wallets"],
  requiresAuth: true,
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            currency: {
              type: "string",
              description: "Currency to withdraw",
            },
            chain: {
              type: "string",
              description: "Withdraw method ID",
            },
            amount: {
              type: "number",
              description: "Amount to withdraw",
            },
            toAddress: {
              type: "string",
              description: "Withdraw toAddress",
            },
          },
          required: ["currency", "chain", "amount", "toAddress"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "Withdraw transaction initiated successfully",
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
    404: notFoundMetadataResponse("Withdraw"),
    500: serverErrorResponse,
  },
};

export default async (data: Handler) => {
  const { user, body } = data;
  if (!user?.id)
    throw createError({ statusCode: 401, message: "Unauthorized" });

  const { currency, chain, amount, toAddress } = body;

  const userPk = await models.user.findByPk(user.id);
  if (!userPk)
    throw createError({ statusCode: 404, message: "User not found" });

  const wallet = await models.wallet.findOne({
    where: { userId: user.id, currency: currency, type: "SPOT" },
  });
  if (!wallet) {
    throw new Error("Wallet not found");
  }

  const currencyData = await models.exchangeCurrency.findOne({
    where: { currency: wallet.currency },
  });
  if (!currencyData) {
    throw new Error("Currency not found");
  }

  const exchange = await ExchangeManager.startExchange();
  const provider = await ExchangeManager.getProvider();
  if (!exchange) throw createError(500, "Exchange not found");

  const currencies: Record<string, ExchangeCurrency> =
    await exchange.fetchCurrencies();

  const exchangeCurrency = Object.values(currencies).find(
    (c) => c.id === currency
  ) as ExchangeCurrency;
  if (!exchangeCurrency) throw createError(404, "Currency not found");

  let fixedFee = 0;
  switch (provider) {
    case "binance":
    case "kucoin":
      fixedFee =
        exchangeCurrency.networks[chain].fee ||
        exchangeCurrency.networks[chain].fees?.withdraw;
      break;
    default:
      break;
  }

  const parsedAmount = parseFloat(amount);
  const percentageFee = currencyData.fee || 0;
  const taxAmount = parseFloat(
    Math.max((parsedAmount * percentageFee) / 100 + fixedFee, 0).toFixed(2)
  );

  const Total = parsedAmount + taxAmount;

  if (wallet.balance < Total) {
    throw new Error("Insufficient funds");
  }

  const newBalance = parseFloat(
    (wallet.balance - Total).toFixed(currencyData.precision || 6)
  );

  if (newBalance < 0) {
    throw new Error("Insufficient funds");
  }

  const transaction = await sequelize.transaction(async (t) => {
    wallet.balance = newBalance;
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
          chain,
          currency,
          toAddress,
        }),
        description: `Withdrawal of ${parsedAmount} ${wallet.currency} by ${chain} network`,
      },
      { transaction: t }
    );
  });

  return {
    transaction,
    currency: wallet.currency,
    method: chain,
    balance: wallet.balance,
  };
};
