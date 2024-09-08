// /server/api/blog/categories/index.get.ts
import { models } from "@b/db";
import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { baseCategorySchema, categoryPostsSchema } from "./utils";

export const metadata: OperationObject = {
  summary: "Lists all categories with optional inclusion of posts",
  description:
    "This endpoint retrieves all available categories along with their associated posts.",
  operationId: "getCategories",
  tags: ["Blog"],
  requiresAuth: false,
  responses: {
    200: {
      description: "Categories retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                ...baseCategorySchema,
                posts: categoryPostsSchema,
              },
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Category"),
    500: serverErrorResponse,
  },
};

export default async (data: Handler) => {
  return (
    await models.category.findAll({
      include: [
        {
          model: models.post,
          as: "posts",
          attributes: ["title", "description", "slug", "image", "createdAt"],
          where: { status: "PUBLISHED" },
          required: false,
          include: [
            {
              model: models.author,
              as: "author",
              attributes: ["id"],
              include: [
                {
                  model: models.user,
                  as: "user",
                  attributes: ["firstName", "lastName", "email", "avatar"],
                },
              ],
            },
          ],
        },
      ],
    })
  ).map((category) => category.get({ plain: true }));
};
