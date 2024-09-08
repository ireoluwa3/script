// /api/admin/roles/[id]/update.put.ts
import { updateRecordResponses } from "@b/utils/query";
import { roleUpdateSchema } from "../utils";
import { models } from "@b/db";

export const metadata: OperationObject = {
  summary: "Updates an existing role",
  operationId: "updateRole",
  tags: ["Admin", "CRM", "Role"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      description: "ID of the role to update",
      schema: {
        type: "string",
      },
    },
  ],
  requestBody: {
    required: true,
    description: "Updated data for the role",
    content: {
      "application/json": {
        schema: roleUpdateSchema,
      },
    },
  },
  responses: updateRecordResponses("Role"),
  requiresAuth: true,
  permission: "Access Role Management",
};

export default async (data) => {
  const { body, params } = data;
  const { id } = params;
  const { name, permissions } = body;

  try {
    // Fetch the role by id, including current permissions
    const role = await models.role.findByPk(id, {
      include: [
        {
          model: models.permission,
          as: "permissions",
        },
      ],
    });
    if (!role) {
      throw new Error("Role not found");
    }

    // Update role name if it's provided and different
    if (name && role.name !== name) {
      await role.update({ name });
    }

    // Update permissions if provided
    if (permissions) {
      const permissionIds = permissions.map((permission) => permission.id);

      // Use setPermissions to update role's permissions
      await role.setPermissions(permissionIds);
    }

    // Optionally, refetch the updated role with its permissions
    const updatedRole = await models.role.findByPk(id, {
      include: [
        {
          model: models.permission,
          as: "permissions",
        },
      ],
    });

    return { message: "Role updated successfully", role: updatedRole };
  } catch (error) {
    throw new Error(error.message);
  }
};
