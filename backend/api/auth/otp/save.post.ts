import { models } from "@b/db";
import { createError } from "@b/utils/error";

export const metadata: OperationObject = {
  summary: "Saves the OTP",
  operationId: "saveOTP",
  tags: ["Auth"],
  description: "Saves the OTP secret and type for the user",
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
              description: "Generated OTP secret",
            },
            type: {
              type: "string",
              enum: ["EMAIL", "SMS", "APP"],
              description: "Type of 2FA",
            },
          },
          required: ["secret", "type"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "OTP saved successfully",
      content: {
        "application/json": {
          schema: {
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
    400: {
      description: "Invalid request",
    },
    401: {
      description: "Unauthorized",
    },
  },
};

export default async (data: Handler) => {
  const { body, user } = data;
  if (!user) throw createError({ statusCode: 401, message: "unauthorized" });

  return await saveOTPQuery(user.id, body.secret, body.type);
};

export async function saveOTPQuery(
  userId: string,
  secret: string,
  type: "EMAIL" | "SMS" | "APP"
) {
  if (!secret || !type)
    throw createError({
      statusCode: 400,
      message: "Missing required parameters",
    });

  let otpDetails;
  const existingTwoFactor = await models.twoFactor.findOne({
    where: { userId },
  });

  if (existingTwoFactor) {
    // Update existing 2FA record
    otpDetails = await models.twoFactor.update(
      { secret, type, enabled: true },
      { where: { id: existingTwoFactor.id }, returning: true }
    );
  } else {
    // Create new 2FA record
    otpDetails = await models.twoFactor.create({
      userId,
      secret,
      type,
      enabled: true,
    });
  }

  return otpDetails;
}
