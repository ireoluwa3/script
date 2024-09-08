import { baseDateTimeSchema, baseStringSchema } from "@b/utils/schema";

// Existing fields
const id = baseStringSchema("ID of the API key");
const userId = baseStringSchema("User ID associated with the API key");
const key = baseStringSchema("The API key string");
const createdAt = baseDateTimeSchema("Creation date of the API key");
const updatedAt = baseDateTimeSchema("Last update date of the API key", true);
const deletedAt = baseDateTimeSchema("Deletion date of the API key", true);

// New fields
const name = baseStringSchema("Name of the API key");
const permissions = {
  type: "array",
  items: { type: "string" },
  description: "Permissions associated with the API key",
};
const ipWhitelist = {
  type: "array",
  items: { type: "string" },
  description: "IP addresses whitelisted for the API key",
};

// Updated schema
export const apiKeySchema = {
  id: id,
  userId: userId,
  name: name, // Added name field
  key: key,
  permissions: permissions, // Added permissions field
  ipWhitelist: ipWhitelist, // Added ipWhitelist field
  createdAt: createdAt,
  updatedAt: updatedAt,
  deletedAt: deletedAt,
};

// Updated schema for API key updates
export const apiKeyUpdateSchema = {
  type: "object",
  properties: {
    key: key,
    name: name, // Include name in updates if necessary
    permissions: permissions, // Include permissions in updates if necessary
    ipWhitelist: ipWhitelist, // Include ipWhitelist in updates if necessary
  },
  required: ["key"], // Key is required, add other fields as required if needed
};
