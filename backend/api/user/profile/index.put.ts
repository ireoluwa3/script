import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { models } from "@b/db";
import { unlink } from "fs/promises"; // Assuming you're using Node.js fs module for file operations

export const metadata: OperationObject = {
  summary: "Updates the profile of the current user",
  description: "Updates the profile of the currently authenticated user",
  operationId: "updateProfile",
  tags: ["Auth"],
  requiresAuth: true,
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
            metadata: {
              type: "object",
              description: "Metadata of the user",
            },
            avatar: {
              type: "string",
              description: "Avatar of the user",
              nullable: true,
            },
            phone: {
              type: "string",
              description: "Phone number of the user",
            },
            emailVerified: {
              type: "boolean",
              description: "Email verification status",
            },
            twoFactor: {
              type: "boolean",
              description: "Two-factor authentication status",
            },
            profile: {
              type: "object",
              properties: {
                bio: {
                  type: "string",
                  description: "User bio",
                },
                location: {
                  type: "object",
                  properties: {
                    address: {
                      type: "string",
                      description: "User address",
                    },
                    city: {
                      type: "string",
                      description: "User city",
                    },
                    country: {
                      type: "string",
                      description: "User country",
                    },
                    zip: {
                      type: "string",
                      description: "User zip code",
                    },
                  },
                },
                social: {
                  type: "object",
                  properties: {
                    facebook: {
                      type: "string",
                      description: "Facebook profile",
                    },
                    twitter: {
                      type: "string",
                      description: "Twitter profile",
                    },
                    dribbble: {
                      type: "string",
                      description: "Dribbble profile",
                    },
                    instagram: {
                      type: "string",
                      description: "Instagram profile",
                    },
                    github: {
                      type: "string",
                      description: "GitHub profile",
                    },
                    gitlab: {
                      type: "string",
                      description: "GitLab profile",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "User profile updated successfully",
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
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("User"),
    500: serverErrorResponse,
  },
};

export default async (data: Handler) => {
  const { user, body } = data;
  if (!user) {
    throw new Error("Authentication required to update profile");
  }
  const {
    firstName,
    lastName,
    email,
    metadata,
    avatar,
    phone,
    twoFactor,
    profile,
  } = body;

  return await updateUserQuery(
    user.id,
    firstName,
    lastName,
    email,
    metadata,
    avatar,
    phone,
    twoFactor,
    profile,
    user.avatar // Passing the original avatar path to check for unlinking
  );
};

export const updateUserQuery = async (
  id: string,
  firstName?: string,
  lastName?: string,
  email?: string,
  metadata?: any,
  avatar?: string | null,
  phone?: string,
  twoFactor?: boolean,
  profile?: any,
  originalAvatar?: string // Original avatar path
) => {
  const updateData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    metadata?: any;
    avatar?: string | null;
    phone?: string;
    twoFactor?: boolean;
    profile?: any;
    emailVerified?: boolean;
  } = {};

  // Only add fields to updateData if they are explicitly provided
  if (firstName !== undefined) updateData.firstName = firstName;
  if (lastName !== undefined) updateData.lastName = lastName;
  if (email !== undefined) updateData.email = email;
  if (metadata !== undefined) updateData.metadata = metadata;
  if (avatar !== undefined) updateData.avatar = avatar;
  if (phone !== undefined) updateData.phone = phone;
  if (twoFactor !== undefined) updateData.twoFactor = twoFactor;
  if (profile !== undefined) updateData.profile = profile;

  // Handle email uniqueness and email verification reset
  if (email) {
    const existingUserWithEmail = await models.user.findOne({
      where: { email },
    });

    if (existingUserWithEmail && existingUserWithEmail.id !== id) {
      throw new Error("Email already in use by another account");
    }

    updateData.emailVerified = false;
  }

  // Check if avatar is being set to null and original avatar was not null
  if (avatar === null && originalAvatar) {
    try {
      await unlink(originalAvatar);
    } catch (error) {
      console.error(`Failed to unlink avatar: ${error}`);
      throw new Error("Failed to unlink avatar from server");
    }
  }

  // Perform the update
  await models.user.update(updateData, {
    where: { id },
  });

  return { message: "Profile updated successfully" };
};
