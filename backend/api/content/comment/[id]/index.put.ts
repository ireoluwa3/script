// /server/api/blog/comments/update.put.ts
import { createError } from "@b/utils/error";
import { models } from "@b/db";

import { updateRecordResponses } from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Updates an existing blog comment",
  description: "This endpoint updates an existing blog comment.",
  operationId: "updateComment",
  tags: ["Blog"],
  requiresAuth: true,
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      description: "The ID of the comment to update",
      required: true,
      schema: {
        type: "string",
        description: "Comment ID",
      },
    },
  ],
  requestBody: {
    required: true,
    description: "Comment data to update",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            comment: { type: "string", description: "Updated comment content" },
          },
          required: ["comment"],
        },
      },
    },
  },
  responses: updateRecordResponses("Comment"),
};

export default async (data: Handler) => {
  return updateComment(data.params.id, data.body.comment);
};

export async function updateComment(id: string, data: any): Promise<any> {
  await models.comment.update(data, {
    where: { id },
  });

  const comment = await models.comment.findByPk(id);

  if (!comment) {
    throw createError(404, "Comment not found");
  }

  return {
    ...comment.get({ plain: true }),
    message: "Comment updated successfully",
  };
}
