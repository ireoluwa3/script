import {
  deleteRecordParams,
  deleteRecordResponses,
  handleSingleDelete,
} from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Deletes a KYC application",
  operationId: "deleteKycApplication",
  tags: ["Admin", "CRM", "KYC"],
  parameters: deleteRecordParams("KYC application"),
  responses: deleteRecordResponses("KYC application"),
  permission: "Access KYC Application Management",
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { params, query } = data;
  return handleSingleDelete({
    model: "kyc",
    id: params.id,
    query,
  });
};
