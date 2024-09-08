"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/ai/investment/duration";
const columnConfig: ColumnConfigType[] = [
  {
    field: "duration",
    label: "Duration",
    type: "number",
    sortable: true,
    getValue: (item) => `${item.duration} ${item.timeframe?.toLowerCase()}`,
  },
  {
    field: "timeframe",
    label: "Timeframe",
    type: "text",
    sortable: true,
  },
];
const AIDurations = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("AI Investment Durations")} color="muted">
      <DataTable
        title={t("AI Investment Durations")}
        endpoint={api}
        columnConfig={columnConfig}
        isParanoid={false}
      />
    </Layout>
  );
};
export default AIDurations;
export const permission = "Access AI Investment Duration Management";
