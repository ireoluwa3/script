// /api/admin/categories/structure.get.ts

import { structureSchema } from "@b/utils/constants";
import { imageStructure } from "@b/utils/schema/structure";

export const metadata = {
  summary: "Get form structure for Categories",
  operationId: "getCategoryStructure",
  tags: ["Admin", "Content", "Category"],
  responses: {
    200: {
      description: "Form structure for managing Categories",
      content: structureSchema,
    },
  },
  permission: "Access Category Management",
};

export const categoryStructure = () => {
  const name = {
    type: "input",
    label: "Name",
    name: "name",
    placeholder: "Enter the category name",
  };

  const slug = {
    type: "input",
    label: "Slug",
    name: "slug",
    placeholder: "Enter the category slug (URL-friendly name)",
  };

  const image = {
    type: "file",
    label: "Image",
    name: "image",
    placeholder: "Upload an image for the category",
    fileType: "image",
  };

  const description = {
    type: "textarea",
    label: "Description",
    name: "description",
    placeholder: "Enter a description for the category",
  };

  return {
    name,
    slug,
    image,
    description,
  };
};

export default async (): Promise<object> => {
  const { name, slug, image, description } = categoryStructure();

  return {
    get: [
      {
        fields: [
          {
            ...imageStructure,
            width: 300,
            height: 300,
          },
          {
            fields: [name, slug],
            grid: "column",
          },
        ],
        className: "card-dashed mb-3 items-center",
      },
      description,
    ],
    set: [
      {
        ...imageStructure,
        width: 300,
        height: 300,
      },
      [name, slug],
      description,
    ],
  };
};
