// /api/admin/notifications/structure.get.ts

import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for Notifications",
  operationId: "getNotificationsStructure",
  tags: ["Notifications"],
  responses: {
    200: {
      description: "Form structure for Notifications",
      content: structureSchema,
    },
  },
};

export const notificationStructure = () => {
  const type = {
    type: "select",
    label: "Notification Type",
    name: "type",
    options: [
      { value: "INFO", label: "Information" },
      { value: "WARNING", label: "Warning" },
      { value: "ALERT", label: "Alert" },
    ],
  };

  const title = {
    type: "input",
    label: "Title",
    name: "title",
    placeholder: "Enter the notification title",
  };

  const message = {
    type: "textarea",
    label: "Message",
    name: "message",
    placeholder: "Enter the notification message",
  };

  const link = {
    type: "input",
    label: "Link",
    name: "link",
    placeholder: "Enter a link associated with the notification",
  };

  const status = {
    type: "select",
    label: "Status",
    name: "status",
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
    ts: "boolean",
  };

  return {
    type,
    title,
    message,
    link,
    status,
  };
};

export default async (): Promise<object> => {
  const { type, title, message, link, status } = notificationStructure();

  return {
    get: [type, title, message, link, status],
    set: [type, title, message, link, status],
  };
};
