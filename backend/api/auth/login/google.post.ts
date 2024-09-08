import { OAuth2Client } from "google-auth-library";
import { models } from "@b/db";
import { serverErrorResponse } from "@b/utils/query";
import {
  returnUserWithTokens,
  userRegisterResponseSchema,
  userRegisterSchema,
} from "../utils";

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export const metadata: OperationObject = {
  summary: "Logs in a user with Google",
  operationId: "loginUserWithGoogle",
  tags: ["Auth"],
  description: "Logs in a user using Google and returns a session token",
  requiresAuth: false,
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: userRegisterSchema,
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
            properties: userRegisterResponseSchema,
          },
        },
      },
    },
    500: serverErrorResponse,
  },
};

async function verifyGoogleToken(token: string) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  });
  return ticket.getPayload();
}

async function fetchGoogleUserInfo(token: string) {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch user info from Google");
  }
  return response.json();
}

export default async (data: Handler) => {
  const { body } = data;
  const { token } = body;

  let payload;
  try {
    payload = await verifyGoogleToken(token);
  } catch (error) {
    payload = await fetchGoogleUserInfo(token);
  }

  if (!payload) {
    throw new Error("Invalid Google token");
  }

  const {
    sub: googleId,
    email,
    given_name: firstName,
    family_name: lastName,
  } = payload;

  if (!googleId || !email || !firstName || !lastName) {
    throw new Error("Incomplete user information from Google");
  }

  // Check if user exists
  const user = await models.user.findOne({ where: { email } });

  if (!user) {
    throw new Error("User not found");
  }

  // Check if the user has a provider_user entry
  const providerUser = await models.providerUser.findOne({
    where: { providerUserId: googleId, provider: "GOOGLE" },
  });

  if (!providerUser) {
    // Create a provider_user entry
    await models.providerUser.create({
      provider: "GOOGLE",
      providerUserId: googleId,
      userId: user.id,
    });
  }

  return await returnUserWithTokens({
    user,
    message: "You have been logged in successfully",
  });
};
