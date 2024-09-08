// /server/api/admin/deposit/gateways/[id]/update.put.ts

import { updateRecord, updateRecordResponses } from "@b/utils/query";
import { gatewayUpdateSchema } from "../utils";

export const metadata = {
  summary: "Updates a specific deposit gateway",
  operationId: "updateDepositGateway",
  tags: ["Admin", "Deposit Gateways"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      description: "ID of the deposit gateway to update",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  requestBody: {
    description: "New data for the deposit gateway",
    content: {
      "application/json": {
        schema: gatewayUpdateSchema,
      },
    },
  },
  responses: updateRecordResponses("Deposit Gateway"),
  requiresAuth: true,
  permission: "Access Deposit Gateway Management",
};

export default async (data: Handler) => {
  const { body, params } = data;
  const { id } = params;
  const {
    name,
    title,
    description,
    image,
    fixedFee,
    percentageFee,
    minAmount,
    maxAmount,
    status,
  } = body;

  return await updateRecord("depositGateway", id, {
    name,
    title,
    description,
    image,
    fixedFee,
    percentageFee,
    minAmount,
    maxAmount,
    status,
  });
};
