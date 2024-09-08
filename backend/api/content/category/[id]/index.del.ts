// /server/api/blog/categories/delete.del.ts
import { models } from "@b/db";
import { deleteRecordResponses } from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Deletes a blog category",
  description: "This endpoint deletes a blog category.",
  operationId: "deleteCategory",
  tags: ["Blog"],
  requiresAuth: true,
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      description: "The ID of the category to delete",
      required: true,
      schema: {
        type: "string",
        description: "Category ID",
      },
    },
  ],
  responses: deleteRecordResponses("Category"),
};

export default async (data: Handler) => {
  return deleteCategory(data.params.id);
};

export async function deleteCategory(id: string): Promise<any> {
  return await models.category.destroy({
    where: { id },
  });
}
