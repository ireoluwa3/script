import { models } from "@b/db";
import { updateRecordResponses } from "@b/utils/query";

export const metadata = {
  summary: "Update Status for a Extension",
  operationId: "updateExtensionStatus",
  tags: ["Admin", "Extensions"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      description: "ID of the Extension to update",
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
                "New status to apply to the Extension (true for active, false for inactive)",
            },
          },
          required: ["status"],
        },
      },
    },
  },
  responses: updateRecordResponses("Extension"),
  requiresAuth: true,
  permission: "Access Extension Management",
};

export default async (data) => {
  const { body, params } = data;
  const { id } = params;
  const { status } = body;

  await models.extension.update({ status }, { where: { productId: id } });

  return { message: "Extension status updated successfully" };
};
