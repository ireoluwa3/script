import { models } from "@b/db";
import { handleClientMessage } from "@b/handler/Websocket";

export const metadata = {};

export default async (data: Handler, message) => {
  if (typeof message === "string") {
    message = JSON.parse(message);
  }

  const { user } = data;
  if (!user?.id) {
    return;
  }

  const { type, payload } = message;

  const notifications = await models.notification.findAll({
    where: { userId: user.id },
    order: [["createdAt", "DESC"]],
  });

  await handleClientMessage({
    type: "notifications",
    method: "create",
    clientId: user.id,
    data: notifications.map((n) => n.get({ plain: true })),
  });

  const announcements = await models.announcement.findAll({
    where: { status: true },
    order: [["createdAt", "DESC"]],
  });

  await handleClientMessage({
    type: "announcements",
    method: "create",
    clientId: user.id,
    data: announcements.map((a) => a.get({ plain: true })),
  });
};
