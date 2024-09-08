// /api/admin/kyc/templates/[id]/update.put.ts
import { updateRecord, updateRecordResponses } from "@b/utils/query";
import { kycTemplateUpdateSchema } from "../utils";

export const metadata: OperationObject = {
  summary: "Updates an existing KYC template",
  operationId: "updateKycTemplate",
  tags: ["Admin", "CRM", "KYC Template"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      description: "ID of the KYC template to update",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  requestBody: {
    required: true,
    description: "Updated data for the KYC template",
    content: {
      "application/json": {
        schema: kycTemplateUpdateSchema,
      },
    },
  },
  responses: updateRecordResponses("KYC Template"),
  requiresAuth: true,
  permission: "Access KYC Template Management",
};

export default async (data: Handler) => {
  const { body, params } = data;
  const { id } = params;
  const { title, options, customOptions } = body;

  return await updateRecord("kycTemplate", id, {
    title,
    options,
    customOptions,
  });
};
