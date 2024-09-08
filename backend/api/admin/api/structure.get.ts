// /api/admin/apiKeys/structure.get.ts

import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for API Keys",
  operationId: "getAPIKeyStructure",
  tags: ["Admin", "API Keys"],
  responses: {
    200: {
      description: "Form structure for managing API Keys",
      content: structureSchema,
    },
  },
  permission: "Access API Key Management",
};

export const apiKeyStructure = async () => {
  const id = {
    type: "input",
    label: "ID",
    name: "id",
    placeholder: "Automatically generated",
    readOnly: true,
  };

  const userId = {
    type: "input",
    label: "User",
    name: "userId",
    placeholder: "Enter the user ID",
    icon: "lets-icons:user-duotone",
  };

  const key = {
    type: "input",
    label: "API Key",
    name: "key",
    placeholder: "Enter the API key",
    readOnly: true,
  };

  const permissions = {
    type: "multiselect",
    label: "Permissions",
    name: "permissions",
    options: [
      { label: "Trade", value: "trade" },
      { label: "Futures", value: "futures" },
      { label: "Deposit", value: "deposit" },
      { label: "Withdraw", value: "withdraw" },
      { label: "Transfer", value: "transfer" },
    ],
    placeholder: "Select permissions for this API key",
  };

  const ipWhitelist = {
    type: "textarea",
    label: "IP Whitelist",
    name: "ipWhitelist",
    placeholder: "Enter allowed IP addresses, one per line",
  };

  return {
    id,
    userId,
    key,
    permissions,
    ipWhitelist,
  };
};

export default async (): Promise<object> => {
  const { id, userId, key, permissions, ipWhitelist } = await apiKeyStructure();

  return {
    get: [id, userId, key, permissions, ipWhitelist],
    set: [],
  };
};
