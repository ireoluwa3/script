// /server/api/auth/loginOtp.post.ts

import { createError } from "@b/utils/error";
import { models } from "@b/db";
import { authenticator } from "otplib";
import { returnUserWithTokens } from "../utils";

export const metadata: OperationObject = {
  summary: "Verifies the OTP for login",
  operationId: "verifyLoginOTP",
  tags: ["Auth"],
  description: "Verifies the OTP for login and returns a session token",
  requiresAuth: false,
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "ID of the user",
            },
            otp: {
              type: "string",
              description: "OTP to verify",
            },
          },
          required: ["id", "otp"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "OTP verified successfully, user logged in",
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
      description: "Invalid request (e.g., missing parameters, invalid OTP)",
    },
    401: {
      description: "Unauthorized (incorrect or expired OTP)",
    },
  },
};

export default async (data: Handler) => {
  const { body } = data;
  const { id, otp } = body;

  const user = await models.user.findOne({
    where: { id },
    include: {
      model: models.twoFactor,
      as: "twoFactor",
    },
  });

  if (!user || !user.twoFactor?.secret) {
    throw new Error("User not found");
  }

  const isValid = await authenticator.verify({
    token: otp,
    secret: user.twoFactor?.secret,
  });

  if (!isValid) {
    throw createError({
      statusCode: 401,
      message: "Invalid OTP",
    });
  }

  return await returnUserWithTokens({
    user,
    message: "You have been logged in successfully",
  });
};
