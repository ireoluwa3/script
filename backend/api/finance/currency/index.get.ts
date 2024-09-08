// /server/api/currencies/index.get.ts

import { createError } from "@b/utils/error";
import { baseCurrencySchema, baseResponseSchema } from "./utils";

import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { models } from "@b/db";
import { Op } from "sequelize";

export const metadata: OperationObject = {
  summary: "Lists all currencies with their current rates",
  description:
    "This endpoint retrieves all available currencies along with their current rates.",
  operationId: "getCurrencies",
  tags: ["Finance", "Currency"],
  parameters: [
    {
      name: "action",
      in: "query",
      description: "The action to perform",
      required: false,
      schema: {
        type: "string",
      },
    },
    {
      name: "walletType",
      in: "query",
      description: "The type of wallet to retrieve currencies for",
      required: true,
      schema: {
        type: "string",
      },
    },
    {
      name: "targetWalletType",
      in: "query",
      description: "The type of wallet to transfer to",
      required: false,
      schema: {
        type: "string",
      },
    },
  ],
  requiresAuth: true,
  responses: {
    200: {
      description: "Currencies retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              ...baseResponseSchema,
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: baseCurrencySchema,
                },
              },
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Currency"),
    500: serverErrorResponse,
  },
};

const walletTypeToModel = {
  FIAT: async (where) => models.currency.findAll({ where }),
  SPOT: async (where) => models.exchangeCurrency.findAll({ where }),
  ECO: async (where) => models.ecosystemToken.findAll({ where }),
};

export default async (data: Handler) => {
  const { user, query } = data;
  if (!user?.id) throw createError(401, "Unauthorized");

  const { action, walletType, targetWalletType } = query;
  const where = { status: true };

  switch (action) {
    case "deposit":
      return handleDeposit(walletType, where);
    case "withdraw":
      return handleWithdraw(walletType, user.id);
    case "transfer":
      return handleTransfer(walletType, targetWalletType, user.id);
    default:
      throw createError(400, "Invalid action");
  }
};

async function handleDeposit(walletType, where) {
  // Get the model retrieval function based on the wallet type
  const getModel = walletTypeToModel[walletType];
  if (!getModel) throw createError(400, "Invalid wallet type");

  // Fetch currencies using the selected model function
  let currencies = await getModel(where);

  switch (walletType) {
    case "FIAT":
      return currencies.map((currency) => {
        return {
          value: currency.id,
          label: `${currency.id} - ${currency.name}`,
        };
      });
    case "SPOT":
      return currencies.map((currency) => {
        return {
          value: currency.currency,
          label: `${currency.currency} - ${currency.name}`,
        };
      });
    case "ECO":
      const seen = new Set();
      currencies = currencies.filter((currency) => {
        const duplicate = seen.has(currency.currency);
        seen.add(currency.currency);
        return !duplicate;
      });
      return currencies.map((currency) => ({
        value: currency.currency,
        label: `${currency.currency} - ${currency.name}`,
        icon: currency.icon,
      }));
    default:
      throw createError(400, "Invalid wallet type");
  }
}

async function handleWithdraw(walletType, userId) {
  const wallets = await models.wallet.findAll({
    where: { userId, type: walletType, balance: { [Op.gt]: 0 } },
  });

  if (!wallets.length)
    throw createError(404, `No ${walletType} wallets found to withdraw from`);

  const currencies = wallets.map((wallet) => ({
    value: wallet.currency,
    label: `${wallet.currency} - ${wallet.balance}`,
  }));

  return currencies;
}

async function handleTransfer(walletType, targetWalletType, userId) {
  const fromWallets = await models.wallet.findAll({
    where: { userId, type: walletType, balance: { [Op.gt]: 0 } },
  });

  if (!fromWallets.length)
    throw createError(404, `No ${walletType} wallets found to transfer from`);

  const currencies = fromWallets.map((wallet) => ({
    value: wallet.currency,
    label: `${wallet.currency} - ${wallet.balance}`,
  }));

  let targetCurrencies: any[] = [];
  switch (targetWalletType) {
    case "FIAT":
      const fiatCurrencies = await models.currency.findAll({
        where: { status: true },
      });
      targetCurrencies = fiatCurrencies.map((currency) => ({
        value: currency.id,
        label: `${currency.id} - ${currency.name}`,
      }));
      break;
    case "SPOT":
      const spotCurrencies = await models.exchangeCurrency.findAll({
        where: { status: true },
      });

      targetCurrencies = spotCurrencies.map((currency) => ({
        value: currency.currency,
        label: `${currency.currency} - ${currency.name}`,
      }));
      break;
    case "ECO":
    case "FUTURES":
      const ecoCurrencies = await models.ecosystemToken.findAll({
        where: { status: true },
      });

      targetCurrencies = ecoCurrencies.map((currency) => ({
        value: currency.currency,
        label: `${currency.currency} - ${currency.name}`,
      }));
      break;
    default:
      throw createError(400, "Invalid wallet type");
  }

  return { from: currencies, to: targetCurrencies };
}
