// /server/api/admin/kyc/applications/[id].get.ts

import {
  getRecord,
  unauthorizedResponse,
  notFoundMetadataResponse,
  serverErrorResponse,
} from "@b/utils/query";
import { kycApplicationSchema } from "../utils"; // Assuming the schema is in a separate file.
import { models } from "@b/db";

export const metadata: OperationObject = {
  summary: "Retrieves a specific KYC application by ID",
  operationId: "getKycApplicationById",
  tags: ["Admin", "CRM", "KYC"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      description: "ID of the KYC application to retrieve",
      schema: { type: "string" },
    },
  ],
  responses: {
    200: {
      description: "KYC application details",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: kycApplicationSchema,
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("KYC application not found"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
  permission: "Access KYC Application Management",
};

export default async (data: Handler) => {
  const { params } = data;

  return await getRecord("kyc", params.id, [
    {
      model: models.user,
      as: "user",
      attributes: [
        "id",
        "email",
        "firstName",
        "lastName",
        "phone",
        "profile",
        "createdAt",
        "updatedAt",
      ],
    },
    {
      model: models.kycTemplate,
      as: "template",
    },
  ]);
};
