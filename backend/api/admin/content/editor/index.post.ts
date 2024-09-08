// /server/api/editor/save.post.ts

import { cachePages } from "@b/api/content/page/utils";
import { models } from "@b/db";
import { createError } from "@b/utils/error";
import { serverErrorResponse } from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Save editor state",
  operationId: "saveEditorState",
  tags: ["Admin", "Editor"],
  description: "Saves the current state of the editor.",
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            content: {
              type: "string",
              description: "The current state of the editor",
            },
            path: {
              type: "string",
              description: "The path to save the file",
            },
          },
          required: ["content", "path"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "State saved successfully",
    },
    500: serverErrorResponse,
  },
  requiresAuth: true,
  permission: "Access Frontend Builder",
};

export default async (data: Handler) => {
  const { user, body } = data;
  if (!user?.id)
    throw createError({ statusCode: 401, message: "Unauthorized" });

  try {
    const { content, path } = body;

    const existingState = await models.page.findOne({
      where: { slug: path === "/" ? "frontend" : path },
    });
    if (existingState) {
      await existingState.update({
        content,
      });
    } else {
      await models.page.create({
        title: "Frontend",
        slug: "frontend",
        content,
        status: "PUBLISHED",
      });
    }
    await cachePages();

    return { message: "State saved successfully" };
  } catch (error) {
    console.error("Failed to save editor state:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to save editor state",
    });
  }
};
