import {
  baseBooleanSchema,
  baseNumberSchema,
  baseStringSchema,
} from "@b/utils/schema";

// Basic component definitions
const name = baseStringSchema("Name of the deposit gateway", 100);
const title = baseStringSchema("Title of the deposit gateway", 100);
const description = baseStringSchema("Description of the deposit gateway", 500);
const image = baseStringSchema(
  "URL to an image representing the deposit gateway",
  255,
  0,
  true
);

const fixedFee = {
  ...baseNumberSchema("Fixed fee for transactions through this gateway"),
  nullable: true,
  minimum: 0,
};
const percentageFee = {
  ...baseNumberSchema("Percentage fee for transactions through this gateway"),
  nullable: true,
  minimum: 0,
  maximum: 100,
};
const minAmount = {
  ...baseNumberSchema("Minimum amount allowed through this gateway"),
  nullable: true,
  minimum: 0,
};
const maxAmount = {
  ...baseNumberSchema("Maximum amount allowed through this gateway"),
  nullable: true,
  minimum: 0,
};
const status = baseBooleanSchema(
  "Current status of the deposit gateway (active or inactive)"
);

// Now using these components in your base schema
export const baseGatewaySchema = {
  id: {
    ...baseStringSchema("ID of the deposit gateway"),
    nullable: true,
  },
  name,
  title,
  description,
  image,
  alias: {
    ...baseStringSchema("Unique alias for the deposit gateway"),
    nullable: true,
  },
  currencies: {
    type: "object",
    description: "Supported currencies in JSON format",
    nullable: true,
  },
  fixedFee,
  percentageFee,
  minAmount,
  maxAmount,
  type: {
    ...baseStringSchema("Type of the deposit gateway"),
    nullable: true,
  },
  status,
  version: {
    ...baseStringSchema("Version of the deposit gateway"),
    nullable: true,
  },
  productId: {
    ...baseStringSchema("Product ID associated with the deposit gateway"),
    nullable: true,
  },
};

// Schema for updating an existing deposit gateway
export const gatewayUpdateSchema = {
  type: "object",
  properties: {
    name,
    title,
    description,
    image,
    fixedFee,
    percentageFee,
    minAmount,
    maxAmount,
    status,
  },
  required: [
    "name",
    "title",
    "description",
    "fixedFee",
    "percentageFee",
    "minAmount",
  ],
};
