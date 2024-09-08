// /api/admin/categories/structure.get.ts

import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for Categories",
  operationId: "getTagStructure",
  tags: ["Admin", "Content", "Category"],
  responses: {
    200: {
      description: "Form structure for managing Categories",
      content: structureSchema,
    },
  },
  permission: "Access Tag Management",
};

export const tagStructure = () => {
  const name = {
    type: "input",
    label: "Name",
    name: "name",
    placeholder: "Enter the tag name",
  };

  const slug = {
    type: "input",
    label: "Slug",
    name: "slug",
    placeholder: "Enter the tag slug (URL-friendly name)",
  };

  return {
    name,
    slug,
  };
};

export default async (): Promise<object> => {
  const { name, slug } = tagStructure();

  return {
    set: [[name, slug]],
  };
};
