// /api/admin/roles/structure.get.ts
import { models } from "@b/db";
import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for roles",
  operationId: "getRolesStructure",
  tags: ["Admin", "CRM", "Role"],
  responses: {
    200: {
      description: "Form structure for roles",
      content: structureSchema,
    },
  },
  permission: "Access Role Management",
};

export const roleStructure = async () => {
  const name = { type: "input", label: "Name", name: "name" };

  const permissions = await models.permission.findAll();
  const permissionIds = {
    type: "tags",
    label: "Permissions",
    name: "permissions",
    key: "name",
    options: permissions.map((permission) => ({
      id: permission.id,
      name: permission.name,
    })),
  };

  return {
    name,
    permissionIds,
  };
};

export default async (): Promise<object> => {
  const { name, permissionIds } = await roleStructure();

  return {
    get: {
      name,
      permissions: {
        type: "tags",
        label: "Permissions",
        name: "permissions",
        key: "name",
      },
    },
    set: [name, permissionIds],
  };
};
