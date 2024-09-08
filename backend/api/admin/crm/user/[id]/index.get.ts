// /server/api/admin/users/[id].get.ts

import {
  getRecord,
  unauthorizedResponse,
  notFoundMetadataResponse,
  serverErrorResponse,
} from "@b/utils/query";
import { userSchema } from "../utils";
import { models } from "@b/db";

export const metadata: OperationObject = {
  summary: "Retrieves detailed information of a specific user by UUID",
  operationId: "getUserByUuid",
  tags: ["Admin", "CRM", "User"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      description: "ID of the user to retrieve",
      schema: { type: "string" },
    },
  ],
  responses: {
    200: {
      description: "User details",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: userSchema,
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("User"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
  permission: "Access User Management",
};

export default async (data: Handler) => {
  const { params } = data;

  return await getRecord(
    "user",
    params.id,
    [
      {
        model: models.role,
        as: "role",
        attributes: ["id", "name"],
      },
    ],
    [
      "password",
      "lastLogin",
      "lastFailedLogin",
      "failedLoginAttempts",
      "walletAddress",
      "walletProvider",
      "metadata",
      "updatedAt",
    ]
  );
};
