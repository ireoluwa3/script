"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/ico/token";
const columnConfig: ColumnConfigType[] = [
  {
    field: "currency",
    label: "Name",
    sublabel: "chain",
    type: "text",
    sortable: true,
    hasImage: true,
    imageKey: "image",
    placeholder: "/img/placeholder.svg",
    className: "rounded-full",
  },
  // address
  {
    field: "address",
    label: "Address",
    type: "text",
    sortable: true,
  },
  // name
  {
    field: "name",
    label: "Name",
    type: "text",
    sortable: true,
  },
  {
    field: "totalSupply",
    label: "Total Supply",
    type: "number",
    sortable: true,
  },
  {
    field: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "PENDING", label: "Pending", color: "warning" },
      { value: "ACTIVE", label: "Active", color: "success" },
      { value: "COMPLETED", label: "Completed", color: "success" },
      { value: "REJECTED", label: "Rejected", color: "danger" },
      { value: "CANCELLED", label: "Cancelled", color: "danger" },
    ],
    sortable: true,
  },
];
const ICOTokens = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("ICO Tokens")} color="muted">
      <DataTable
        title={t("ICO Tokens")}
        endpoint={api}
        columnConfig={columnConfig}
        hasAnalytics
      />
    </Layout>
  );
};
export default ICOTokens;
export const permission = "Access ICO Token Management";
