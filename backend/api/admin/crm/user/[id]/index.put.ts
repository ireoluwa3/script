// /server/api/admin/users/[id]/update.put.ts

import { createError } from "@b/utils/error";
import { models } from "@b/db";
import { updateRecordResponses } from "@b/utils/query";
import { userUpdateSchema } from "../utils";

export const metadata: OperationObject = {
  summary: "Updates a specific user by UUID",
  operationId: "updateUserByUuid",
  tags: ["Admin", "CRM", "User"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      description: "ID of the user to update",
      schema: { type: "string" },
    },
  ],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: userUpdateSchema,
      },
    },
  },
  responses: updateRecordResponses("User"),
  requiresAuth: true,
  permission: "Access User Management",
};

export default async (data: Handler) => {
  const { params, body, user } = data;
  const { id } = params;
  const {
    firstName,
    lastName,
    email,
    roleId,
    avatar,
    phone,
    emailVerified,
    twoFactor,
    status,
    profile,
  } = body;

  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  const existingUser = await models.user.findOne({
    where: { id },
    include: [{ model: models.role, as: "role" }],
  });
  if (!existingUser) {
    throw createError({
      statusCode: 404,
      message: "User not found",
    });
  }
  if (existingUser.id === user.id && user.role.name !== "Super Admin") {
    throw createError({
      statusCode: 400,
      message: "You cannot update your own account",
    });
  }
  await models.user.update(
    {
      firstName,
      lastName,
      email,
      roleId: Number(roleId),
      avatar,
      phone,
      emailVerified,
      status,
      profile,
    },
    {
      where: { id },
    }
  );

  if (twoFactor) {
    await models.twoFactor.update(
      { enabled: false },
      { where: { userId: id } }
    );
  }

  return {
    message: "User updated successfully",
  };
};
