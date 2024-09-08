// /server/api/blog/tags/update.put.ts
import { createError } from "@b/utils/error";
import { models } from "@b/db";

import { updateRecordResponses } from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Updates an existing blog tag",
  description: "This endpoint updates an existing blog tag.",
  operationId: "updateTag",
  tags: ["Blog"],
  requiresAuth: true,
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      description: "The ID of the tag to update",
      required: true,
      schema: {
        type: "string",
        description: "Tag ID",
      },
    },
  ],
  requestBody: {
    required: true,
    description: "New name of the tag",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            tag: { type: "string", description: "New name of the tag" },
          },
          required: ["tag"],
        },
      },
    },
  },
  responses: updateRecordResponses("Tag"),
};

export default async (data: Handler) => {
  return updateTag(data.params.id, data.body.tag);
};

export async function updateTag(id: string, data: any): Promise<any> {
  await models.tag.update(data, {
    where: { id },
  });

  const tag = await models.tag.findByPk(id);

  if (!tag) {
    throw createError(404, "Tag not found");
  }

  return {
    ...tag.get({ plain: true }),
    message: "Tag updated successfully",
  };
}
