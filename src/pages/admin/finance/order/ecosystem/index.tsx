"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
import { formatDate } from "date-fns";
const api = "/api/admin/ext/ecosystem/order";
const columnConfig: ColumnConfigType[] = [
  {
    field: "createdAt",
    label: "Date",
    type: "date",
    sortable: true,
    filterable: false,
    getValue: (row) => formatDate(new Date(row.createdAt), "yyyy-MM-dd HH:mm"),
  },
  {
    field: "symbol",
    label: "Symbol",
    type: "text",
    sortable: false,
    filterable: false,
  },
  {
    field: "type",
    label: "Type",
    type: "text",
    sortable: false,
    filterable: false,
    options: [
      { value: "LIMIT", label: "Limit" },
      { value: "MARKET", label: "Market" },
    ],
    placeholder: "Select type",
  },
  {
    field: "side",
    label: "Side",
    type: "text",
    sortable: false,
    filterable: false,
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
    sortable: false,
    filterable: false,
  },
  {
    field: "amount",
    label: "Amount",
    type: "number",
    sortable: false,
    filterable: false,
  },
  {
    field: "fee",
    label: "Fee",
    type: "number",
    sortable: false,
    filterable: false,
    getValue: (item) => `${item.fee} ${item.feeCurrency}`,
  },
  {
    field: "status",
    label: "Status",
    type: "text",
    sortable: false,
    filterable: false,
    options: [
      { value: "OPEN", label: "Open" },
      { value: "CLOSED", label: "Closed" },
      { value: "CANCELLED", label: "Cancelled" },
    ],
    placeholder: "Select status",
  },
];
const EcosystemOrders = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Ecosystem Orders Management")} color="muted">
      <DataTable
        title={t("Ecosystem Orders")}
        endpoint={api}
        columnConfig={columnConfig}
        isCrud={false}
        canCreate={false}
        hasAnalytics={false}
        canEdit={false}
        canDelete={false}
        canView={false}
      />
    </Layout>
  );
};
export default EcosystemOrders;
export const permission = "Access Ecosystem Order Management";
