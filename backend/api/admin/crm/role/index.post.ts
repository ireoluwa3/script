// /api/admin/roles/store.post.ts

import { roleStoreSchema, cacheRoles, baseRoleSchema } from "./utils";
import { models } from "@b/db";
import { storeRecordResponses } from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Stores or updates a role",
  operationId: "storeRole",
  tags: ["Admin", "CRM", "Role"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: baseRoleSchema,
          required: ["name", "permissions"],
        },
      },
    },
  },
  responses: storeRecordResponses(roleStoreSchema, "Role"),
  requiresAuth: true,
  permission: "Access Role Management",
};

export default async (data) => {
  const { body } = data;
  const { name, permissions } = body;

  try {
    // Create a new role
    const role = await models.role.create({ name });

    // Set permissions for the role
    const permissionIds = permissions.map((permission) => permission.id);
    await role.setPermissions(permissionIds);

    // Optionally, refetch the created role with its permissions
    const newRole = await models.role.findByPk(role.id, {
      include: [
        {
          model: models.permission,
          as: "permissions",
        },
      ],
    });

    // Update the cache for roles
    await cacheRoles();

    return { message: "Role created successfully", role: newRole };
  } catch (error) {
    throw new Error(error.message);
  }
};
