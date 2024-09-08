// /server/api/admin/kyc/templates/index.get.ts

import { models } from "@b/db";
import {
  getFiltered,
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { crudParameters, paginationSchema } from "@b/utils/constants";
import { baseKycTemplateSchema } from "./utils";

export const metadata: OperationObject = {
  summary: "Lists all KYC templates with pagination and optional filtering",
  operationId: "listKycTemplates",
  tags: ["Admin", "CRM", "KYC Template"],
  parameters: crudParameters,
  responses: {
    200: {
      description: "Paginated list of KYC templates with detailed information",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: baseKycTemplateSchema,
                },
              },
              pagination: paginationSchema,
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("KYC Templates"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
  permission: "Access KYC Template Management",
};

export default async (data: Handler) => {
  const { query } = data;

  return getFiltered({
    model: models.kycTemplate,
    query,
    sortField: query.sortField || "id",
    includeModels: [
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
    ],
    timestamps: false,
  });
};
