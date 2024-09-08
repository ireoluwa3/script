// /api/admin/withdraw/methods/structure.get.ts
import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for withdrawal methods",
  operationId: "getWithdrawMethodsStructure",
  tags: ["Admin", "Withdraw Methods"],
  responses: {
    200: {
      description: "Form structure for withdrawal methods",
      content: structureSchema,
    },
  },
  permission: "Access Withdrawal Method Management"
};

export const withdrawMethodStructure = () => {
  const title = {
    type: "input",
    component: "InfoBlock",
    label: "Method Title",
    name: "title",
    placeholder: "Enter the method title",
  };

  const processingTime = {
    type: "input",
    component: "InfoBlock",
    label: "Processing Time",
    name: "processingTime",
    placeholder: "Enter expected processing time",
    icon: "ph:clock-afternoon-thin",
  };

  const instructions = {
    type: "textarea",
    label: "Instructions",
    name: "instructions",
    placeholder: "Enter detailed instructions for using this withdrawal method",
  };

  const image = {
    type: "file",
    label: "Method Image",
    name: "image",
    fileType: "image",
    width: 350,
    height: 262,
    maxSize: 1,
    placeholder: "/img/placeholder.svg",
  };

  const fixedFee = {
    type: "input",
    label: "Fixed Fee",
    name: "fixedFee",
    placeholder: "Enter the fixed fee for transactions",
    ts: "number",
  };

  const percentageFee = {
    type: "input",
    label: "Percentage Fee",
    name: "percentageFee",
    placeholder: "Enter the percentage fee of transaction amount",
    ts: "number",
  };

  const minAmount = {
    type: "input",
    label: "Minimum Amount",
    name: "minAmount",
    placeholder: "Enter the minimum amount for withdrawals",
    ts: "number",
  };

  const maxAmount = {
    type: "input",
    label: "Maximum Amount",
    name: "maxAmount",
    placeholder: "Enter the maximum amount for withdrawals",
    ts: "number",
  };

  const customFields = {
    type: "customFields",
    label: "Custom Fields",
    name: "customFields",
    placeholder: "Enter custom fields for this withdrawal method",
  };

  const status = {
    type: "select",
    label: "Status",
    name: "status",
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
    ts: "boolean",
  };

  return {
    title,
    processingTime,
    instructions,
    image,
    fixedFee,
    percentageFee,
    minAmount,
    maxAmount,
    customFields,
    status,
  };
};

export default async (): Promise<object> => {
  const {
    title,
    processingTime,
    instructions,
    image,
    fixedFee,
    percentageFee,
    minAmount,
    maxAmount,
    customFields,
    status,
  } = withdrawMethodStructure();

  return {
    get: [
      {
        fields: [
          {
            ...image,
            width: image.width / 4,
            height: image.width / 4,
          },
          {
            fields: [title, processingTime],
            grid: "column",
          },
        ],
        className: "card-dashed mb-5 items-center",
      },
      instructions,
      [fixedFee, percentageFee],
      [minAmount, maxAmount],
      customFields,
      status,
    ],
    set: [
      image,
      [title, processingTime],
      instructions,
      [fixedFee, percentageFee],
      [minAmount, maxAmount],
      customFields,
      status,
    ],
  };
};
