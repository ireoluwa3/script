// /api/admin/pages/[id]/update.put.ts
import { updateRecord, updateRecordResponses } from "@b/utils/query";
import { pageUpdateSchema } from "../utils";

export const metadata: OperationObject = {
  summary: "Updates an existing page",
  operationId: "updatePage",
  tags: ["Admin", "Content", "Page"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      description: "ID of the page to update",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  requestBody: {
    required: true,
    description: "Updated data for the page",
    content: {
      "application/json": {
        schema: pageUpdateSchema,
      },
    },
  },
  responses: updateRecordResponses("Page"),
  requiresAuth: true,
  permission: "Access Page Management",
};

export default async (data: Handler) => {
  const { body, params } = data;
  const { id } = params;
  const { title, content, description, image, slug, status } = body;

  return await updateRecord("page", id, {
    title,
    content,
    description,
    image,
    slug,
    status,
  });
};
