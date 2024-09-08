import { Redis } from "ioredis";

export class RedisSingleton {
  private static instance: Redis;

  private constructor() {}

  public static getInstance(): Redis {
    if (!RedisSingleton.instance) {
      RedisSingleton.instance = new Redis();
    }
    return RedisSingleton.instance;
  }
}
