import { fromBigInt } from "../blockchain";
import client from "./client";
import { logError } from "@b/utils/logger";

interface FetchParams {
  query: {
    page?: number;
    perPage?: number;
    sortOrder?: string;
  };
  sortField?: string;
  excludeFields?: string[];
  keyspace?: string;
}

export async function getPaginatedRecords({
  keyspace,
  table,
  query,
  sortField = "createdAt",
  excludeFields = [],
}: {
  table: string;
} & FetchParams): Promise<{ items: any[]; pagination: any }> {
  const page = Number(query.page) || 1;
  const perPage = Number(query.perPage) || 10;

  // Fetch the total number of records to calculate totalPages
  const countQueryStr = `SELECT COUNT(*) FROM ${keyspace}.${table};`;

  let totalItems, totalPages;

  try {
    const countResult = await client.execute(countQueryStr, [], {
      prepare: true,
    });
    totalItems = countResult.rows[0].count;
    totalPages = Math.ceil(totalItems / perPage);
  } catch (error) {
    logError("scylla", error, __filename);
    throw new Error(`Failed to fetch total count: ${error.message}`);
  }

  const queryStr = `
    SELECT ${getSelectFields(excludeFields)}
    FROM ${keyspace}.${table}
    LIMIT ${perPage};
  `;

  try {
    const result = await client.execute(queryStr, [], {
      prepare: true,
    });

    // Determine the type of sortField and sort accordingly
    const sortedRows = result.rows
      .sort((a, b) => {
        const fieldA = a[sortField];
        const fieldB = b[sortField];

        if (typeof fieldA === "number" && typeof fieldB === "number") {
          return query.sortOrder === "asc" ? fieldA - fieldB : fieldB - fieldA;
        }

        if (typeof fieldA === "string" && typeof fieldB === "string") {
          return query.sortOrder === "asc"
            ? fieldA.localeCompare(fieldB)
            : fieldB.localeCompare(fieldA);
        }

        if (fieldA instanceof Date && fieldB instanceof Date) {
          return query.sortOrder === "asc"
            ? fieldA.getTime() - fieldB.getTime()
            : fieldB.getTime() - fieldA.getTime();
        }

        if (!isNaN(Date.parse(fieldA)) && !isNaN(Date.parse(fieldB))) {
          const dateA = new Date(fieldA);
          const dateB = new Date(fieldB);
          return query.sortOrder === "asc"
            ? dateA.getTime() - dateB.getTime()
            : dateB.getTime() - dateA.getTime();
        }

        return 0; // default case if types do not match or are not recognized
      })
      .map((order) => ({
        ...order,
        amount: fromBigInt(order.amount),
        entryPrice: fromBigInt(order.entryPrice),
        unrealizedPnl: fromBigInt(order.unrealizedPnl),
        stopLossPrice: fromBigInt(order.stopLossPrice),
        takeProfitPrice: fromBigInt(order.takeProfitPrice),
      }));

    return {
      items: sortedRows,
      pagination: {
        totalItems,
        currentPage: page,
        perPage,
        totalPages,
      },
    };
  } catch (error) {
    logError("scylla", error, __filename);
    throw new Error(`Failed to fetch paginated data: ${error.message}`);
  }
}

function getSelectFields(excludeFields: string[]): string {
  if (excludeFields.length === 0) {
    return "*";
  }
  return `* EXCEPT(${excludeFields.join(", ")})`;
}
