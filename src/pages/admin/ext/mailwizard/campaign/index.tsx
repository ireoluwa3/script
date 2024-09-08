"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/mailwizard/campaign";
const columnConfig: ColumnConfigType[] = [
  {
    field: "name",
    label: "Campaign",
    type: "text",
    sortable: true,
  },
  {
    field: "template.name",
    label: "Template",
    type: "text",
    sortable: false,
    getValue: (row) => row.template?.name,
  },
  {
    field: "speed",
    label: "Speed",
    type: "number",
    sortable: true,
  },
  {
    field: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "PENDING", label: "Pending", color: "warning" },
      { value: "PAUSED", label: "Paused", color: "warning" },
      { value: "ACTIVE", label: "Active", color: "success" },
      { value: "STOPPED", label: "Stopped", color: "danger" },
      { value: "COMPLETED", label: "Completed", color: "success" },
      { value: "CANCELLED", label: "Cancelled", color: "danger" },
    ],
    sortable: true,
  },
];
const MailwizardCampaigns = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Mailwizard Campaigns")} color="muted">
      <DataTable
        title={t("Mailwizard Campaigns")}
        endpoint={api}
        columnConfig={columnConfig}
        hasAnalytics
        viewPath="/admin/ext/mailwizard/campaign/[id]"
      />
    </Layout>
  );
};
export default MailwizardCampaigns;
export const permission = "Access Mailwizard Campaign Management";
