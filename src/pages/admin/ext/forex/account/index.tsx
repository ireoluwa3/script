"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/forex/account";
const columnConfig: ColumnConfigType[] = [
  {
    field: "accountId",
    label: "Account",
    sublabel: "broker",
    type: "text",
    sortable: true,
  },
  {
    field: "mt",
    label: "MT",
    type: "select",
    sortable: true,
    options: [
      { value: 4, label: "MT4" },
      { value: 5, label: "MT5" },
    ],
  },
  {
    field: "balance",
    label: "Balance",
    type: "number",
    sortable: true,
  },
  {
    field: "leverage",
    label: "Leverage",
    type: "number",
    sortable: true,
  },
  {
    field: "type",
    label: "Type",
    type: "select",
    sortable: true,
    options: [
      { value: "DEMO", label: "Demo" },
      { value: "LIVE", label: "Live" },
    ],
  },
  {
    field: "status",
    label: "Status",
    type: "switch",
    sortable: false,
    api: `${api}/:id/status`,
  },
];
const ForexAccounts = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Forex Accounts")} color="muted">
      <DataTable
        title={t("Forex Accounts")}
        endpoint={api}
        columnConfig={columnConfig}
        hasAnalytics
      />
    </Layout>
  );
};
export default ForexAccounts;
export const permission = "Access Forex Account Management";
