import { createError } from "@b/utils/error";
import { models } from "@b/db";
import { authenticator } from "otplib";
import QRCode from "qrcode";
import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";

const APP_TWILIO_ACCOUNT_SID = process.env.APP_TWILIO_ACCOUNT_SID;
const APP_TWILIO_AUTH_TOKEN = process.env.APP_TWILIO_AUTH_TOKEN;
const APP_TWILIO_PHONE_NUMBER = process.env.APP_TWILIO_PHONE_NUMBER;
const NEXT_PUBLIC_SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME;

export const metadata: OperationObject = {
  summary:
    "Generates an OTP secret and sends OTP via SMS or generates a QR code for OTP APP",
  description:
    "Generates an OTP secret and sends OTP via SMS or generates a QR code for OTP APP",
  operationId: "generateOTPSecret",
  tags: ["Profile"],
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
              description: "Type of OTP to generate",
              enum: ["SMS", "APP"],
            },
            phoneNumber: {
              type: "string",
              description: "Phone number to send the OTP to",
            },
            email: {
              type: "string",
              description: "Email to generate the QR code for OTP APP",
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
                  secret: {
                    type: "string",
                    description: "OTP secret",
                  },
                  qrCode: {
                    type: "string",
                    description: "QR code for OTP APP",
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

  const { type, phoneNumber, email } = data.body;
  const secret = authenticator.generateSecret();

  try {
    if (type === "SMS") {
      if (!phoneNumber)
        throw createError({
          statusCode: 400,
          message: "Phone number is required for SMS type",
        });
      await savePhoneQuery(data.user.id, phoneNumber);

      const otp = authenticator.generate(secret);
      const twilio = (await import("twilio")).default(
        APP_TWILIO_ACCOUNT_SID,
        APP_TWILIO_AUTH_TOKEN
      );
      await twilio.messages.create({
        body: `Your OTP is: ${otp}`,
        from: APP_TWILIO_PHONE_NUMBER,
        to: phoneNumber,
      });

      return { secret };
    } else {
      const otpAuth = authenticator.keyuri(
        email || "",
        NEXT_PUBLIC_SITE_NAME || "",
        secret
      );
      const qrCode = await QRCode.toDataURL(otpAuth);

      return { secret, qrCode };
    }
  } catch (error) {
    throw createError({ statusCode: 500, message: error.message });
  }
};

export async function savePhoneQuery(
  userId: string,
  phone: string
): Promise<User> {
  await models.user.update(
    {
      phone: phone,
    },
    {
      where: { id: userId },
    }
  );

  const response = await models.user.findOne({
    where: { id: userId },
  });

  if (!response) {
    throw new Error("User not found");
  }

  return response.get({ plain: true }) as unknown as User;
}
