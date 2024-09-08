// /server/api/admin/kyc/templates/[id].get.ts

import {
  getRecord,
  unauthorizedResponse,
  notFoundMetadataResponse,
  serverErrorResponse,
} from "@b/utils/query";
import { kycTemplateSchema } from "../utils"; // Assuming the schema is in a separate file.
import { models } from "@b/db";

export const metadata: OperationObject = {
  summary: "Retrieves a specific KYC template by ID",
  operationId: "getKycTemplateById",
  tags: ["Admin", "CRM", "KYC Template"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      description: "ID of the KYC template to retrieve",
      schema: { type: "string" },
    },
  ],
  responses: {
    200: {
      description: "KYC template details",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: kycTemplateSchema,
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("KYC template not found"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
  permission: "Access KYC Template Management",
};

export default async (data: Handler) => {
  const { params } = data;

  return await getRecord("kycTemplate", params.id, [
    {
      model: models.kyc,
      as: "kycs",
      attributes: [
        "id",
        "userId",
        "templateId",
        "data",
        "status",
        "level",
        "notes",
      ],
    },
  ]);
};
