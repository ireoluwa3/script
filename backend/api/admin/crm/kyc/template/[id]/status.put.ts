import { models, sequelize } from "@b/db";
import { updateRecordResponses } from "@b/utils/query";
import { Op } from "sequelize";

export const metadata: OperationObject = {
  summary: "Updates the status of a KYC template",
  operationId: "updateKycTemplateStatus",
  tags: ["Admin", "CRM", "KYC Template"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      description: "ID of the KYC template to update",
      schema: { type: "string" },
    },
  ],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            status: {
              type: "boolean",
              description:
                "New status to apply (true for active, false for inactive)",
            },
          },
          required: ["status"],
        },
      },
    },
  },
  responses: updateRecordResponses("KYC Template"),
  requiresAuth: true,
  permission: "Access KYC Template Management",
};

export default async (data: Handler) => {
  const { body, params } = data;
  const { id } = params;
  const { status } = body;

  const transaction = await sequelize.transaction();

  try {
    // Deactivate all other templates if status is true
    if (status) {
      await models.kycTemplate.update(
        { status: false },
        { where: { id: { [Op.ne]: id } }, transaction }
      );
    }

    // Update the status of the selected template
    await models.kycTemplate.update({ status }, { where: { id }, transaction });

    await transaction.commit();

    return {
      statusCode: 200,
      body: {
        message: "KYC template status updated successfully",
      },
    };
  } catch (error) {
    await transaction.rollback();
    return {
      statusCode: 500,
      body: {
        message: "Failed to update KYC template status",
        error: error.message,
      },
    };
  }
};
