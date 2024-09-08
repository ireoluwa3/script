"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/forex/duration";
const columnConfig: ColumnConfigType[] = [
  {
    field: "duration",
    label: "Duration",
    type: "number",
    sortable: true,
  },
  {
    field: "timeframe",
    label: "Timeframe",
    type: "select",
    sortable: true,
    options: [
      { value: "HOUR", label: "Hour", color: "primary" },
      { value: "DAY", label: "Day", color: "info" },
      { value: "WEEK", label: "Week", color: "success" },
      { value: "MONTH", label: "Month", color: "warning" },
    ],
  },
];
const ForexDurations = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Forex Durations")} color="muted">
      <DataTable
        title={t("Forex Durations")}
        endpoint={api}
        columnConfig={columnConfig}
        isParanoid={false}
        canView={false}
      />
    </Layout>
  );
};
export default ForexDurations;
export const permission = "Access Forex Duration Management";
