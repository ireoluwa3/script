// /server/api/settings/index.get.ts

import { models } from "@b/db";
import { RedisSingleton } from "@b/utils/redis";
import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";

export const metadata: OperationObject = {
  summary: "Retrieves the application settings",
  description: "This endpoint retrieves the application settings.",
  operationId: "getSettings",
  tags: ["Settings"],
  requiresAuth: false,
  responses: {
    200: {
      description: "Application settings retrieved successfully",
      content: {
        "application/json": {
          schema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                key: {
                  type: "string",
                  description: "Setting key",
                },
                value: {
                  type: "string",
                  description: "Setting value",
                },
              },
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Settings"),
    500: serverErrorResponse,
  },
};
const redis = RedisSingleton.getInstance();

export default async () => {
  const settings = await getSettings();
  const extensions = await getExtensionsQuery();

  return {
    settings,
    extensions: extensions.map((extension) => extension.name),
  };
};

interface PartialSettings {
  key: string;
  value: string | null;
}
export async function getSettings(): Promise<PartialSettings[]> {
  return (
    await models.settings.findAll({
      attributes: ["key", "value"],
    })
  ).map((setting) => setting.get({ plain: true }));
}

export async function getExtensionsQuery(): Promise<Extension[]> {
  return (
    await models.extension.findAll({
      where: { status: true },
      attributes: ["name"],
    })
  ).map((extension) => extension.get({ plain: true })) as Extension[];
}
