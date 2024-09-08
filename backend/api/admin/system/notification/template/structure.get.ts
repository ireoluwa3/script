// /api/admin/notifications/structure.get.ts
import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for email notification templates",
  operationId: "getNotificationTemplatesStructure",
  tags: ["Admin", "Notifications"],
  responses: {
    200: {
      description: "Form structure for email notification templates",
      content: structureSchema,
    },
  },
  permission: "Access Notification Template Management"
};

export const templateStructure = () => {
  const name = {
    type: "input",
    label: "Name",
    name: "name",
    placeholder: "Enter template name",
  };
  const subject = {
    type: "input",
    label: "Subject",
    name: "subject",
    placeholder: "Enter email subject",
  };
  const emailBody = {
    type: "textarea",
    label: "Email Body",
    name: "emailBody",
    placeholder: "Enter email body",
  };
  const smsBody = {
    type: "textarea",
    label: "SMS Body",
    name: "smsBody",
    placeholder: "Enter SMS body",
  };
  const pushBody = {
    type: "textarea",
    label: "Push Body",
    name: "pushBody",
    placeholder: "Enter push body",
  };
  const shortCodes = {
    type: "json",
    label: "Short Codes",
    name: "shortCodes",
  };
  const email = {
    type: "select",
    label: "Email Template",
    name: "email",
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
    ts: "boolean",
  };
  const sms = {
    type: "select",
    label: "SMS Template",
    name: "sms",
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
    ts: "boolean",
  };
  const push = {
    type: "select",
    label: "Push Template",
    name: "push",
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
    ts: "boolean",
  };

  return {
    name,
    subject,
    emailBody,
    smsBody,
    pushBody,
    shortCodes,
    email,
    sms,
    push,
  };
};

export default async (): Promise<object> => {
  const {
    name,
    subject,
    emailBody,
    smsBody,
    pushBody,
    shortCodes,
    email,
    sms,
    push,
  } = templateStructure();

  return {
    get: {
      TemplateInfo: [
        name,
        subject,
        emailBody,
        smsBody,
        pushBody,
        shortCodes,
        email,
        sms,
        push,
      ],
    },
    set: [subject, emailBody, smsBody, pushBody, email, sms, push],
  };
};
