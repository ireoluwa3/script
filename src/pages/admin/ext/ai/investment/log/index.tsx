"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/ai/investment/log";
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
    field: "market",
    label: "Market",
    type: "text",
    sortable: true,
    sortName: "market",
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
    field: "status",
    label: "Status",
    type: "select",
    sortable: true,
    options: [
      { value: "ACTIVE", label: "Active", color: "success" },
      { value: "COMPLETED", label: "Completed", color: "info" },
      { value: "CANCELLED", label: "Cancelled", color: "warning" },
      { value: "REJECTED", label: "Rejected", color: "danger" },
    ],
  },
  {
    field: "result",
    label: "Result",
    type: "select",
    options: [
      { value: "WIN", label: "Win", color: "success" },
      { value: "LOSS", label: "Loss", color: "danger" },
      { value: "DRAW", label: "Draw", color: "muted" },
    ],
    sortable: true,
  },
];
const AIInvestments = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("AI Investments")} color="muted">
      <DataTable
        title={t("AI Investments")}
        endpoint={api}
        columnConfig={columnConfig}
        canCreate={false}
        hasAnalytics
      />
    </Layout>
  );
};
export default AIInvestments;
export const permission = "Access AI Investment Management";
