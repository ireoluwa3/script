import { createError } from "@b/utils/error";
import { updateStatus, updateRecordResponses } from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Update Status for a Post",
  operationId: "updatePostStatus",
  tags: ["Content", "Author", "Post"],
  parameters: [
    {
      index: 0,
      name: "authorId",
      in: "path",
      description: "ID of the author",
      required: true,
      schema: {
        type: "string",
      },
    },
    {
      index: 0,
      name: "id",
      in: "path",
      required: true,
      description: "ID of the Post to update",
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
              type: "string",
              enum: ["PUBLISHED", "DRAFT", "TRASH"],
              description: "New status to apply to the Post",
            },
          },
          required: ["status"],
        },
      },
    },
  },
  responses: updateRecordResponses("Post"),
  requiresAuth: true,
};

export default async (data) => {
  const { body, params, user } = data;
  if (!user?.id)
    throw createError({ statusCode: 401, message: "Unauthorized" });

  const { id, authorId } = params;
  const { status } = body;
  return updateStatus("post", id, status, undefined, undefined, undefined, {
    authorId,
  });
};
