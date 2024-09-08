// /api/admin/kyc/templates/structure.get.ts
import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for KYC templates",
  operationId: "getKYCTemplatesStructure",
  tags: ["Admin", "CRM", "KYC Template"],
  responses: {
    200: {
      description: "Form structure for KYC templates",
      content: structureSchema,
    },
  },
  permission: "Access KYC Template Management",
};

export const templateStructure = () => {
  const title = {
    type: "input",
    label: "Title",
    name: "title",
    placeholder: "Enter title",
  };
  const options = {
    type: "json",
    label: "Options",
    name: "options",
    placeholder: "Enter options",
  };
  const status = {
    type: "select",
    label: "Status",
    name: "status",
    placeholder: "Enter status",
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
    ts: "boolean",
  };

  return {
    title,
    options,
    status,
  };
};

export default async (): Promise<object> => {
  const { title, options, status } = templateStructure();

  return {
    get: {
      TemplateInfo: [title, options, status],
    },
    set: [title, options, status],
  };
};
