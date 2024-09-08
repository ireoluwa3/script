import ExchangeManager from "@b/utils/exchange";
// /server/api/currencies/show.get.ts

import { baseCurrencySchema, baseResponseSchema } from "../../../utils";
import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { createError } from "@b/utils/error";
import { sanitizeErrorMessage } from "@b/api/exchange/utils";

export const metadata: OperationObject = {
  summary: "Retrieves a single currency by its ID",
  description: "This endpoint retrieves a single currency by its ID.",
  operationId: "getCurrencyById",
  tags: ["Finance", "Currency"],
  requiresAuth: true,
  parameters: [
    {
      index: 0,
      name: "type",
      in: "path",
      required: true,
      schema: {
        type: "string",
        enum: ["SPOT"],
      },
    },
    {
      index: 1,
      name: "code",
      in: "path",
      required: true,
      schema: {
        type: "string",
      },
    },
    {
      index: 2,
      name: "method",
      in: "path",
      required: false,
      schema: {
        type: "string",
      },
    },
  ],
  responses: {
    200: {
      description: "Currency retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              ...baseResponseSchema,
              data: {
                type: "object",
                properties: baseCurrencySchema,
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

export default async (data: Handler) => {
  const { user, params } = data;
  if (!user?.id) throw createError(401, "Unauthorized");

  const { type, code, method } = params;
  if (!type || !code) throw createError(400, "Invalid type or code");

  if (type !== "SPOT") throw createError(400, "Invalid type");

  const exchange = await ExchangeManager.startExchange();
  if (!exchange) throw createError(500, "Exchange not found");

  try {
    if (exchange.has["fetchDepositAddressesByNetwork"]) {
      const depositAddress = await exchange.fetchDepositAddressesByNetwork(
        code,
        method
      );

      if (!depositAddress) throw createError(404, "Currency not found");

      return { ...depositAddress[method], trx: true };
    } else if (exchange.has["fetchDepositAddresses"]) {
      const depositAddresses = await exchange.fetchDepositAddresses(code);
      if (!depositAddresses) throw createError(404, "Currency not found");

      return { ...depositAddresses[method], trx: true };
    } else if (exchange.has["fetchDepositAddress"]) {
      const depositAddress = await exchange.fetchDepositAddress(code, {
        network: method,
      });
      if (!depositAddress) throw createError(404, "Currency not found");

      return { ...depositAddress, trx: true };
    }
  } catch (error) {
    const message = sanitizeErrorMessage(error.message);
    throw createError(404, message);
  }

  throw createError(404, "Method not found");
};
