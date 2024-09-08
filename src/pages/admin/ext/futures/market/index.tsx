"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/futures/market";
const columnConfig: ColumnConfigType[] = [
  {
    field: "symbol",
    label: "Symbol",
    type: "text",
    sortable: true,
    getValue: (item) =>
      `${item.currency?.toUpperCase()}/${item.pair?.toUpperCase()}`,
  },
  {
    field: "isTrending",
    label: "Trending",
    type: "select",
    sortable: true,
    options: [
      { value: true, label: "Yes", color: "success" },
      { value: false, label: "No", color: "danger" },
    ],
  },
  {
    field: "isHot",
    label: "Hot",
    type: "select",
    sortable: true,
    options: [
      { value: true, label: "Yes", color: "success" },
      { value: false, label: "No", color: "danger" },
    ],
  },
  {
    field: "status",
    label: "Status",
    type: "switch",
    sortable: true,
    api: `${api}/:id/status`,
  },
];
const Markets = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Futures Markets")} color="muted">
      <DataTable
        title={t("Markets")}
        endpoint={api}
        columnConfig={columnConfig}
        isParanoid={false}
        canCreate={true}
      />
    </Layout>
  );
};
export default Markets;
export const permission = "Access Futures Market Management";
