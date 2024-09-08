"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/crm/support/ticket";
const columnConfig: ColumnConfigType[] = [
  {
    field: "user",
    label: "User",
    sublabel: "user.email",
    type: "text",
    getValue: (item) => `${item.user?.firstName} ${item.user?.lastName}`,
    getSubValue: (item) => item.user?.email,
    path: "/admin/crm/user?email=[user.email]",
    sortable: true,
    sortName: "user.firstName",
    hasImage: true,
    imageKey: "user.avatar",
    placeholder: "/img/avatars/placeholder.webp",
    className: "rounded-full",
  },
  {
    field: "subject",
    label: "Subject",
    type: "text",
    sortable: true,
  },
  {
    field: "importance",
    label: "Importance",
    type: "select",
    options: [
      {
        value: "LOW",
        label: "Low",
        color: "muted",
      },
      {
        value: "MEDIUM",
        label: "Medium",
        color: "warning",
      },
      {
        value: "HIGH",
        label: "High",
        color: "danger",
      },
    ],
    sortable: true,
  },
  {
    field: "status",
    label: "Status",
    type: "select",
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
    sortable: true,
  },
];
const SupportTickets = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Support Tickets Management")} color="muted">
      <DataTable
        title={t("Support Tickets")}
        endpoint={api}
        columnConfig={columnConfig}
        canCreate={false}
        hasAnalytics
        viewPath="/admin/crm/support/ticket/[id]"
      />
    </Layout>
  );
};
export default SupportTickets;
export const permission = "Access Support Ticket Management";
