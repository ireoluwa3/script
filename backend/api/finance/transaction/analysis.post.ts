// /server/api/admin/users/analytics/all.get.ts

import { getChartData } from "@b/utils/chart";
import { models } from "@b/db";
import { createError } from "@b/utils/error";

export const metadata: OperationObject = {
  summary: "Gets chart data for user analytics",
  operationId: "getAnalyticsData",
  tags: ["Finance", "Transactions"],
  parameters: [
    {
      name: "timeframe",
      in: "query",
      description: "Timeframe for the data",
      schema: {
        type: "string",
        enum: ["h", "d", "w", "m", "3m", "6m", "y"],
        default: "m",
      },
    },
    {
      name: "filter",
      in: "query",
      description: "Filter for the data",
      schema: {
        type: "string",
      },
    },
  ],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            availableFilters: {
              type: "object",
              additionalProperties: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    value: { type: "string" },
                    label: { type: "string" },
                    color: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "Analytics data of user counts per day",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              chartData: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    date: { type: "string" },
                    count: { type: "number" },
                  },
                },
              },
              filterResults: {
                type: "object",
                additionalProperties: {
                  type: "object",
                  properties: {
                    count: { type: "number" },
                    change: { type: "number" },
                    percentage: { type: "number" },
                  },
                },
              },
            },
          },
        },
      },
    },
    401: { description: "Unauthorized access" },
  },
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { query, body, user } = data;
  if (!user?.id) throw createError(401, "Unauthorized access");

  const { walletType, currency, filter, timeframe } = query;
  const { availableFilters } = body;

  if (!walletType && !currency) throw createError(400, "Invalid request");

  const wallet = await models.wallet.findOne({
    where: { type: walletType, currency, userId: user.id },
  });
  if (!wallet) throw createError(404, "Wallet not found");
  const where = { walletId: wallet.id };

  return getChartData({
    model: models.transaction,
    timeframe,
    filter,
    availableFilters,
    where,
  });
};
