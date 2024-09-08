// /server/api/blog/categories/store.post.ts
import { models } from "@b/db";
import { createRecordResponses } from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Creates a new blog category",
  description: "This endpoint creates a new blog category.",
  operationId: "createCategory",
  tags: ["Blog"],
  requiresAuth: true,
  requestBody: {
    required: true,
    description: "Name of the category to create",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            category: {
              type: "string",
              description: "Name of the category to create",
            },
          },
          required: ["category"],
        },
      },
    },
  },
  responses: createRecordResponses("Category"),
};

export default async (data: Handler) => {
  return createCategory(data.body.category);
};

export async function createCategory(data: any): Promise<any> {
  await models.category.create(data);

  return {
    message: "Category created successfully",
  };
}
