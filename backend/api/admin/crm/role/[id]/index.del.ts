import { models, sequelize } from "@b/db";
import { cacheRoles } from "../utils";
import { deleteRecordResponses } from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Deletes a role",
  operationId: "deleteRole",
  tags: ["Admin", "CRM", "Role"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      description: "ID of the role to delete",
      required: true,
      schema: {
        type: "number",
      },
    },
  ],
  permission: "Access Role Management",
  responses: deleteRecordResponses("Role"),
  requiresAuth: true,
};

export default async (data) => {
  try {
    await sequelize.transaction(async (transaction) => {
      await models.rolePermission.destroy({
        where: {
          roleId: data.params.id,
        },
        transaction, // Pass the transaction object to each query
      });

      await models.role.destroy({
        where: {
          id: data.params.id,
        },
        transaction, // Pass the transaction object to each query
      });
    });

    await cacheRoles(); // Assume this is correctly implemented elsewhere

    return {
      message: "Role removed successfully",
    };
  } catch (error) {
    // Handle or log the error as necessary
    console.error("Transaction failed:", error);
    throw new Error("Failed to remove the role");
  }
};
