import { Sequelize } from "sequelize";
import { Models, initModels } from "@db/init";
import { RedisSingleton } from "@b/utils/redis";
import { promisify } from "util";

const redis = RedisSingleton.getInstance();
const getAsync = promisify(redis.get).bind(redis);
const setAsync = promisify(redis.set).bind(redis);
const delAsync = promisify(redis.del).bind(redis);

export class SequelizeSingleton {
  private static instance: SequelizeSingleton;
  private sequelize: Sequelize;
  public models: Models;

  private constructor() {
    this.sequelize = new Sequelize(
      process.env.DB_NAME as string,
      process.env.DB_USER as string,
      process.env.DB_PASSWORD as string,
      {
        host: process.env.DB_HOST as string,
        dialect: "mysql",
        port: Number(process.env.DB_PORT),
        logging: false,
        dialectOptions: {
          charset: "utf8mb4",
        },
        define: {
          charset: "utf8mb4",
          collate: "utf8mb4_unicode_ci",
        },
      }
    );
    this.models = this.initModels();
    this.syncDatabase();
  }

  public static getInstance(): SequelizeSingleton {
    if (!SequelizeSingleton.instance) {
      SequelizeSingleton.instance = new SequelizeSingleton();
    }
    return SequelizeSingleton.instance;
  }

  public getSequelize(): Sequelize {
    return this.sequelize;
  }

  private initModels() {
    const models = initModels(this.sequelize);
    console.info("Models initialized successfully.");
    return models;
  }

  private async syncDatabase() {
    try {
      await this.sequelize.sync({ alter: true });
    } catch (error) {
      console.error("Database sync failed:", error);
      throw error;
    }
  }

  cache() {
    return {
      findAll: async (modelName, options) => {
        const cacheKey = `findAll_${modelName}_${JSON.stringify(options)}`;
        return this._cachedFindAll(modelName, cacheKey, options);
      },

      create: async (modelName, data) => {
        return this._cachedCreate(modelName, data);
      },

      update: async (modelName, values, options) => {
        return this._cachedUpdate(modelName, values, options);
      },

      destroy: async (modelName, options) => {
        return this._cachedDestroy(modelName, options);
      },

      upsert: async (modelName, values, options) => {
        return this._cachedUpsert(modelName, values, options);
      },
    };
  }

  async _cachedFindAll(modelName, cacheKey, options) {
    try {
      const cachedData = await getAsync(cacheKey);
      if (cachedData) return JSON.parse(cachedData);
      const result = await this.models[modelName].findAll(options);
      await setAsync(cacheKey, JSON.stringify(result), "EX", 3600); // Expires in 1 hour
      return result;
    } catch (error) {
      console.error(`Error in _cachedFindAll for ${modelName}: ${error}`);
      return this.models[modelName].findAll(options);
    }
  }

  async _cachedCreate(modelName, data) {
    try {
      const result = await this.models[modelName].create(data);
      const cacheKey = `findAll_${modelName}`; // Simplified example; adjust as needed
      await delAsync(cacheKey); // Invalidate findAll cache
      return result;
    } catch (error) {
      console.error(`Error in _cachedCreate for ${modelName}: ${error}`);
      throw error;
    }
  }

  async _cachedUpdate(modelName, values, options) {
    try {
      const result = await this.models[modelName].update(values, options);
      const cacheKey = `findAll_${modelName}`; // Simplified example; adjust for specific queries as needed
      await delAsync(cacheKey); // Invalidate findAll cache
      return result;
    } catch (error) {
      console.error(`Error in _cachedUpdate for ${modelName}: ${error}`);
      throw error;
    }
  }

  async _cachedDestroy(modelName, options) {
    try {
      const result = await this.models[modelName].destroy(options);
      const cacheKey = `findAll_${modelName}`; // Adjust as necessary
      await delAsync(cacheKey); // Invalidate cache
      return result;
    } catch (error) {
      console.error(`Error in _cachedDestroy for ${modelName}: ${error}`);
      throw error;
    }
  }

  async _cachedUpsert(modelName, values, options) {
    try {
      const result = await this.models[modelName].upsert(values, options);
      const cacheKey = `findAll_${modelName}`; // Simplified for demonstration
      await delAsync(cacheKey); // Invalidate cache
      return result;
    } catch (error) {
      console.error(`Error in _cachedUpsert for ${modelName}: ${error}`);
      throw error;
    }
  }
}

export const db = SequelizeSingleton.getInstance();
export const sequelize = db.getSequelize();
export const models = db.models;
export default db;
