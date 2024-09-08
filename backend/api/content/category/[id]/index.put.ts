// /server/api/blog/categories/update.put.ts
import { models } from "@b/db";
import { updateRecordResponses } from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Updates an existing blog category",
  description: "This endpoint updates an existing blog category.",
  operationId: "updateCategory",
  tags: ["Blog"],
  requiresAuth: true,
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      description: "The ID of the category to update",
      required: true,
      schema: {
        type: "string",
        description: "Category ID",
      },
    },
  ],
  requestBody: {
    required: true,
    description: "New name of the category",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              description: "New name of the category",
            },
          },
          required: ["category"],
        },
      },
    },
  },
  responses: updateRecordResponses("Category"),
};

export default async (data: Handler) => {
  return updateCategory(data.params.id, data.body.category);
};

export async function updateCategory(id: string, data: any): Promise<any> {
  await models.category.update(data, {
    where: { id },
  });

  const updatedCategory = await models.category.findOne({
    where: { id },
  });

  if (!updatedCategory) {
    throw new Error("Category not found");
  }

  return updatedCategory;
}
