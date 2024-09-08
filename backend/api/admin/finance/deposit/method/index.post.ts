// /api/admin/deposit/methods/store.post.ts

import { storeRecord, storeRecordResponses } from "@b/utils/query";
import { DepositMethodSchema, depositMethodUpdateSchema } from "./utils";

export const metadata = {
  summary: "Stores a new deposit method",
  operationId: "storeDepositMethod",
  tags: ["Admin", "Deposit Methods"],
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: depositMethodUpdateSchema,
      },
    },
  },
  responses: storeRecordResponses(DepositMethodSchema, "Deposit Method"),
  requiresAuth: true,
  permission: "Access Deposit Method Management",
};

export default async (data: Handler) => {
  const { body } = data;
  const {
    title,
    instructions,
    image,
    fixedFee,
    percentageFee,
    minAmount,
    maxAmount,
    customFields,
    status,
  } = body;

  // Ensure customFields is an array
  let parsedCustomFields = Array.isArray(customFields) ? customFields : [];
  if (typeof customFields === "string") {
    try {
      const parsed = JSON.parse(customFields);
      parsedCustomFields = Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      throw new Error("Invalid JSON format for customFields");
    }
  }

  return await storeRecord({
    model: "depositMethod",
    data: {
      title,
      instructions,
      image,
      fixedFee,
      percentageFee,
      minAmount,
      maxAmount,
      customFields: parsedCustomFields,
      status,
    },
  });
};
