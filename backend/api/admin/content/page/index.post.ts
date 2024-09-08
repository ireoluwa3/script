// /api/admin/pages/store.post.ts

import { storeRecord, storeRecordResponses } from "@b/utils/query";
import { pageStoreSchema, basePageSchema } from "./utils";

export const metadata: OperationObject = {
  summary: "Stores or updates a CMS page",
  operationId: "storePage",
  tags: ["Admin", "Content", "Page"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: basePageSchema,
          required: ["title", "content", "slug", "status"],
        },
      },
    },
  },
  responses: storeRecordResponses(pageStoreSchema, "Page"),
  requiresAuth: true,
  permission: "Access Page Management",
};

export default async (data: Handler) => {
  const { body } = data;
  const { title, content, description, image, slug, status } = body;

  return await storeRecord({
    model: "page",
    data: {
      title,
      content,
      description,
      image,
      slug,
      status,
    },
  });
};
