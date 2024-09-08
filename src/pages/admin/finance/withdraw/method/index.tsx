"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/finance/withdraw/method";
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
    field: "processingTime",
    label: "Duration",
    type: "text",
    sortable: true,
  },
  {
    field: "fixedFee",
    label: "Fixed Fee",
    type: "number",
    sortable: true,
  },
  {
    field: "percentageFee",
    label: "% Fee",
    type: "number",
    sortable: true,
  },
  {
    field: "minAmount",
    label: "Min",
    type: "number",
    sortable: true,
  },
  {
    field: "status",
    label: "Status",
    type: "switch",
    sortable: false,
    api: `${api}/:id/status`,
  },
];
const WithdrawalMethods = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Withdrawal Methods Management")} color="muted">
      <DataTable
        title={t("Withdrawal Methods")}
        endpoint={api}
        columnConfig={columnConfig}
      />
    </Layout>
  );
};
export default WithdrawalMethods;
export const permission = "Access Withdrawal Method Management";
