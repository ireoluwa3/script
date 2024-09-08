// /server/api/kyc/index.get.ts
import { models } from "@b/db";
import { createError } from "@b/utils/error";
import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Retrieves KYC data for the logged-in user",
  description:
    "Fetches the Know Your Customer (KYC) data for the currently authenticated user. This endpoint requires user authentication and returns the user’s KYC information, including the status of the KYC verification process.",
  operationId: "getUserKycData",
  tags: ["KYC"],
  responses: {
    200: {
      description: "KYC data retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              status: {
                type: "boolean",
                description: "Indicates if the request was successful",
              },
              statusCode: {
                type: "number",
                description: "HTTP status code",
                example: 200,
              },
              data: {
                type: "object",
                properties: {
                  id: { type: "number", description: "KYC ID" },
                  userId: {
                    type: "number",
                    description: "User ID associated with the KYC record",
                  },
                  templateId: {
                    type: "number",
                    description: "ID of the KYC template used",
                  },
                  data: {
                    type: "object",
                    description: "KYC data as a JSON object",
                    nullable: true,
                  },
                  status: {
                    type: "string",
                    description: "Current status of the KYC verification",
                    enum: ["PENDING", "APPROVED", "REJECTED"],
                  },
                  level: { type: "number", description: "Verification level" },
                  notes: {
                    type: "string",
                    description: "Administrative notes, if any",
                    nullable: true,
                  },
                  createdAt: {
                    type: "string",
                    format: "date-time",
                    description: "Timestamp when the KYC record was created",
                  },
                  updatedAt: {
                    type: "string",
                    format: "date-time",
                    description:
                      "Timestamp when the KYC record was last updated",
                  },
                },
              },
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Kyc"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
};

export default async (data: Handler) => {
  if (!data.user?.id)
    throw createError({ statusCode: 401, message: "Unauthorized" });
  return getKyc(data.user.id);
};

export async function getKyc(userId: string): Promise<Kyc> {
  const response = await models.kyc.findOne({
    where: {
      userId: userId,
    },
  });

  if (!response) {
    throw new Error("KYC record not found");
  }

  return response.get({ plain: true }) as unknown as Kyc;
}
