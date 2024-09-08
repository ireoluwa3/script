// /api/admin/binary/orders/structure.get.ts
import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for binary orders",
  operationId: "getBinaryOrderStructure",
  tags: ["Admin", "Binary Order"],
  responses: {
    200: {
      description: "Form structure for binary orders",
      content: structureSchema,
    },
  },
  permission: "Access Binary Order Management"
};

export const orderStructure = () => {
  const symbol = {
    type: "input",
    label: "Symbol",
    name: "symbol",
    placeholder: "Enter trading symbol",
  };

  const price = {
    type: "input",
    label: "Price",
    name: "price",
    placeholder: "Enter the price at order placement",
    ts: "number",
  };

  const amount = {
    type: "input",
    label: "Amount",
    name: "amount",
    placeholder: "Enter the amount traded",
    ts: "number",
  };

  const profit = {
    type: "input",
    label: "Profit",
    name: "profit",
    placeholder: "Enter the profit from the order",
    ts: "number",
  };

  const side = {
    type: "select",
    label: "Side",
    name: "side",
    options: [
      { value: "RISE", label: "Rise" },
      { value: "FALL", label: "Fall" },
    ],
    placeholder: "Select order side",
  };

  const type = {
    type: "select",
    label: "Type",
    name: "type",
    options: [{ value: "RISE_FALL", label: "Rise/Fall" }],
    placeholder: "Select order type",
  };

  const status = {
    type: "select",
    label: "Status",
    name: "status",
    options: [
      { value: "PENDING", label: "Pending" },
      { value: "WIN", label: "Win" },
      { value: "LOSS", label: "Loss" },
      { value: "DRAW", label: "Draw" },
    ],
    placeholder: "Select the current status",
  };

  const isDemo = {
    type: "select",
    label: "Is Demo",
    name: "isDemo",
    options: [
      { value: true, label: "Yes" },
      { value: false, label: "No" },
    ],
    ts: "boolean",
  };

  const closePrice = {
    type: "input",
    label: "Close Price",
    name: "closePrice",
    placeholder: "Enter the price at order close",
    ts: "number",
  };

  return {
    symbol,
    price,
    amount,
    profit,
    side,
    type,
    status,
    isDemo,
    closePrice,
  };
};

export default async (): Promise<object> => {
  const {
    symbol,
    price,
    amount,
    profit,
    side,
    type,
    status,
    isDemo,
    closePrice,
  } = orderStructure();

  return {
    get: [
      symbol,
      [price, closePrice],
      [amount, profit],
      [side, type],
      status,
      isDemo,
    ],
    set: [
      symbol,
      [price, closePrice],
      [amount, profit],
      [side, type],
      status,
      isDemo,
    ],
  };
};

// model binary_orders {
//   id          String                               @unique @default(uuid())
//   user_id     Int
//   user        user                @relation(fields: [user_id], references: [id], onDelete: Cascade, map: "binary_orders_user_id_foreign")
//   symbol      String
//   price       Float
//   amount      Float
//   profit      Float
//   side        binary_order_side
//   type        binary_order_type
//   status      binary_order_status
//   is_demo     Boolean             @default(false)
//   closed_at   DateTime
//   close_price Float?
//   created_at  DateTime            @default(now())
//   updated_at  DateTime            @updatedAt

//   @@index([user_id], map: "binary_orders_user_id_foreign")
// }
