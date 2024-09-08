import { models } from "@b/db";
import {
  getFiltered,
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { crudParameters, paginationSchema } from "@b/utils/constants";
import { basePostSchema } from "./utils";
import { createError } from "@b/utils/error";

export const metadata: OperationObject = {
  summary: "List all posts",
  operationId: "listPosts",
  tags: ["Content", "Author", "Post"],
  parameters: [
    ...crudParameters,
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
  ],
  responses: {
    200: {
      description: "Posts retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: basePostSchema,
                },
              },
              pagination: paginationSchema,
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Posts"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { query, user, params } = data;
  if (!user?.id)
    throw createError({ statusCode: 401, message: "Unauthorized" });

  const { authorId } = params;
  return getFiltered({
    model: models.post,
    query,
    where: { authorId },
    sortField: query.sortField || "createdAt",
    includeModels: [
      {
        model: models.category,
        as: "category",
        attributes: ["id", "name", "slug"],
      },
      {
        model: models.author,
        as: "author",
        includeModels: [
          {
            model: models.user,
            as: "user",
            attributes: ["firstName", "lastName", "email", "avatar"],
          },
        ],
      },
    ],
  });
};
