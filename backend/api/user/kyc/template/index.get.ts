// /server/api/kyc-template/index.get.ts

import { models } from "@b/db";
import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Lists the active KYC template",
  description:
    "Fetches the currently active KYC (Know Your Customer) template that is used for KYC processes. This endpoint is accessible without authentication and returns the template that is marked as active in the system.",
  operationId: "getActiveKycTemplate",
  tags: ["KYC"],
  responses: {
    200: {
      description: "Active KYC template retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: { type: "number", description: "Template ID" },
              title: { type: "string", description: "Template title" },
              options: {
                type: "object",
                description: "Template options as JSON object",
                nullable: true,
              },
              status: {
                type: "boolean",
                description: "Active status of the template",
              },
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Kyc Template"),
    500: serverErrorResponse,
  },
  requiresAuth: false,
};

export default async () => {
  return getActiveKycTemplate();
};

export async function getActiveKycTemplate(): Promise<KycTemplate> {
  const response = await models.kycTemplate.findOne({
    where: {
      status: true,
    },
  });

  if (!response) {
    throw new Error("No active KYC template found");
  }

  return response.get({ plain: true }) as unknown as KycTemplate;
}
