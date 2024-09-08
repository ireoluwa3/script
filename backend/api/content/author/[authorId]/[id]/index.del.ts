import { createError } from "@b/utils/error";
import { deleteRecordResponses, handleSingleDelete } from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Deletes a specific post",
  operationId: "deletePost",
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
      index: 1,
      name: "id",
      in: "path",
      description: `ID of the post to delete`,
      required: true,
      schema: {
        type: "string",
      },
    },
    {
      name: "restore",
      in: "query",
      description: `Restore the post instead of deleting`,
      required: false,
      schema: {
        type: "boolean",
      },
    },
    {
      name: "force",
      in: "query",
      description: `Delete the post permanently`,
      required: false,
      schema: {
        type: "boolean",
      },
    },
  ],
  responses: deleteRecordResponses("Post"),
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { params, query, user } = data;
  if (!user?.id)
    throw createError({ statusCode: 401, message: "Unauthorized" });
  const { authorId } = params;

  return handleSingleDelete({
    model: "post",
    id: params.id,
    query,
    where: { authorId },
  });
};
