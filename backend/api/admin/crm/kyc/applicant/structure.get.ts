// /api/admin/kyc/structure.get.ts
import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for KYC applications",
  operationId: "getKycApplicationStructure",
  tags: ["Admin", "CRM", "KYC"],
  responses: {
    200: {
      description: "Form structure for KYC applications",
      content: structureSchema,
    },
  },
  permission: "Access KYC Application Management",
};

export const kycStructure = () => {
  const userId = {
    type: "input",
    label: "User",
    name: "userId",
    placeholder: "Enter the user ID",
    icon: "lets-icons:user-duotone",
  };

  const templateId = {
    type: "input",
    label: "Template ID",
    name: "templateId",
  };

  const status = {
    type: "select",
    label: "Status",
    name: "status",
    options: [
      { value: "PENDING", label: "Pending" },
      { value: "APPROVED", label: "Approved" },
      { value: "REJECTED", label: "Rejected" },
    ],
    placeholder: "Select status",
    ts: "string",
  };

  const level = {
    type: "input",
    label: "Level",
    name: "level",
    placeholder: "Enter the KYC level",
    ts: "number",
  };

  const notes = {
    type: "textarea",
    label: "Notes",
    name: "notes",
    placeholder: "Enter any notes",
  };

  const data = {
    type: "json",
    label: "Data",
    name: "data",
    placeholder: "{}",
  };

  return {
    userId,
    templateId,
    status,
    level,
    notes,
    data,
  };
};

export default async (): Promise<object> => {
  const { userId, templateId, status, level, notes, data } = kycStructure();

  return {
    get: [userId, templateId, status, level, notes, data],
    set: [status, level, notes, data],
  };
};
