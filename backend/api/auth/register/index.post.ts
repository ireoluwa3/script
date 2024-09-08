import { hashPassword, validatePassword } from "@b/utils/passwords";
import { models } from "@b/db";
import { handleReferralRegister } from "@b/utils/affiliate";
import { returnUserWithTokens, sendEmailVerificationToken } from "../utils";
import { createError } from "@b/utils/error";

export const metadata: OperationObject = {
  summary: "Registers a new user",
  operationId: "registerUser",
  tags: ["Auth"],
  description: "Registers a new user and returns a session token",
  requiresAuth: false,
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            firstName: {
              type: "string",
              description: "First name of the user",
            },
            lastName: {
              type: "string",
              description: "Last name of the user",
            },
            email: {
              type: "string",
              format: "email",
              description: "Email of the user",
            },
            password: {
              type: "string",
              description: "Password of the user",
            },
            ref: {
              type: "string",
              description: "Referral code",
            },
          },
          required: ["firstName", "lastName", "email", "password"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "User registered successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "Success message",
              },
              cookies: {
                type: "object",
                properties: {
                  accessToken: {
                    type: "string",
                    description: "Access token",
                  },
                  sessionId: {
                    type: "string",
                    description: "Session ID",
                  },
                  csrfToken: {
                    type: "string",
                    description: "CSRF token",
                  },
                },
              },
            },
          },
        },
      },
    },
    400: {
      description: "Invalid request (e.g., email already in use)",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "Error message",
              },
            },
          },
        },
      },
    },
  },
};

export default async (data: Handler) => {
  const { body } = data;
  const { firstName, lastName, email, password, ref } = body;

  const existingUser = await models.user.findOne({ where: { email } });

  if (existingUser && existingUser.email) {
    if (
      !existingUser.emailVerified &&
      process.env.NEXT_PUBLIC_VERIFY_EMAIL_STATUS === "true"
    ) {
      await sendEmailVerificationToken(existingUser.id, existingUser.email);
      return {
        message:
          "User already registered but email not verified. Verification email sent.",
      };
    }
    throw new Error("Email already in use");
  }

  if (!validatePassword(password)) {
    throw new Error("Invalid password format");
  }

  const hashedPassword = await hashPassword(password);

  // Upsert the 'User' role
  await models.role.upsert({ name: "User" });

  // Upsert the appropriate role based on NEXT_PUBLIC_DEMO_STATUS
  const roleName =
    process.env.NEXT_PUBLIC_DEMO_STATUS === "true" ? "Admin" : "User";
  await models.role.upsert({ name: roleName });

  // Fetch the role to get its ID
  const role = await models.role.findOne({ where: { name: roleName } });

  if (!role) throw new Error("Role not found after upsert.");

  // Create the user with the roleId
  const newUser = await models.user.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    roleId: role.id,
    emailVerified: false,
  });

  if (!newUser.email) {
    throw createError({
      statusCode: 500,
      message: "Error creating user",
    });
  }

  try {
    if (ref) await handleReferralRegister(ref, newUser.id);
  } catch (error) {
    console.error("Error handling referral registration:", error);
  }

  if (process.env.NEXT_PUBLIC_VERIFY_EMAIL_STATUS === "true") {
    await sendEmailVerificationToken(newUser.id, newUser.email);
    return {
      message: "Registration successful, please verify your email",
    };
  } else {
    return await returnUserWithTokens({
      user: newUser,
      message: "You have been registered successfully",
    });
  }
};
