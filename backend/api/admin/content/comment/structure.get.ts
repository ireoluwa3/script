// /api/admin/comments/structure.get.ts

import { structureSchema } from "@b/utils/constants";
import { models } from "@b/db";

export const metadata = {
  summary: "Get form structure for Comments",
  operationId: "getCommentStructure",
  tags: ["Admin", "Content", "Comment"],
  responses: {
    200: {
      description: "Form structure for managing Comments",
      content: structureSchema,
    },
  },
  permission: "Access Comment Management",
};

export const commentStructure = async () => {
  const posts = await models.post.findAll();

  const content = {
    type: "textarea",
    label: "Content",
    name: "content",
    placeholder: "Enter the content of the comment",
  };

  const userId = {
    type: "input",
    label: "User",
    name: "userId",
    placeholder: "Enter the associated user ID",
  };

  const postId = {
    type: "select",
    label: "Post",
    name: "postId",
    options: posts.map((post) => ({
      value: post.id,
      label: post.title,
    })),
    placeholder: "Select the associated post",
  };

  return {
    content,
    userId,
    postId,
  };
};

export default async (): Promise<object> => {
  const { content, userId, postId } = await commentStructure();

  return {
    get: [content],
    set: [content],
  };
};
