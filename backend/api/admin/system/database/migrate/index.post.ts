import { createError } from "@b/utils/error";
import { createConnection } from "mysql2/promise";
import { v4 as uuidv4 } from "uuid";
import { gunzipSync } from "zlib";
import fs from "fs/promises";
import path from "path";
import { sendMessageToRoute } from "@b/handler/Websocket";
import { tableConfigs } from "./utils";
import sql2json from "@b/utils/sql2json"; // Ensure this path is correct

export const metadata = {
  summary: "Migrates data from a SQL file to the new database",
  description:
    "Transforms field names and inserts records into the new database",
  operationId: "migrateDatabase",
  tags: ["Admin", "Database"],
  requiresAuth: true,
  responses: {
    200: {
      description: "Database migration initiated",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description: "Success message",
              },
            },
          },
        },
      },
    },
    500: {
      description: "Internal server error",
    },
  },
  permission: "Access Database Migration Management"
};

const checkEnvVariables = () => {
  const requiredEnvVars = ["DB_HOST", "DB_USER", "DB_NAME"];
  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new Error(`Environment variable ${varName} is not set`);
    }
  });
};

const getDbConnection = async () => {
  const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
  if (!DB_HOST || !DB_USER || !DB_NAME) {
    throw new Error("Database configuration is incomplete");
  }

  const connection = await createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD || "",
    database: DB_NAME,
    multipleStatements: true,
    connectTimeout: 10000,
  });

  return connection;
};

const generateIdMapping = (
  records: any[],
  tableName: string,
  hasUuid: boolean
): Record<string, string> => {
  const idMapping: Record<string, string> = {};
  records.forEach((record) => {
    const oldId = record[0]; // Assuming id is the first column
    const newId = hasUuid && record[1] ? record[1] : uuidv4(); // Use existing uuid or generate new one
    idMapping[`${tableName}_${oldId}`] = newId;
  });
  return idMapping;
};

interface TableStats {
  total: number;
  inserted: number;
  failed: number;
  blacklisted: number;
}

const sendMessage = async (route: string, message: string, status: boolean) => {
  await sendMessageToRoute(route, {}, { status, message });
};

const migrateTable = async (
  connection: any,
  tableConfig: any,
  records: any[],
  idMapping: Record<string, string>,
  blacklist: Set<string>,
  tableStats: Record<string, TableStats>,
  lastSuccessMessagePerTable: Record<string, string>
) => {
  const { newTable, transform, oldTable } = tableConfig;
  const transformedRecords = records
    .map((record: any) => {
      if (record.address && typeof record.address === "string") {
        try {
          record.address = JSON.parse(record.address);
        } catch (e) {
          console.error(`Failed to parse address JSON: ${record.address}`);
          tableStats[oldTable].failed++;
          return null;
        }
      }
      return transform(record, idMapping, oldTable);
    })
    .filter((record) => record !== null); // Skip null records

  for (let i = 0; i < transformedRecords.length; i++) {
    const record = transformedRecords[i];
    const columns = Object.keys(record)
      .map((col) => `\`${col}\``) // Enclose column names in backticks
      .join(", ");
    const placeholders = Object.keys(record)
      .map(() => "?")
      .join(", ");
    const values = Object.values(record);

    const percentage = ((i + 1) / transformedRecords.length) * 100;
    const message = `[${i + 1}/${
      transformedRecords.length
    }, ${percentage.toFixed(2)}%] Processing table: ${oldTable}`;

    try {
      await connection.query(
        `INSERT INTO \`${newTable}\` (${columns}) VALUES (${placeholders})`,
        values
      );
      tableStats[oldTable].inserted++;

      if (lastSuccessMessagePerTable[oldTable] === message) {
        await sendMessage("/api/admin/system/database/migrate", message, true);
      } else {
        await sendMessage("/api/admin/system/database/migrate", message, true);
        lastSuccessMessagePerTable[oldTable] = message;
      }
    } catch (error) {
      tableStats[oldTable].failed++;
      await sendMessage(
        "/api/admin/system/database/migrate",
        `Failed to insert into ${newTable}: ${error.message}`,
        false
      );
      if (
        error.code === "ER_NO_REFERENCED_ROW_2" ||
        error.code === "ER_ROW_IS_REFERENCED_2"
      ) {
        console.error(
          `Foreign key constraint error for record: ${JSON.stringify(record)}`
        );
        continue;
      }
      if (error.code === "ER_DUP_ENTRY") {
        const duplicateFieldMatch = error.message.match(/for key '(.+)'/);
        if (duplicateFieldMatch) {
          const duplicateField = duplicateFieldMatch[1];
          blacklist.add(duplicateField);
          tableStats[oldTable].blacklisted++;
          continue;
        }
      }
      throw new Error(`Failed to insert into ${newTable}: ${error.message}`);
    }
  }
};

export default async (data: Handler) => {
  await sendMessage(
    "/api/admin/system/database/migrate",
    "Migration initiated",
    true
  );

  const connection = await getDbConnection();
  const maxRetries = 5;
  const retryDelay = 3000; // 3 seconds

  let retries = 0;
  let success = false;

  while (retries < maxRetries && !success) {
    try {
      await connection.beginTransaction();

      checkEnvVariables();

      const filePath = path.resolve(process.cwd(), "migration.sql");
      const gzFilePath = path.resolve(process.cwd(), "migration.sql.gz");

      let sqlData: string;

      if (
        await fs
          .access(gzFilePath)
          .then(() => true)
          .catch(() => false)
      ) {
        const buffer = await fs.readFile(gzFilePath);
        sqlData = gunzipSync(buffer).toString("utf-8");
      } else if (
        await fs
          .access(filePath)
          .then(() => true)
          .catch(() => false)
      ) {
        sqlData = await fs.readFile(filePath, "utf-8");
      } else {
        throw new Error("Migration file not found");
      }

      await sendMessage(
        "/api/admin/system/database/migrate",
        "SQL file loaded successfully",
        true
      );

      const requiredTables = new Set(
        tableConfigs.map((config) => config.oldTable)
      );
      const insertStatements = sql2json(sqlData, requiredTables);

      const idMapping: Record<string, string> = {};
      const blacklist: Set<string> = new Set();
      const tableStats: Record<string, TableStats> = {};
      const lastSuccessMessagePerTable: Record<string, string> = {};

      for (const tableConfig of tableConfigs) {
        const records = insertStatements[tableConfig.oldTable]?.values || [];
        tableStats[tableConfig.oldTable] = {
          total: records.length,
          inserted: 0,
          failed: 0,
          blacklisted: 0,
        };

        if (records.length > 0) {
          const tableIdMapping = generateIdMapping(
            records,
            tableConfig.oldTable,
            tableConfig.hasUuid
          );
          Object.assign(idMapping, tableIdMapping);

          await migrateTable(
            connection,
            tableConfig,
            records,
            idMapping,
            blacklist,
            tableStats,
            lastSuccessMessagePerTable
          );
        } else {
          console.log(`No records found for table: ${tableConfig.oldTable}`);
        }
      }

      await connection.commit();

      const summaryEntries = Object.entries(tableStats).map(
        ([table, stats]) => {
          return `${table}: Total: ${stats.total}, Inserted: ${stats.inserted}, Failed: ${stats.failed}, Blacklisted: ${stats.blacklisted}`;
        }
      );

      for (const summary of summaryEntries) {
        await sendMessage(
          "/api/admin/system/database/migrate",
          `COMPLETED\n${summary}`,
          true
        );
      }

      success = true;
    } catch (error: any) {
      await connection.rollback();

      if (error.code === "ER_LOCK_DEADLOCK") {
        retries++;
        if (retries < maxRetries) {
          await sendMessage(
            "/api/admin/system/database/migrate",
            `Deadlock encountered, retrying in ${
              retryDelay / 1000
            } seconds... (${retries}/${maxRetries})`,
            false
          );
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        } else {
          await sendMessage(
            "/api/admin/system/database/migrate",
            `Error migrating database after ${maxRetries} retries: ${error.message}`,
            false
          );
          throw createError({
            statusCode: 500,
            message: `Error migrating database after ${maxRetries} retries: ${error.message}`,
          });
        }
      } else {
        await sendMessage(
          "/api/admin/system/database/migrate",
          `Error migrating database: ${error.message}`,
          false
        );
        throw createError({
          statusCode: 500,
          message: `Error migrating database: ${error.message}`,
        });
      }
    } finally {
      await connection.end();
    }
  }

  return { message: "Migration initiated" };
};
