import { structureSchema } from "@b/utils/constants";

// Define the form structure for editing currency information
export const metadata = {
  summary: "Get form structure for currency editing",
  operationId: "getFormStructureForCurrencyEditing",
  tags: ["Admin", "Currencies"],
  responses: {
    200: {
      description: "Form structure for editing currency information",
      content: structureSchema,
    },
  },
  permission: "Access Fiat Currency Management"
};

const priceStructure = {
  type: "input",
  label: "Price",
  name: "price",
  inputType: "number",
  placeholder: "e.g., 1.00",
  ts: "number",
};

export default async () => {
  return {
    set: [priceStructure],
  };
};
