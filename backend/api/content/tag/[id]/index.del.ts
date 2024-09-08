// /server/api/blog/tags/delete.del.ts
import { models } from "@b/db";

import { deleteRecordResponses } from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Deletes a blog tag",
  description: "This endpoint deletes a blog tag.",
  operationId: "deleteTag",
  tags: ["Blog"],
  requiresAuth: true,
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      description: "The ID of the tag to delete",
      required: true,
      schema: {
        type: "string",
        description: "Tag ID",
      },
    },
  ],

  responses: deleteRecordResponses("Tag"),
};

export default async (data: Handler) => {
  return deleteTag(data.params.id);
};

export async function deleteTag(id: string): Promise<any> {
  await models.tag.destroy({
    where: { id },
  });
  return {
    message: "Tag deleted successfully",
  };
}
