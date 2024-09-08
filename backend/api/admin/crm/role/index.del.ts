import { models, sequelize } from "@b/db";
import { cacheRoles } from "./utils";
import { commonBulkDeleteResponses } from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Bulk deletes roles",
  operationId: "deleteBulkRoles",
  tags: ["Admin", "CRM", "Role"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "array",
          items: {
            type: "number",
          },
          description: "Array of role IDs to delete",
        },
      },
    },
  },
  permission: "Access Role Management",
  responses: commonBulkDeleteResponses("Roles"),
  requiresAuth: true,
};

export default async (data: Handler) => {
  try {
    // Wrap operations in a transaction block
    await sequelize.transaction(async (transaction) => {
      // Delete role permissions for the specified roles
      await models.rolePermission.destroy({
        where: {
          roleId: data.body.ids, // Sequelize uses array directly for `IN` queries
        },
        transaction, // Pass the transaction object to each query
      });

      // Delete the roles
      await models.role.destroy({
        where: {
          id: data.body.ids, // Sequelize uses array directly for `IN` queries
        },
        transaction, // Pass the transaction object to each query
      });
    });

    await cacheRoles(); // Assume this is correctly implemented elsewhere

    return {
      message: "Roles removed successfully",
    };
  } catch (error) {
    // Handle or log the error as necessary
    console.error("Failed to remove roles:", error);
    throw new Error("Failed to remove roles");
  }
};
