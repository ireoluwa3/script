// /api/admin/pages/structure.get.ts

import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for CMS pages",
  operationId: "getPagesStructure",
  tags: ["Admin", "Content", "Page"],
  responses: {
    200: {
      description: "Form structure for CMS pages",
      content: structureSchema,
    },
  },
  permission: "Access Page Management",
};

export const pageStructure = () => {
  const title = {
    type: "input",
    label: "Title",
    name: "title",
    placeholder: "Enter the title of the page",
  };

  const content = {
    type: "textarea",
    label: "Content",
    name: "content",
    placeholder: "Enter the content of the page",
  };

  const description = {
    type: "textarea",
    label: "Description",
    name: "description",
    placeholder: "Enter a short description of the page",
  };

  const image = {
    type: "file",
    label: "Image",
    name: "image",
    placeholder: "Upload an image for the page",
    fileType: "image",
  };

  const slug = {
    type: "input",
    label: "Slug",
    name: "slug",
    placeholder: "Enter the slug for the page URL",
  };

  const status = {
    type: "select",
    label: "Status",
    name: "status",
    options: [
      { value: "PUBLISHED", label: "Published" },
      { value: "DRAFT", label: "Draft" },
    ],
    placeholder: "Select the publication status",
  };

  return {
    title,
    content,
    description,
    image,
    slug,
    status,
  };
};

export default async (): Promise<object> => {
  const { title, content, description, image, slug, status } = pageStructure();

  return {
    get: [title, content, description, image, slug, status],
    set: [title, content, description, image, slug, status],
  };
};
