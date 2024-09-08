// /server/api/blog/posts/update.put.ts
import { slugify } from "@b/utils";
import { models, sequelize } from "@b/db";
import { createError } from "@b/utils/error";
import { tagAttributes } from "@db/tag";

export const metadata: OperationObject = {
  summary: "Updates a blog post identified by id",
  description: "This endpoint updates an existing blog post.",
  operationId: "updatePost",
  tags: ["Content", "Author", "Post"],
  requiresAuth: true,
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
      description: "The id of the blog post to update",
      required: true,
      schema: {
        type: "string",
        description: "Post Slug",
      },
    },
  ],
  requestBody: {
    required: true,
    description: "Updated blog post data",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            title: { type: "string", description: "Title of the post" },
            content: { type: "string", description: "Content of the post" },
            description: {
              type: "string",
              description: "Description of the post",
            },
            categoryId: {
              type: "string",
              description: "Category ID for the post",
            },
            status: {
              type: "string",
              description: "New status of the blog post",
              enum: ["PUBLISHED", "DRAFT"],
            },
            tags: {
              type: "array",
              description: "Array of tag names associated with the post",
              items: {
                type: "string",
              },
            },
          },
          required: ["title", "content", "categoryId", "status"],
        },
      },
    },
  },
  responses: {
    200: {
      description: "Blog post updated successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description:
                  "Confirmation message of successful author creation",
              },
            },
          },
        },
      },
    },
    401: {
      description: "Unauthorized, user must be authenticated",
    },
    404: {
      description: "Blog post not found",
    },
    500: {
      description: "Internal server error",
    },
  },
};

export default async (data) => {
  const { params, body, user } = data;
  if (!user?.id)
    throw createError({ statusCode: 401, message: "Unauthorized" });

  const { id } = params;
  const { content, tags, categoryId, description, title, status, image } = body;
  const { authorId } = params;

  return await sequelize
    .transaction(async (transaction) => {
      // Check if the post exists
      const existingPost = await models.post.findOne({
        where: { id, authorId },
        include: [{ model: models.postTag, as: "postTags" }],
        transaction,
      });

      if (!existingPost)
        throw new Error(
          "Post not found or you don't have permission to edit it."
        );

      // Update the post fields
      existingPost.title = title;
      existingPost.content = content;
      existingPost.description = description;
      existingPost.status = status;
      existingPost.image = image;

      // Save the post
      await existingPost.save();

      // Update the category if provided
      if (categoryId) {
        const category = await models.category.findByPk(categoryId, {
          transaction,
        });
        if (!category)
          throw new Error("Category not found with the provided ID");
        await existingPost.setCategory(category, { transaction });
      }

      // Update tags if provided
      if (tags) {
        await updateTags(existingPost, tags, transaction);
      }

      return {
        message: "Post updated successfully",
      };
    })
    .catch((error) => {
      throw error; // Rethrow error to handle it, e.g., send a response to the client
    });
};

async function updateTags(existingPost, tags, transaction) {
  // Remove existing tags
  await models.postTag.destroy({
    where: { postId: existingPost.id },
    transaction,
  });

  const tagInstances: tagAttributes[] = [];

  for (const tagName of tags) {
    const tagSlug = slugify(tagName.toLowerCase());

    // Check if the tag exists by slug
    let tag = await models.tag.findOne({
      where: { slug: tagSlug },
      transaction,
    });

    if (!tag) {
      tag = await models.tag.create(
        {
          name: tagName,
          slug: tagSlug,
        },
        { transaction }
      );
    }

    tagInstances.push(tag);
  }

  // Associate the tags with the post
  await models.postTag.bulkCreate(
    tagInstances.map((tag) => ({
      postId: existingPost.id,
      tagId: tag.id,
    })),
    { transaction }
  );
}
