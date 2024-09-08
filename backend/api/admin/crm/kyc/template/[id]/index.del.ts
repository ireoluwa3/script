import {
  deleteRecordParams,
  deleteRecordResponses,
  handleSingleDelete,
} from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Deletes a KYC template",
  operationId: "deleteKycTemplate",
  tags: ["Admin", "CRM", "KYC Template"],
  parameters: deleteRecordParams("KYC template"),
  responses: deleteRecordResponses("KYC Template"),
  permission: "Access KYC Template Management",
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { params, query } = data;
  return handleSingleDelete({
    model: "kycTemplate",
    id: params.id,
    query,
  });
};
