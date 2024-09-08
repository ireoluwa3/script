// /server/api/auth/profile.get.ts

import { models } from "@b/db";
import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { createError } from "@b/utils/error";

export const metadata: OperationObject = {
  summary: "Retrieves the profile of the current user",
  description: "Fetches the profile of the currently authenticated user",
  operationId: "getProfile",
  tags: ["Auth"],
  requiresAuth: true, // Assuming fetching profile requires the user to be authenticated
  responses: {
    200: {
      description: "User profile retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: { type: "string", description: "ID of the user" },
              email: { type: "string", description: "Email of the user" },
              firstName: {
                type: "string",
                description: "First name of the user",
              },
              lastName: {
                type: "string",
                description: "Last name of the user",
              },
              role: { type: "string", description: "Role of the user" },
              createdAt: {
                type: "string",
                format: "date-time",
                description: "Date and time when the user was created",
              },
              updatedAt: {
                type: "string",
                format: "date-time",
                description: "Date and time when the user was last updated",
              },
            },
            required: [
              "id",
              "email",
              "firstName",
              "lastName",
              "role",
              "createdAt",
              "updatedAt",
            ],
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("User"),
    500: serverErrorResponse,
  },
};

export default (data: Handler) => {
  const { user } = data;
  if (!user?.id) {
    throw createError({
      statusCode: 401,
      message: "Authentication required, Please log in.",
    });
  }
  return getUserById(user.id);
};

// Get user by ID
export const getUserById = async (id: string) => {
  const user = await models.user.findOne({
    where: { id },
    include: [
      {
        model: models.role,
        as: "role",
        attributes: ["id", "name"],
        include: [
          {
            model: models.permission,
            as: "permissions",
            through: { attributes: [] },
            attributes: ["id", "name"],
          },
        ],
      },
      {
        model: models.twoFactor,
        as: "twoFactor",
        attributes: ["type", "enabled"],
      },
      {
        model: models.kyc,
        as: "kyc",
        attributes: ["status", "level"],
      },
      {
        model: models.author,
        as: "author",
        attributes: ["id", "status"],
      },
      {
        model: models.providerUser,
        as: "providerUsers",
        attributes: ["provider"],
      },
    ],
    attributes: { exclude: ["password"] },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user.get({ plain: true });
};
