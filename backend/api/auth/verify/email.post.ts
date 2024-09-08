import { createError } from "@b/utils/error";
import { models } from "@b/db";
import { verifyResetToken } from "@b/utils/token";
import { addOneTimeToken, returnUserWithTokens } from "../utils";

export const metadata: OperationObject = {
  summary: "Verifies the email with the provided token",
  operationId: "verifyEmailToken",
  tags: ["Auth"],
  description: "Verifies the email with the provided token",
  requiresAuth: false,
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            token: {
              type: "string",
              description: "The email verification token",
            },
          },
          required: ["token"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "Email verified successfully",
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
      description: "Invalid request (e.g., missing or invalid token)",
    },
    404: {
      description: "Token not found or expired",
    },
  },
};

export default async (data: Handler) => {
  const { body } = data;
  const { token } = body;
  return verifyEmailTokenQuery(token);
};

export const verifyEmailTokenQuery = async (token: string) => {
  const decodedToken = await verifyResetToken(token);

  if (!decodedToken) {
    throw new Error("Invalid token");
  }

  try {
    if (
      decodedToken.jti !== (await addOneTimeToken(decodedToken.jti, new Date()))
    ) {
      throw createError({
        statusCode: 500,
        message: "Token has already been used",
      });
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Token has already been used",
    });
  }

  const user = await models.user.findByPk(decodedToken.sub.user.id);
  if (!user) {
    throw createError({
      statusCode: 404,
      message: "User not found",
    });
  }

  await user.update({
    emailVerified: true,
  });

  return await returnUserWithTokens({
    user,
    message: "Email verified successfully",
  });
};
