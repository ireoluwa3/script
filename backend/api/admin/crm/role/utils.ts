import { models } from "@b/db";
import { RedisSingleton } from "@b/utils/redis";
const redis = RedisSingleton.getInstance();

// Function to cache the roles
export async function cacheRoles() {
  try {
    const roles = await getRoles();
    await redis.set("roles", JSON.stringify(roles), "EX", 3600);
  } catch (error) {}
}

// Initialize the cache when the file is loaded
cacheRoles();

export async function getRoles(): Promise<Role[]> {
  const roles = await models.role.findAll({
    include: [
      {
        model: models.rolePermission,
        as: "permissions",
        include: [
          {
            model: models.permission, // Correct model name for the association
            as: "permission",
          },
        ],
      },
    ],
  });

  // Convert each Sequelize model instance to a plain object
  return roles.map((role) => role.get({ plain: true })) as unknown as Role[];
}

export async function getRole(id: string): Promise<Role | null> {
  const role = await models.role.findOne({
    where: {
      id,
    },
    include: [
      {
        model: models.rolePermission,
        as: "permissions",
        include: [
          {
            model: models.permission,
            as: "permission",
          },
        ],
      },
    ],
  });

  if (!role) {
    return null;
  }

  // Convert the Sequelize model instance to a plain object if the role was found
  return role.get({ plain: true }) as unknown as Role;
}
import { baseStringSchema } from "@b/utils/schema"; // Adjust the import path as necessary

// Define base components for the role schema
const id = baseStringSchema("ID of the role");
const name = baseStringSchema("Name of the role");
const permissions = {
  type: "array",
  items: {
    type: "object",
    properties: {
      value: baseStringSchema("ID of the permission"),
      label: baseStringSchema("Name of the permission"),
    },
  },
};

// Base schema definition for roles
export const baseRoleSchema = {
  id,
  name,
  permissions,
};

// Schema for updating a role
export const roleUpdateSchema = {
  type: "object",
  properties: {
    name,
    permissions,
  },
  required: ["name", "permissions"], // Ensure that name and permissions are mandatory for updates
};

// Schema for defining a new role
export const roleStoreSchema = {
  description: `Role created or updated successfully`,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: baseRoleSchema,
      },
    },
  },
};
