import { RedisSingleton } from "@b/utils/redis";
import { getSettings } from "./index.get";
const redis = RedisSingleton.getInstance();

export async function cacheSettings() {
  try {
    const settings = await getSettings();
    await redis.set("settings", JSON.stringify(settings), "EX", 1800); // Cache for 30 minutes
  } catch (error) {}
}

cacheSettings();
