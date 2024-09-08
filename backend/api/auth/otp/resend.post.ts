import { createError } from "@b/utils/error";
import { models } from "@b/db";
import { authenticator } from "otplib";
import { emailQueue, sendEmail } from "@b/utils/emails";
import {
  APP_TWILIO_ACCOUNT_SID,
  APP_TWILIO_AUTH_TOKEN,
} from "@b/utils/constants";

export const metadata: OperationObject = {
  summary: "Resends the OTP for 2FA",
  operationId: "resendOtp",
  tags: ["Auth"],
  description: "Resends the OTP for 2FA",
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
            type: {
              type: "string",
              enum: ["EMAIL", "SMS"],
              description: "Type of 2FA",
            },
          },
          required: ["id", "type"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "OTP resent successfully",
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
  const { body } = data;
  const { id, type } = body;

  const user = await models.user.findOne({
    where: { id },
    include: {
      model: models.twoFactor,
      as: "twoFactor",
    },
  });

  if (!user || !user.twoFactor?.secret) {
    throw createError({
      statusCode: 400,
      message: "User not found or 2FA not enabled",
    });
  }

  const otp = authenticator.generate(user.twoFactor.secret);

  if (
    type === "SMS" &&
    process.env.NEXT_PUBLIC_2FA_SMS_STATUS === "true" &&
    process.env.APP_TWILIO_VERIFY_SERVICE_SID
  ) {
    const phoneNumber = user.phone;
    const twilio = (await import("twilio")).default;
    const twilioClient = twilio(APP_TWILIO_ACCOUNT_SID, APP_TWILIO_AUTH_TOKEN);
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
  } else {
    throw createError({
      statusCode: 400,
      message: "Invalid 2FA type or 2FA method not enabled",
    });
  }

  return {
    message: "OTP resent successfully",
  };
};
