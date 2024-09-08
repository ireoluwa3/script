// /api/admin/authors/structure.get.ts

import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for Authors",
  operationId: "getAuthorStructure",
  tags: ["Admin", "Content", "Author"],
  responses: {
    200: {
      description: "Form structure for managing Authors",
      content: structureSchema,
    },
  },
};

export const authorStructure = async () => {
  const status = {
    type: "select",
    label: "Status",
    name: "status",
    options: [
      { value: "PENDING", label: "Pending" },
      { value: "APPROVED", label: "Approved" },
      { value: "REJECTED", label: "Rejected" },
    ],
    placeholder: "Access Author Management",
  };

  return {
    status,
  };
};

export default async (): Promise<object> => {
  const { status } = await authorStructure();
  return {
    set: [status],
  };
};
