// /api/admin/transactions/structure.get.ts
import { statusOptions, transactionTypeOptions } from "@b/utils";
import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for transactions",
  operationId: "getTransactionsStructure",
  tags: ["Admin", "Wallets", "Transactions"],
  responses: {
    200: {
      description: "Form structure for transactions",
      content: structureSchema,
    },
  },
  permission: "Access Transaction Management",
};

export const transactionStructure = () => {
  const type = {
    type: "select",
    label: "Type",
    name: "type",
    options: transactionTypeOptions,
    placeholder: "Select transaction type",
  };

  const status = {
    type: "select",
    label: "Status",
    name: "status",
    options: statusOptions,
    placeholder: "Select status",
    editable: {
      status: "PENDING",
    },
  };

  const amount = {
    type: "input",
    label: "Amount",
    name: "amount",
    placeholder: "Enter the amount",
    ts: "number",
    editable: {
      status: "PENDING",
    },
  };

  const fee = {
    type: "input",
    label: "Fee",
    name: "fee",
    placeholder: "Enter the transaction fee",
    ts: "number",
    editable: {
      status: "PENDING",
    },
  };

  const description = {
    type: "textarea",
    label: "Description",
    name: "description",
    placeholder: "Enter a description of the transaction",
  };

  const metadata = {
    type: "object",
    label: "Metadata",
    name: "metadata",
    placeholder: "Enter metadata for the transaction",
  };

  const message = {
    type: "textarea",
    label: "Rejection Message",
    name: "metadata.message",
    placeholder: "Enter a message for the rejection",
    condition: {
      status: "REJECTED",
    },
  };

  const referenceId = {
    type: "input",
    label: "Reference ID",
    name: "referenceId",
    placeholder: "Enter the reference ID",
  };

  return {
    type,
    status,
    amount,
    fee,
    description,
    metadata,
    referenceId,
    message,
  };
};

export default async (): Promise<object> => {
  const {
    type,
    status,
    amount,
    fee,
    description,
    metadata,
    referenceId,
    message,
  } = transactionStructure();

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
    set: [referenceId, [type, status], message, [amount, fee], description],
    edit: [referenceId, description, [amount, fee], status, message],
  };
};
