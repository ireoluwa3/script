// /api/admin/kyc/[id]/update.put.ts
import { updateRecordResponses } from "@b/utils/query";
import { kycUpdateSchema } from "../utils";
import { models } from "@b/db";
import { createError } from "@b/utils/error";
import { sendKycEmail } from "@b/utils/emails";

export const metadata: OperationObject = {
  summary: "Updates an existing KYC application",
  operationId: "updateKycApplication",
  tags: ["Admin", "CRM", "KYC"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      description: "ID of the KYC application to update",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  requestBody: {
    required: true,
    description: "Updated data for the KYC application",
    content: {
      "application/json": {
        schema: kycUpdateSchema,
      },
    },
  },
  responses: updateRecordResponses("KYC Application"),
  requiresAuth: true,
  permission: "Access KYC Application Management",
};

export default async (req: Handler) => {
  const { body, params } = req;
  const { id } = params;
  const { status, level, notes } = body;

  const kycApplication = await models.kyc.findByPk(id, {
    include: [
      {
        model: models.user,
        as: "user",
      },
    ],
  });
  if (!kycApplication) throw createError(404, "KYC application not found");

  kycApplication.status = status;
  kycApplication.level = level;
  kycApplication.notes = notes;

  await kycApplication.save();

  let emailType: "KycApproved" | "KycRejected";

  switch (status) {
    case "APPROVED":
      emailType = "KycApproved";
      break;
    case "REJECTED":
      emailType = "KycRejected";
      break;
    default:
      throw new Error(`Unknown status: ${status}`);
  }

  try {
    await sendKycEmail(kycApplication.user, kycApplication, emailType);
  } catch (error) {
    console.error(error);
  }

  return {
    message: "KYC application updated successfully",
  };
};
