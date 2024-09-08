import { sendKycEmail } from "@b/utils/emails";
import { models } from "@b/db";
import { createError } from "@b/utils/error";
import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Submits KYC data for the user",
  description:
    "Submits Know Your Customer (KYC) data for the currently authenticated user based on a specific KYC template and level of verification required. This submission will initiate or update the user’s KYC verification process.",
  operationId: "submitUserKycData",
  tags: ["KYC"],
  requestBody: {
    description: "KYC data submission details",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            templateId: {
              type: "string",
              description: "ID of the KYC template to be used for submission",
            },
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
          required: ["templateId", "fields", "level"],
        },
      },
    },
    required: true,
  },
  responses: {
    200: {
      description: "KYC data submitted successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: {
                type: "string",
                description:
                  "Confirmation message indicating successful submission of KYC data",
              },
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Kyc"),
    500: serverErrorResponse,
  },
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { user, body } = data;
  if (!user?.id)
    throw createError({ statusCode: 401, message: "Unauthorized" });
  const { templateId, fields, level } = body;
  return createKyc(user.id, templateId, fields, level);
};

export async function createKyc(
  userId: string,
  templateId: string,
  templateData: any,
  level: number
): Promise<any> {
  const user = (await models.user.findOne({
    where: {
      id: userId,
    },
  })) as unknown as User;
  if (!user) {
    throw new Error("User not found");
  }

  const template = await models.kycTemplate.findOne({
    where: {
      id: templateId,
    },
  });

  if (!template) {
    throw new Error("KYC template not found");
  }

  const existingKyc = await models.kyc.findOne({
    where: {
      userId: user.id,
      templateId: template.id,
    },
  });

  // Scenario 1: No existing KYC
  if (!existingKyc) {
    const newKyc = await models.kyc.create({
      userId: user.id,
      templateId: template.id,
      data: JSON.stringify(templateData),
      level: level,
      status: "PENDING",
    });
    await sendKycEmail(user, newKyc, "KycSubmission");
    return newKyc as unknown as Kyc;
  }

  // Scenario 2: Existing KYC with same or higher level and not REJECTED
  if (existingKyc.level >= level && existingKyc.status !== "REJECTED") {
    throw new Error(
      "You have already submitted a KYC application at this level or higher. Please wait for it to be reviewed."
    );
  }

  // Scenario 3: Existing KYC with status REJECTED but level not matching the parameter
  if (existingKyc.status === "REJECTED" && existingKyc.level !== level) {
    throw new Error(
      "Your existing KYC application was rejected. You can only resubmit at the same level."
    );
  }

  // Scenario 4: Existing KYC with lower level but not APPROVED and not REJECTED
  if (existingKyc.status === "PENDING") {
    throw new Error(
      "Your existing KYC application is still under review. Please wait for it to be approved before submitting a new one."
    );
  }

  // Scenario 5: Existing KYC with lower level and APPROVED
  const existingKycData = existingKyc.data as any; // Type cast to any
  const mergedData = deepMerge(existingKycData, templateData);

  // Update existing KYC record
  await models.kyc.update(
    {
      data: JSON.stringify(mergedData),
      level: level,
      status: "PENDING",
    },
    {
      where: {
        id: existingKyc.id,
      },
    }
  );

  const updatedKyc = await models.kyc.findOne({
    where: {
      id: existingKyc.id,
    },
  });

  if (!updatedKyc) {
    throw new Error("KYC record not found");
  }

  // Send update email
  await sendKycEmail(user, updatedKyc, "KycUpdate");

  return {
    message: "KYC data submitted successfully",
  };
}

function deepMerge(obj1: any, obj2: any): any {
  if (obj1 === null) return obj2;
  if (obj2 === null) return obj1;

  if (typeof obj1 !== "object") return obj2;
  if (typeof obj2 !== "object") return obj2;

  const output = { ...obj1 };
  Object.keys(obj2).forEach((key) => {
    if (obj2[key] === null) {
      output[key] = null;
    } else if (Array.isArray(obj2[key])) {
      output[key] = obj2[key];
    } else if (typeof obj2[key] === "object") {
      output[key] = deepMerge(obj1[key], obj2[key]);
    } else {
      output[key] = obj2[key];
    }
  });

  return output;
}
