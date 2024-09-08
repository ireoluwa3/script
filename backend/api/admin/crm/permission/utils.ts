import { models } from "@b/db";
import { RedisSingleton } from "@b/utils/redis";
const redis = RedisSingleton.getInstance();

// Function to cache the permissions
export async function cachePermissions() {
  try {
    const permissions = await getPermissions();
    await redis.set("permissions", JSON.stringify(permissions), "EX", 3600);
  } catch (error) {}
}

// Initialize the cache when the file is loaded
cachePermissions();

export async function getPermissions(): Promise<Permission[]> {
  return (
    await models.permission.findAll({
      include: [
        {
          model: models.rolePermission,
          as: "rolePermissions", // Ensure this matches the alias used in the association definition
        },
      ],
    })
  ).map((permission) =>
    permission.get({ plain: true })
  ) as unknown as Permission[];
}
