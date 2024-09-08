"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { statusOptions, transactionTypeOptions } from "@/utils/constants";
import { useTranslation } from "next-i18next";
const api = "/api/admin/finance/transaction";
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
    field: "type",
    label: "Type",
    type: "select",
    options: transactionTypeOptions,
    sortable: true,
  },
  {
    field: "amount",
    label: "Amount",
    type: "number",
    precision: 8,
    sortable: true,
  },
  {
    field: "fee",
    label: "Fee",
    type: "number",
    precision: 8,
    sortable: true,
  },
  {
    field: "status",
    label: "Status",
    type: "select",
    options: statusOptions,
    sortable: true,
  },
  // created at
  {
    field: "createdAt",
    label: "Date",
    type: "date",
    sortable: true,
    filterable: false,
    getValue: (item) =>
      item.createdAt ? new Date(item.createdAt).toLocaleString() : "N/A",
  },
];
const WalletTransactions = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Transactions Management")} color="muted">
      <DataTable
        title={t("Transactions")}
        endpoint={api}
        columnConfig={columnConfig}
        canCreate={false}
        hasAnalytics
      />
    </Layout>
  );
};
export default WalletTransactions;
export const permission = "Access Transaction Management";
