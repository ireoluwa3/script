// /server/api/admin/exchange/orders/index.get.ts

import { models } from "@b/db";
import {
  getFiltered,
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { crudParameters, paginationSchema } from "@b/utils/constants";
import { orderSchema } from "./utils";

export const metadata = {
  summary: "List all exchange orders",
  operationId: "listExchangeOrders",
  tags: ["Admin", "Exchange Orders"],
  parameters: crudParameters,
  responses: {
    200: {
      description: "Exchange orders retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: orderSchema,
                },
              },
              pagination: paginationSchema,
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Exchange Orders"),
    500: serverErrorResponse,
  },
  permission: "Access Exchange Order Management",
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { query } = data;
  return getFiltered({
    model: models.exchangeOrder,
    query,
    sortField: query.sortField || "createdAt",
    includeModels: [
      {
        model: models.user,
        as: "user",
        attributes: ["firstName", "lastName", "email", "avatar"],
      },
    ],
  });
};

// model exchangeOrders {
//   id           String                 @id @unique @default(uuid())
//   referenceId String?                @unique
//   userId      String
//   user         user                   @relation(fields: [userId], references: [id], onDelete: Cascade, map: "exchangeOrdersUserIdForeign")
//   status       exchangeOrderStatus  @default(OPEN)
//   symbol       String                 @db.VarChar(255)
//   type         exchangeOrderType    @default(LIMIT)
//   timeInForce  exchangeTimeInForce @default(GTC)
//   side         exchangeOrderSide    @default(BUY)
//   price        Float                  @default(0)
//   average      Float?                 @default(0)
//   amount       Float                  @default(0)
//   filled       Float                  @default(0)
//   remaining    Float                  @default(0)
//   cost         Float                  @default(0)
//   trades       Json?                  @db.Json
//   fee          Float                  @default(0)
//   feeCurrency String                 @db.VarChar(255)

//   @@index([userId], map: "exchangeOrdersUserIdForeign")
// }
