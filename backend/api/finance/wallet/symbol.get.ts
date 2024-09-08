import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { getWallet } from "./utils";
import { createError } from "@b/utils/error";

export const metadata: OperationObject = {
  summary: "Retrieves details of a specific wallet",
  description:
    "Fetches detailed information about a specific wallet based on its unique identifier.",
  operationId: "getWallet",
  tags: ["Finance", "Wallets"],
  requiresAuth: true,
  parameters: [
    {
      in: "query",
      name: "type",
      required: true,
      schema: {
        type: "string",
        enum: ["ECO", "SPOT"],
      },
      description: "The type of wallet to retrieve",
    },
    {
      in: "query",
      name: "currency",
      required: true,
      schema: {
        type: "string",
      },
      description: "The currency of the wallet to retrieve",
    },
    {
      in: "query",
      name: "pair",
      required: true,
      schema: {
        type: "string",
      },
      description: "The pair of the wallet to retrieve",
    },
  ],
  responses: {
    200: {
      description: "Wallet details retrieved successfully",
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Wallet"),
    500: serverErrorResponse,
  },
};

export default async (data: Handler) => {
  const { user, query } = data;
  if (!user) throw createError({ statusCode: 401, message: "Unauthorized" });

  const { type, currency, pair } = query;
  let CURRENCY = 0;
  let PAIR = 0;
  try {
    CURRENCY = (await getWallet(user.id, type, currency)).balance || 0;
  } catch (error) {}
  try {
    PAIR = (await getWallet(user.id, type, pair)).balance || 0;
  } catch (error) {}
  return { CURRENCY, PAIR };
};
