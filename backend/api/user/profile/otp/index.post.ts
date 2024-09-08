// /server/api/profile/saveOTP.post.ts

import { createError } from "@b/utils/error";
import { models } from "@b/db";
import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Saves the OTP configuration for the user",
  operationId: "saveOTP",
  description: "Saves the OTP configuration for the user",
  tags: ["Profile"],
  requiresAuth: true,
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            secret: {
              type: "string",
              description: "OTP secret",
            },
            type: {
              type: "string",
              description: "Type of OTP",
              enum: ["SMS", "APP"],
            },
          },
          required: ["secret", "type"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "OTP configuration saved successfully",
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
                  message: {
                    type: "string",
                    description: "Success message",
                  },
                },
              },
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("User"),
    500: serverErrorResponse,
  },
};

export default async (data: Handler) => {
  if (!data.user?.id)
    throw createError({ statusCode: 401, message: "Unauthorized" });

  const { secret, type } = data.body;

  await saveOTPQuery(data.user.id, secret, type);

  return { message: "OTP configuration saved successfully" };
};

export async function saveOTPQuery(
  userId: string,
  secret: string,
  type: TwoFactorType
): Promise<TwoFactor | Error> {
  let otpDetails = {};
  let saveOTPError = null;

  if (!secret || !type)
    throw createError({
      statusCode: 400,
      message: "Missing required parameters",
    });

  const existingTwoFactor = await models.twoFactor.findOne({
    where: { userId: userId },
  });

  if (existingTwoFactor) {
    // If a 2FA record already exists for the user, update it
    await models.twoFactor
      .update(
        {
          secret,
          type,
          enabled: true,
        },
        {
          where: { id: existingTwoFactor.id },
        }
      )
      .then((response) => {
        otpDetails = response;
      })
      .catch((e) => {
        console.error(e);
        saveOTPError = e;
      });
  } else {
    // If no 2FA record exists for the user, create one
    await models.twoFactor
      .create({
        userId: userId,
        secret: secret,
        type: type,
        enabled: true,
      })
      .then((response) => {
        otpDetails = response;
      })
      .catch((e) => {
        console.error(e);
        saveOTPError = e;
      });
  }

  if (saveOTPError)
    throw createError({
      statusCode: 500,
      message: "Server error",
    });

  // Create api result
  return otpDetails as TwoFactor;
}
