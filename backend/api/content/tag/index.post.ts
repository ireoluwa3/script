// /server/api/blog/tags/store.post.ts
import { models } from "@b/db";

import { createRecordResponses } from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Creates a new blog tag",
  description: "This endpoint creates a new blog tag.",
  operationId: "createTag",
  tags: ["Blog"],
  requiresAuth: true,
  requestBody: {
    description: "Data for creating a new tag",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            tag: {
              type: "string",
              description: "Name of the tag to create",
            },
          },
          required: ["tag"],
        },
      },
    },
    required: true,
  },
  responses: createRecordResponses("Tag"),
};

export default async (data: Handler) => {
  return createTag(data.body.tag);
};

export async function createTag(data: any): Promise<any> {
  await models.tag.create(data);

  return {
    message: "Tag created successfully",
  };
}
