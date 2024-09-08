// /server/api/blog/posts/show.get.ts
import { models } from "@b/db";
// import { redis } from '@b/utils/redis';

import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { basePostSchema } from "../utils";

export const metadata: OperationObject = {
  summary: "Retrieves a single blog post by ID",
  description: "This endpoint retrieves a single blog post by its ID.",
  operationId: "getPostById",
  tags: ["Blog"],
  requiresAuth: false,
  parameters: [
    {
      index: 0,
      name: "slug",
      in: "path",
      description: "The ID of the blog post to retrieve",
      required: true,
      schema: {
        type: "string",
        description: "Post ID",
      },
    },
  ],
  responses: {
    200: {
      description: "Blog post retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: basePostSchema,
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Post"),
    500: serverErrorResponse,
  },
};

export default async (data: Handler) => {
  return await getPost(data.params.slug);
};

export async function getPost(slug: string): Promise<any | null> {
  return await models.post.findOne({
    where: { slug },
    include: [
      {
        model: models.author,
        as: "author",
        include: [
          {
            model: models.user,
            as: "user",
            attributes: ["firstName", "lastName", "email", "avatar"],
            include: [
              {
                model: models.role,
                as: "role",
                attributes: ["name"],
              },
            ],
          },
        ],
      },
      {
        model: models.category,
        as: "category",
      },
      {
        model: models.tag,
        as: "tags",
        through: {
          attributes: [],
        },
      },
      {
        model: models.comment,
        as: "comments",
        attributes: ["id", "content", "createdAt"],
        include: [
          {
            model: models.user,
            as: "user",
            attributes: ["firstName", "lastName", "email", "avatar"],
          },
        ],
      },
    ],
  });
}
