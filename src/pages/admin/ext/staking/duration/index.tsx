"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/staking/duration";
const columnConfig: ColumnConfigType[] = [
  {
    field: "pool.name",
    label: "Pool",
    sublabel: "pool.id",
    type: "text",
    sortable: true,
    sortName: "pool.name",
    getValue: (row) => row.pool?.name,
    getSubValue: (row) => row.pool?.id,
    hasImage: true,
    imageKey: "pool.icon",
    placeholder: "/img/placeholder.svg",
    className: "rounded-full",
  },
  {
    field: "duration",
    label: "Duration (days)",
    type: "number",
    sortable: true,
  },
  {
    field: "interestRate",
    label: "ROI (%)",
    type: "number",
    sortable: true,
  },
];
const StakingDurations = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Staking Durations")} color="muted">
      <DataTable
        title={t("Staking Durations")}
        endpoint={api}
        columnConfig={columnConfig}
        canView={false}
      />
    </Layout>
  );
};
export default StakingDurations;
export const permission = "Access Staking Duration Management";
