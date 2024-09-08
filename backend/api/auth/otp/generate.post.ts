import {
  APP_TWILIO_ACCOUNT_SID,
  APP_TWILIO_AUTH_TOKEN,
  appName,
} from "@b/utils/constants";
import { createError } from "@b/utils/error";
import { models } from "@b/db";
import { authenticator } from "otplib";
import QRCode from "qrcode";
import { emailQueue } from "@b/utils/emails";

export const metadata: OperationObject = {
  summary: "Generates an OTP secret",
  operationId: "generateOTPSecret",
  tags: ["Auth"],
  description: "Generates an OTP secret for the user",
  requiresAuth: true,
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: ["EMAIL", "SMS", "APP"],
              description: "Type of 2FA",
            },
            phoneNumber: {
              type: "string",
              description: "Phone number for SMS OTP",
            },
          },
          required: ["type"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "OTP secret generated successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              secret: {
                type: "string",
                description: "Generated OTP secret",
              },
              qrCode: {
                type: "string",
                description: "QR code for APP OTP",
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

  const userPk = await models.user.findByPk(user.id);
  if (!userPk) {
    throw createError({ statusCode: 400, message: "User not found" });
  }

  const type = body.type;
  const secret = authenticator.generateSecret();
  let otp, qrCode;

  if (type === "SMS" && process.env.NEXT_PUBLIC_2FA_SMS_STATUS === "true") {
    const phoneNumber = body.phoneNumber;
    if (!phoneNumber) {
      throw createError({
        statusCode: 400,
        message: "Phone number is required for SMS",
      });
    }
    try {
      await savePhoneQuery(user.id, phoneNumber);
    } catch (error) {
      throw createError({ statusCode: 500, message: error.message });
    }
    otp = authenticator.generate(secret);

    if (!process.env.APP_TWILIO_VERIFY_SERVICE_SID) {
      throw createError({
        statusCode: 500,
        message: "Service SID is not set",
      });
    }
    try {
      const twilio = (await import("twilio")).default;
      const twilioClient = twilio(
        APP_TWILIO_ACCOUNT_SID,
        APP_TWILIO_AUTH_TOKEN
      );
      await twilioClient.verify.v2
        .services(process.env.APP_TWILIO_VERIFY_SERVICE_SID)
        .verifications.create({ to: `+${phoneNumber}`, channel: "sms" });
    } catch (error) {
      console.log("Error sending SMS OTP", error);

      throw createError({ statusCode: 500, message: error.message });
    }

    return { secret };
  } else if (
    type === "APP" &&
    process.env.NEXT_PUBLIC_2FA_APP_STATUS === "true"
  ) {
    if (!userPk.email) {
      throw createError({
        statusCode: 400,
        message: "Email is required for APP OTP",
      });
    }
    const email = userPk.email;
    const otpAuth = authenticator.keyuri(email, appName, secret);
    qrCode = await QRCode.toDataURL(otpAuth);

    return { secret, qrCode };
  } else if (
    type === "EMAIL" &&
    process.env.NEXT_PUBLIC_2FA_EMAIL_STATUS === "true"
  ) {
    const email = userPk.email;
    otp = authenticator.generate(secret);

    try {
      await emailQueue.add({
        emailData: {
          TO: email,
          FIRSTNAME: userPk.firstName,
          TOKEN: otp,
        },
        emailType: "OTPTokenVerification",
      });
    } catch (error) {
      throw createError({ statusCode: 500, message: error.message });
    }

    return { secret };
  } else {
    throw createError({
      statusCode: 400,
      message: "Invalid type or 2FA method not enabled",
    });
  }
};

async function savePhoneQuery(userId: string, phone: string) {
  return await models.user.update({ phone }, { where: { id: userId } });
}
