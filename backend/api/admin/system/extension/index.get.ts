// /server/api/comments/index.get.ts

import { models } from "@b/db";
import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { Op } from "sequelize";

export const metadata = {
  summary:
    "Lists all comments with pagination and optional filtering by user or post",
  operationId: "listComments",
  tags: ["Admin", "Content", "Comment"],
  responses: {
    200: {
      description: "List of comments with user and post details and pagination",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: {
                  type: "string",
                  description: "ID of the extension",
                },
                productId: {
                  type: "string",
                  description: "Product ID of the extension",
                },
                name: {
                  type: "string",
                  description: "Name of the extension",
                },
                title: {
                  type: "string",
                  description: "Title of the extension",
                },
                description: {
                  type: "string",
                  description: "Description of the extension",
                },
                link: {
                  type: "string",
                  description: "Link to the extension",
                },
                status: {
                  type: "boolean",
                  description: "Status of the extension",
                },
                version: {
                  type: "string",
                  description: "Version of the extension",
                },
                image: {
                  type: "string",
                  description: "Image of the extension",
                },
              },
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Extensions"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
  permission: "Access Extension Management",
};

export default async (data: Handler) => {
  const extensions = await models.extension.findAll({
    where: {
      name: {
        [Op.ne]: "swap",
      },
    },
  });
  return extensions;
};
