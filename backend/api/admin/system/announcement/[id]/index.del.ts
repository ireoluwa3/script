// /server/api/announcement/index.del.ts

import { handleRouteClientsMessage } from "@b/handler/Websocket";
import {
  deleteRecordParams,
  deleteRecordResponses,
  handleSingleDelete,
} from "@b/utils/query";

export const metadata = {
  summary: "Deletes an announcement",
  operationId: "deleteAnnouncement",
  tags: ["Admin", "Announcements"],
  parameters: deleteRecordParams("announcement"),
  responses: deleteRecordResponses("Announcement"),
  permission: "Access Announcement Management",
  requiresAuth: true,
};

export default async (data: Handler) => {
  const { params, query } = data;
  const { id } = params;

  const message = handleSingleDelete({
    model: "announcement",
    id,
    query,
  });

  handleRouteClientsMessage({
    type: "announcements",
    method: "delete",
    id,
  });

  return message;
};
