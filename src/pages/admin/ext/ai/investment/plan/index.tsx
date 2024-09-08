"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/ai/investment/plan";
const columnConfig: ColumnConfigType[] = [
  {
    field: "title",
    label: "Title",
    type: "text",
    sortable: true,
    hasImage: true,
    imageKey: "image",
    placeholder: "/img/avatars/placeholder.webp",
  },
  {
    field: "invested",
    label: "Invested",
    type: "number",
    sortable: true,
  },
  {
    field: "profitPercentage",
    label: "% Profit",
    type: "number",
    sortable: true,
  },
  {
    field: "minAmount",
    label: "Min Amount",
    type: "number",
    sortable: true,
  },
  {
    field: "status",
    label: "Status",
    type: "switch",
    sortable: true,
    api: `${api}/:id/status`,
  },
];
const InvestmentPlans = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("AI Investment Plans")} color="muted">
      <DataTable
        title={t("AI Investment Plans")}
        endpoint={api}
        columnConfig={columnConfig}
      />
    </Layout>
  );
};
export default InvestmentPlans;
export const permission = "Access AI Investment Plan Management";
