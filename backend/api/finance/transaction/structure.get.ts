// /api/admin/transactions/structure.get.ts
import { statusOptions, transactionTypeOptions } from "@b/utils";
import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for transactions",
  operationId: "getTransactionsStructure",
  tags: ["Finance", "Transactions"],
  responses: {
    200: {
      description: "Form structure for transactions",
      content: structureSchema,
    },
  },
};

export const transactionStructure = () => {
  const type = {
    type: "select",
    label: "Type",
    name: "type",
    options: transactionTypeOptions,
  };

  const status = {
    type: "select",
    label: "Status",
    name: "status",
    options: statusOptions,
  };

  const amount = {
    type: "input",
    label: "Amount",
    name: "amount",
    ts: "number",
  };

  const fee = {
    type: "input",
    label: "Fee",
    name: "fee",
    ts: "number",
  };

  const description = {
    type: "textarea",
    label: "Description",
    name: "description",
  };

  const metadata = {
    type: "object",
    label: "Metadata",
    name: "metadata",
  };

  const referenceId = {
    type: "input",
    label: "Reference ID",
    name: "referenceId",
  };

  return {
    type,
    status,
    amount,
    fee,
    description,
    metadata,
    referenceId,
  };
};

export default async (): Promise<object> => {
  const { type, status, amount, fee, description, metadata, referenceId } =
    transactionStructure();

  return {
    get: [
      referenceId,
      [
        {
          type: "input",
          label: "Type",
          name: "type",
        },
        {
          type: "input",
          label: "Status",
          name: "status",
        },
      ],
      [amount, fee],
      description,
      metadata,
    ],
  };
};
