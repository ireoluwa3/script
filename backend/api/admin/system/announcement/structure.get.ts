// /server/api/announcement/structure.get.ts

import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for Announcements",
  operationId: "getAnnouncementStructure",
  tags: ["Admin", "Announcements"],
  responses: {
    200: {
      description: "Form structure for managing Announcements",
      content: structureSchema,
    },
  },
  permission: "Access Announcement Management"
};

export const announcementStructure = async () => {
  const type = {
    type: "select",
    label: "Type",
    name: "type",
    options: [
      { value: "GENERAL", label: "General" },
      { value: "EVENT", label: "Event" },
      { value: "UPDATE", label: "Update" },
    ],
    placeholder: "Select the type of announcement",
  };

  const title = {
    type: "input",
    label: "Title",
    name: "title",
    placeholder: "Enter the title of the announcement",
  };

  const message = {
    type: "textarea",
    label: "Message",
    name: "message",
    placeholder: "Enter the message of the announcement",
  };

  const link = {
    type: "input",
    label: "Link",
    name: "link",
    placeholder: "Enter the link of the announcement",
  };

  const status = {
    type: "select",
    label: "Status",
    name: "status",
    placeholder: "Select the status of the announcement",
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

export default async () => {
  const { type, title, message, link, status } = await announcementStructure();

  return {
    get: [type, title, message, link, status],
    set: [[type, title], message, link, status],
  };
};
