import {
  baseStringSchema,
  baseObjectSchema,
  baseBooleanSchema,
} from "@b/utils/schema";

// Base schema components for KYC templates
const id = baseStringSchema("ID of the KYC template");
const title = baseStringSchema("Title of the KYC template");
const options = {
  ...baseObjectSchema("Options included in the KYC template"),
  additionalProperties: true,
};

const customOptions = {
  type: "object",
  description: "Custom options for the KYC template",
  additionalProperties: {
    type: "object",
    properties: {
      required: baseBooleanSchema("Whether the field is required"),
      type: baseStringSchema("Type of field"),
      level: {
        type: "string",
        description: "Level of verification required",
        enum: ["1", "2", "3"],
      },
    },
  },
};

// Base schema definition for KYC templates
export const baseKycTemplateSchema = {
  id,
  title,
  options,
  customOptions,
};

// Full schema for a KYC template including applications
export const kycTemplateSchema = {
  ...baseKycTemplateSchema,
  kyc: {
    type: "array",
    items: {
      type: "object",
      properties: {
        id: { type: "string", description: "ID of the KYC application" },
        userId: { type: "string", description: "ID of the user" },
        templateId: { type: "string", description: "ID of the KYC template" },
        data: {
          type: "object",
          description: "Data provided in the KYC application",
        },
        status: {
          type: "string",
          description: "Status of the KYC application",
        },
        level: {
          type: "integer",
          description: "Level of the KYC verification",
        },
        notes: {
          type: "string",
          description: "Administrative notes on the KYC application",
        },
        createdAt: {
          type: "string",
          format: "date-time",
          description: "Creation date and time of the KYC application",
        },
      },
    },
    description: "List of KYC applications using this template",
  },
};

// Schema for updating a KYC template
export const kycTemplateUpdateSchema = {
  type: "object",
  properties: {
    title,
    options,
    customOptions,
  },
  required: ["title", "options", "customOptions"],
};

// Schema for defining a new KYC template
export const kycTemplateStoreSchema = {
  ...baseKycTemplateSchema,
};
