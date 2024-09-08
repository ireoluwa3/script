"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { formatDate } from "date-fns";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/forex/investment";
const columnConfig: ColumnConfigType[] = [
  {
    field: "user",
    label: "User",
    sublabel: "user.email",
    type: "text",
    getValue: (item) => `${item.user?.firstName} ${item.user?.lastName}`,
    getSubValue: (item) => item.user?.email,
    path: "/admin/crm/user?email=[user.email]",
    sortable: true,
    sortName: "user.firstName",
    hasImage: true,
    imageKey: "user.avatar",
    placeholder: "/img/avatars/placeholder.webp",
    className: "rounded-full",
  },
  {
    field: "amount",
    label: "Amount",
    type: "number",
    sortable: true,
  },
  {
    field: "profit",
    label: "Profit",
    type: "number",
    sortable: true,
  },
  {
    field: "result",
    label: "Result",
    type: "select",
    options: [
      { value: "WIN", label: "Win" },
      { value: "LOSS", label: "Loss" },
      { value: "DRAW", label: "Draw" },
    ],
    sortable: true,
  },
  {
    field: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "ACTIVE", label: "Active", color: "primary" },
      { value: "COMPLETED", label: "Completed", color: "success" },
      { value: "CANCELLED", label: "Cancelled", color: "danger" },
      { value: "REJECTED", label: "Rejected", color: "warning" },
    ],
    sortable: true,
  },
  {
    field: "endDate",
    label: "End Date",
    type: "date",
    sortable: true,
    filterable: false,
    getValue: (item) =>
      item.endDate
        ? formatDate(new Date(item.endDate), "yyyy-MM-dd HH:mm")
        : "N/A",
  },
];
const ForexInvestments = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Forex Investments")} color="muted">
      <DataTable
        title={t("Forex Investments")}
        endpoint={api}
        columnConfig={columnConfig}
        canCreate={false}
        hasAnalytics
      />
    </Layout>
  );
};
export default ForexInvestments;
export const permission = "Access Forex Investment Management";
