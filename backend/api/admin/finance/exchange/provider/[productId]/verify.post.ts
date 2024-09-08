// /server/api/exchange/settings/verify-license.post.ts

import { verifyLicense } from "@b/api/admin/system/utils";
import { saveLicense } from "../../utils";

import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";

export const metadata = {
  summary: "Verify Exchange License",
  operationId: "verifyLicense",
  tags: ["Admin","Settings", "Exchange"],
  description: "Verifies the license for the exchange product.",
  requiresAuth: true,
  parameters: [
    {
      index: 0,
      in: "path",
      name: "productId",
      description: "Product ID whose license to activate",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  requestBody: {
    description:
      "Product ID, purchase code and envato username for license verification.",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            purchaseCode: {
              type: "string",
              description: "Purchase code for the license.",
            },
            envatoUsername: {
              type: "string",
              description: "Envato username.",
              nullable: true,
            },
          },
        },
      },
    },
    required: true,
  },
  responses: {
    200: {
      description: "License verified successfully",
      content: {
        "application/json": {
          schema: {
            type: "string",
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("License"),
    500: serverErrorResponse,
  },
  permission: "Access Exchange Provider Management"
};

export default async (data: Handler) => {
  const { body, params } = data;
  const { purchaseCode, envatoUsername } = body;
  const { productId } = params;

  if (!productId) {
    throw new Error("Product ID is required for license verification.");
  }

  const response = await verifyLicense(productId, purchaseCode, envatoUsername);
  if (response.message && response.message.startsWith("Verified")) {
    await saveLicense(productId, envatoUsername);
  }
  return response;
};
