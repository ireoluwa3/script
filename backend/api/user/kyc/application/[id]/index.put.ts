import { models } from "@b/db";
import { createError } from "@b/utils/error";
import { updateRecordResponses } from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Updates KYC data for a given ID",
  description:
    "This endpoint allows for the updating of Know Your Customer (KYC) data associated with a specific record. It requires authentication and appropriate permissions to perform the update.",
  operationId: "updateKYCData",
  tags: ["KYC"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      description: "The ID of the KYC record to update",
      required: true,
      schema: { type: "string" },
    },
  ],
  requestBody: {
    description: "Data to update the KYC record with",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            fields: {
              type: "object",
              description: "Detailed data following the KYC template structure",
            },
            level: {
              type: "number",
              description:
                "Verification level intended with this KYC submission",
            },
          },
          required: ["fields", "level"],
        },
      },
    },
  },
  responses: updateRecordResponses("KYC"),
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { user, params, body } = data;

  if (!user?.id) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const { id } = params;
  const { fields, level } = body;

  // Check if the KYC record exists
  const kycRecord = await models.kyc.findByPk(id);
  if (!kycRecord) {
    throw createError({ statusCode: 404, message: "KYC record not found" });
  }

  // Check if the user is authorized to update this KYC record
  if (kycRecord.userId !== user.id) {
    throw createError({ statusCode: 403, message: "Forbidden" });
  }

  return updateKyc(id, fields, level);
};

export async function updateKyc(
  id: string,
  fields: any,
  level: number
): Promise<Kyc> {
  const kycRecord = await models.kyc.findByPk(id);
  if (!kycRecord) {
    throw new Error("KYC record not found");
  }

  // Merge the existing KYC data with the new fields
  const kycData = JSON.parse(kycRecord.data || "{}");
  const updatedData = {
    ...kycData,
    ...fields,
    level, // Update the level if provided
  };

  await models.kyc.update(
    { data: updatedData, level: level },
    {
      where: { id },
    }
  );

  const updatedKyc = await models.kyc.findByPk(id);

  if (!updatedKyc) {
    throw new Error("KYC record not found");
  }

  return updatedKyc.get({ plain: true }) as unknown as Kyc;
}
