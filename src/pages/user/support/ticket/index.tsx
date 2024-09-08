import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/user/support/ticket";
const columnConfig: ColumnConfigType[] = [
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
    <Layout title={t("Support Tickets")} color="muted">
      <DataTable
        title={t("Support Tickets")}
        endpoint={api}
        columnConfig={columnConfig}
        hasStructure={true}
        canCreate={true}
        canDelete={false}
        canEdit={false}
        isParanoid={false}
        viewPath="/user/support/ticket/[id]"
      />
    </Layout>
  );
};
export default SupportTickets;
