// /api/admin/support-tickets/structure.get.ts
import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for support tickets",
  operationId: "getSupportTicketsStructure",
  tags: ["Support Tickets"],
  responses: {
    200: {
      description: "Form structure for support tickets",
      content: structureSchema,
    },
  },
};

export const supportTicketStructure = () => {
  const userId = {
    type: "input",
    label: "User",
    name: "userId",
    placeholder: "Enter the user ID",
    icon: "lets-icons:user-duotone",
  };
  const chatId = { type: "input", label: "Chat ID", name: "chatId" };
  const subject = { type: "input", label: "Subject", name: "subject" };
  const message = { type: "textarea", label: "Message", name: "message" };
  const importance = {
    type: "select",
    label: "Importance",
    name: "importance",
    options: [
      {
        value: "LOW",
        label: "Low",
      },
      {
        value: "MEDIUM",
        label: "Medium",
      },
      {
        value: "HIGH",
        label: "High",
      },
    ],
  };
  const status = {
    type: "select",
    label: "Status",
    name: "status",
    options: [
      {
        value: "PENDING",
        label: "Pending",
        color: "warning",
      },
      {
        value: "OPEN",
        label: "Open",
        color: "info",
      },
      {
        value: "REPLIED",
        label: "Replied",
        color: "primary",
      },
      {
        value: "CLOSED",
        label: "Closed",
        color: "success",
      },
    ],
  };
  const createdAt = { type: "input", label: "Created At", name: "createdAt" };
  const user = { type: "input", label: "User", name: "user" };
  const chat = { type: "input", label: "Chat", name: "chat" };

  return {
    userId,
    chatId,
    subject,
    message,
    importance,
    status,
    createdAt,
    user,
    chat,
  };
};

export default async (): Promise<object> => {
  const { subject, message, importance } = supportTicketStructure();

  return {
    set: [[subject, importance], message],
  };
};
