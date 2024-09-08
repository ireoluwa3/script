// /api/admin/kyc/templates/store.post.ts

import { storeRecord, storeRecordResponses } from "@b/utils/query";
import { baseKycTemplateSchema, kycTemplateStoreSchema } from "./utils";

export const metadata: OperationObject = {
  summary: "Stores or updates a KYC template",
  operationId: "storeKYCTemplate",
  tags: ["Admin", "CRM", "KYC Template"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: kycTemplateStoreSchema,
          required: ["title", "options"],
        },
      },
    },
  },
  responses: storeRecordResponses(
    {
      description: `KYC template processed successfully`,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: baseKycTemplateSchema,
          },
        },
      },
    },
    "KYC Template"
  ),
  requiresAuth: true,
  permission: "Access KYC Template Management",
};

export default async (data: Handler) => {
  const { body } = data;
  const { title, options, customOptions } = body;

  return await storeRecord({
    model: "kycTemplate",
    data: {
      title,
      options,
      customOptions,
      status: false,
    },
  });
};
