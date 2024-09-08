import { baseStringSchema, baseEnumSchema } from "@b/utils/schema"; // Adjust the import path as necessary

// Base schema components for CMS pages
const id = {
  ...baseStringSchema("ID of the CMS page"),
  nullable: true, // Optional for creation
};
const title = baseStringSchema("Title of the CMS page");
const content = baseStringSchema("Content of the CMS page");
const description = {
  ...baseStringSchema("Short description of the CMS page"),
  nullable: true,
};
const image = {
  ...baseStringSchema("URL to the image associated with the CMS page"),
  nullable: true,
};
const slug = baseStringSchema("Slug for the CMS page URL");
const status = baseEnumSchema("Publication status of the CMS page", [
  "PUBLISHED",
  "DRAFT",
]);

// Base schema definition for CMS pages
export const basePageSchema = {
  id,
  title,
  content,
  description,
  image,
  slug,
  status,
};

// Schema for updating a CMS page
export const pageUpdateSchema = {
  type: "object",
  properties: {
    title,
    content,
    description,
    image,
    slug,
    status,
  },
  required: ["title", "content", "slug", "status"], // Ensure these are the fields you want to be required
};

// Schema for defining a new CMS page
export const pageStoreSchema = {
  description: `Page created or updated successfully`,
  content: {
    "application/json": {
      schema: {
        type: "object",
        properties: basePageSchema,
      },
    },
  },
};
