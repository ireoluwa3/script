"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/finance/order/exchange";
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
    field: "symbol",
    label: "Symbol",
    type: "text",
    sortable: true,
  },
  {
    field: "type",
    label: "Type",
    type: "select",
    sortable: true,
    options: [
      { value: "LIMIT", label: "Limit" },
      { value: "MARKET", label: "Market" },
    ],
    placeholder: "Select type",
  },
  {
    field: "side",
    label: "Side",
    type: "select",
    sortable: true,
    options: [
      { value: "BUY", label: "Buy" },
      { value: "SELL", label: "Sell" },
    ],
    placeholder: "Select Side",
  },
  {
    field: "price",
    label: "Price",
    type: "number",
    sortable: true,
  },
  {
    field: "amount",
    label: "Amount",
    type: "number",
    sortable: true,
  },
  {
    field: "fee",
    label: "Fee",
    type: "number",
    sortable: true,
    getValue: (item) => `${item.fee} ${item.feeCurrency}`,
  },
  {
    field: "status",
    label: "Status",
    type: "select",
    sortable: true,
    api: `${api}/:id/status`,
    options: [
      { value: "OPEN", label: "Open" },
      { value: "CLOSED", label: "Closed" },
      { value: "CANCELLED", label: "Cancelled" },
    ],
    placeholder: "Select status",
  },
];
const ExchangeOrders = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Exchange Orders Management")} color="muted">
      <DataTable
        title={t("Exchange Orders")}
        endpoint={api}
        columnConfig={columnConfig}
        canCreate={false}
        hasAnalytics
      />
    </Layout>
  );
};
export default ExchangeOrders;
export const permission = "Access Exchange Order Management";
