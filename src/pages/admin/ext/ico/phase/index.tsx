"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { formatDate } from "date-fns";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/ico/phase";
const columnConfig: ColumnConfigType[] = [
  {
    field: "token.currency",
    label: "Token",
    sublabel: "token.chain",
    type: "text",
    sortable: true,
    sortName: "token.currency",
    hasImage: true,
    imageKey: "token.image",
    placeholder: "/img/placeholder.svg",
    className: "rounded-full",
    getValue: (row) => row.token?.currency,
    getSubValue: (row) => row.token?.chain,
  },
  {
    field: "name",
    label: "Name",
    type: "text",
    sortable: true,
  },
  {
    field: "price",
    label: "Price",
    type: "number",
    sortable: true,
  },
  {
    field: "minPurchase",
    label: "Limit",
    sublabel: "maxPurchase",
    type: "number",
    sortable: true,
  },
  {
    field: "startDate",
    label: "Date",
    sublabel: "endDate",
    type: "date",
    sortable: true,
    filterable: false,
    getValue: (row) =>
      row.startDate && formatDate(new Date(row.startDate), "dd/MM/yyyy"),
    getSubValue: (row) =>
      row.endDate && formatDate(new Date(row.endDate), "dd/MM/yyyy"),
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
const ICOPhases = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("ICO Phases")} color="muted">
      <DataTable
        title={t("ICO Phases")}
        endpoint={api}
        columnConfig={columnConfig}
      />
    </Layout>
  );
};
export default ICOPhases;
export const permission = "Access ICO Phase Management";
