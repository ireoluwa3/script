// /api/admin/exchange/orders/structure.get.ts
import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for exchange orders",
  operationId: "getExchangeOrderStructure",
  tags: ["Admin", "Exchange Order"],
  responses: {
    200: {
      description: "Form structure for exchange orders",
      content: structureSchema,
    },
  },
  permission: "Access Exchange Order Management"
};

export const orderStructure = () => {
  const referenceId = {
    type: "input",
    label: "Reference ID",
    name: "referenceId",
    placeholder: "Enter reference ID",
  };

  const status = {
    type: "select",
    label: "Status",
    name: "status",
    options: [
      { value: "OPEN", label: "Open" },
      { value: "CLOSED", label: "Closed" },
      { value: "CANCELLED", label: "Cancelled" },
    ],
    placeholder: "Select status",
    ts: "string",
  };

  const symbol = {
    type: "input",
    label: "Symbol",
    name: "symbol",
    placeholder: "BTC/USD",
  };

  const type = {
    type: "select",
    label: "Type",
    name: "type",
    options: [
      { value: "LIMIT", label: "Limit" },
      { value: "MARKET", label: "Market" },
    ],
    placeholder: "Select type",
    ts: "string",
  };

  const timeInForce = {
    type: "select",
    label: "Time in Force",
    name: "timeInForce",
    options: [
      { value: "GTC", label: "Good Till Cancel" },
      { value: "IOC", label: "Immediate or Cancel" },
    ],
    placeholder: "Select Time in Force",
    ts: "string",
  };

  const side = {
    type: "select",
    label: "Side",
    name: "side",
    options: [
      { value: "BUY", label: "Buy" },
      { value: "SELL", label: "Sell" },
    ],
    placeholder: "Select Side",
    ts: "string",
  };

  const price = {
    type: "input",
    label: "Price",
    name: "price",
    placeholder: "Enter price",
    ts: "number",
  };

  const amount = {
    type: "input",
    label: "Amount",
    name: "amount",
    placeholder: "Enter amount",
    ts: "number",
  };

  const fee = {
    type: "input",
    label: "Fee",
    name: "fee",
    placeholder: "Enter fee",
    ts: "number",
  };

  const feeCurrency = {
    type: "input",
    label: "Fee Currency",
    name: "feeCurrency",
    placeholder: "USD",
  };

  return {
    referenceId,
    status,
    symbol,
    type,
    timeInForce,
    side,
    price,
    amount,
    fee,
    feeCurrency,
  };
};

export default async (): Promise<object> => {
  const {
    referenceId,
    status,
    symbol,
    type,
    timeInForce,
    side,
    price,
    amount,
    fee,
    feeCurrency,
  } = orderStructure();

  return {
    get: [
      referenceId,
      symbol,
      [type, timeInForce],
      [status, side],
      [price, amount],
      [feeCurrency, fee],
    ],
    set: [
      referenceId,
      symbol,
      [type, timeInForce],
      [status, side],
      [price, amount],
      [feeCurrency, fee],
    ],
  };
};

// model exchangeOrder {
//   id           String                 @id @unique @default(uuid())
//   referenceId String?                @unique
//   userId      String
//   user         user                   @relation(fields: [userId], references: [id], onDelete: Cascade, map: "exchangeOrderUserIdForeign")
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

//   @@index([userId], map: "exchangeOrderUserIdForeign")
// }
