"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
import { formatDate } from "date-fns";

const api = "/api/admin/ext/futures/position";
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
    field: "entryPrice",
    label: "Entry Price",
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
    field: "leverage",
    label: "Leverage",
    type: "number",
    sortable: false,
    filterable: false,
  },
  {
    field: "unrealizedPnl",
    label: "Unrealized PnL",
    type: "number",
    sortable: false,
    filterable: false,
  },
  {
    field: "stopLossPrice",
    label: "Stop Loss Price",
    type: "number",
    sortable: false,
    filterable: false,
  },
  {
    field: "takeProfitPrice",
    label: "Take Profit Price",
    type: "number",
    sortable: false,
    filterable: false,
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

const FuturesPositions = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Futures Positions Management")} color="muted">
      <DataTable
        title={t("Futures Positions")}
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

export default FuturesPositions;
export const permission = "Access Futures Position Management";
