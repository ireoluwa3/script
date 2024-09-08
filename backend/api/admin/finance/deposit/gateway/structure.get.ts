// /api/admin/deposit/gateways/structure.get.ts
import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for deposit gateways",
  operationId: "getDepositGatewaysStructure",
  tags: ["Admin", "Deposit Gateways"],
  responses: {
    200: {
      description: "Form structure for deposit gateways",
      content: structureSchema,
    },
  },
  permission: "Access Deposit Gateway Management"
};

export const gatewayStructure = () => {
  const name = {
    type: "input",
    label: "Gateway Name",
    name: "name",
    placeholder: "Enter the gateway name",
  };

  const title = {
    type: "input",
    component: "InfoBlock",
    label: "Gateway Title",
    name: "title",
    icon: "ph:wallet-light",
    placeholder: "Enter the gateway title",
  };

  const description = {
    type: "textarea",
    label: "Description",
    name: "description",
    placeholder: "Enter a detailed description",
  };

  const image = {
    type: "file",
    label: "Gateway Image",
    name: "image",
    placeholder: "Upload an image",
    fileType: "image",
    width: 350,
    height: 262,
    maxSize: 1,
  };

  const currencies = {
    type: "tags",
    label: "Supported Currencies",
    name: "currencies",
    placeholder: '{"USD": true, "EUR": true}',
  };

  const fixedFee = {
    type: "input",
    label: "Fixed Fee",
    name: "fixedFee",
    placeholder: "Enter fixed fee amount",
    ts: "number",
  };

  const percentageFee = {
    type: "input",
    label: "Percentage Fee",
    name: "percentageFee",
    placeholder: "Enter percentage fee rate",
    ts: "number",
  };

  const minAmount = {
    type: "input",
    label: "Minimum Amount",
    name: "minAmount",
    placeholder: "Enter minimum transaction amount",
    ts: "number",
  };

  const maxAmount = {
    type: "input",
    label: "Maximum Amount",
    name: "maxAmount",
    placeholder: "Enter maximum transaction amount",
    ts: "number",
  };

  const type = {
    type: "select",
    component: "InfoBlock",
    label: "Gateway Type",
    name: "type",
    options: [
      { value: "FIAT", label: "Fiat" },
      { value: "CRYPTO", label: "Crypto" },
    ],
    placeholder: "Select gateway type",
    ts: "string",
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
    name,
    title,
    description,
    image,
    currencies,
    fixedFee,
    percentageFee,
    minAmount,
    maxAmount,
    type,
    status,
  };
};

export default async (): Promise<object> => {
  const {
    name,
    title,
    description,
    image,
    currencies,
    fixedFee,
    percentageFee,
    minAmount,
    maxAmount,
    type,
    status,
  } = gatewayStructure();

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
            fields: [title, type],
            grid: "column",
          },
        ],
        className: "card-dashed mb-5 items-center",
      },
      description,
      [fixedFee, percentageFee],
      [minAmount, maxAmount],
      currencies,
      status,
    ],
    set: [
      image,
      [name, title],
      description,
      [fixedFee, percentageFee],
      [minAmount, maxAmount],
      status,
    ],
  };
};
