import {
  APP_TWILIO_ACCOUNT_SID,
  APP_TWILIO_AUTH_TOKEN,
} from "@b/utils/constants";
import { createError } from "@b/utils/error";
import { verifyPassword } from "@b/utils/passwords";
import { models } from "@b/db";
import { addMinutes } from "date-fns";
import { authenticator } from "otplib";
import { returnUserWithTokens, sendEmailVerificationToken } from "../utils";
import { emailQueue } from "@b/utils/emails";

export const metadata: OperationObject = {
  summary: "Logs in a user",
  description: "Logs in a user and returns a session token",
  operationId: "loginUser",
  tags: ["Auth"],
  requiresAuth: false,
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "Email of the user",
            },
            password: {
              type: "string",
              description: "Password of the user",
            },
          },
          required: ["email", "password"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "User logged in successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "Success message",
              },
              twoFactor: {
                type: "object",
                properties: {
                  enabled: {
                    type: "boolean",
                    description: "2FA enabled status",
                  },
                  type: {
                    type: "string",
                    description: "Type of 2FA",
                  },
                },
              },
              id: {
                type: "string",
                description: "User ID",
              },
            },
          },
        },
      },
    },
    400: {
      description: "Invalid request (e.g., invalid email or password)",
    },
    401: {
      description: "Unauthorized (e.g., incorrect email or password)",
    },
  },
};

export default async (data: Handler) => {
  const { body } = data;
  const { email, password } = body;

  const user = await models.user.findOne({
    where: { email },
    include: {
      model: models.twoFactor,
      as: "twoFactor",
    },
  });

  if (!user || !user.password) {
    throw createError({
      statusCode: 401,
      message: "Incorrect email or password",
    });
  }

  if (
    process.env.NEXT_PUBLIC_VERIFY_EMAIL_STATUS === "true" &&
    !user.emailVerified &&
    user.email
  ) {
    await sendEmailVerificationToken(user.id, user.email);
    return {
      message: "User email not verified. Verification email sent.",
    };
  }

  const isPasswordValid = await verifyPassword(user.password, password);
  if (!isPasswordValid) {
    await models.user.update(
      {
        failedLoginAttempts: (user.failedLoginAttempts ?? 0) + 1,
        lastFailedLogin: new Date(),
      },
      {
        where: { email },
      }
    );
    throw createError({
      statusCode: 401,
      message: "Incorrect email or password",
    });
  }

  const blockedUntil = addMinutes(user.lastFailedLogin ?? 0, 5);
  if ((user.failedLoginAttempts ?? 0) >= 5 && blockedUntil > new Date()) {
    throw new Error(
      "Too many failed login attempts, account is temporarily blocked for 5 minutes"
    );
  }

  await models.user.update(
    {
      failedLoginAttempts: 0,
      lastFailedLogin: null,
    },
    {
      where: { email },
    }
  );

  if (
    user.twoFactor?.enabled &&
    process.env.NEXT_PUBLIC_2FA_STATUS === "true"
  ) {
    const type = user.twoFactor?.type;
    const otp = authenticator.generate(user.twoFactor.secret);
    try {
      if (
        type === "SMS" &&
        process.env.NEXT_PUBLIC_2FA_SMS_STATUS === "true" &&
        process.env.APP_TWILIO_VERIFY_SERVICE_SID
      ) {
        const phoneNumber = user.phone;
        const twilio = (await import("twilio")).default;
        const twilioClient = twilio(
          APP_TWILIO_ACCOUNT_SID,
          APP_TWILIO_AUTH_TOKEN
        );
        await twilioClient.verify.v2
          .services(process.env.APP_TWILIO_VERIFY_SERVICE_SID)
          .verifications.create({ to: `+${phoneNumber}`, channel: "sms" });
      } else if (
        type === "EMAIL" &&
        process.env.NEXT_PUBLIC_2FA_EMAIL_STATUS === "true"
      ) {
        await emailQueue.add({
          emailData: {
            TO: user.email,
            FIRSTNAME: user.firstName,
            TOKEN: otp,
          },
          emailType: "OTPTokenVerification",
        });
      } else if (
        type === "APP" &&
        process.env.NEXT_PUBLIC_2FA_APP_STATUS === "true"
      ) {
        // Handle APP OTP if needed
      } else {
        throw createError({
          statusCode: 400,
          message: "Invalid 2FA type",
        });
      }

      return {
        twoFactor: {
          enabled: true,
          type: user.twoFactor.type,
        },
        id: user.id,
        message: "2FA required",
      };
    } catch (error) {
      throw createError({
        statusCode: 500,
        message: error.message,
      });
    }
  }

  return await returnUserWithTokens({
    user,
    message: "You have been logged in successfully",
  });
};
