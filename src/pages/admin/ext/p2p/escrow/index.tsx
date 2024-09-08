"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/p2p/escrow";
const columnConfig: ColumnConfigType[] = [
  {
    field: "tradeId",
    label: "Trade ID",
    type: "text",
    sortable: true,
  },
  {
    field: "amount",
    label: "Amount",
    type: "number",
    sortable: true,
  },
  {
    field: "status",
    label: "Status",
    type: "select",
    sortable: true,
    options: [
      { value: "PENDING", label: "Pending", color: "warning" },
      { value: "HELD", label: "Held", color: "info" },
      { value: "RELEASED", label: "Released", color: "success" },
      { value: "CANCELLED", label: "Cancelled", color: "danger" },
    ],
  },
];
const P2pEscrows = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("P2P Escrows")} color="muted">
      <DataTable
        title={t("P2P Escrows")}
        endpoint={api}
        columnConfig={columnConfig}
        canCreate={false}
        canView={false}
        hasAnalytics
      />
    </Layout>
  );
};
export default P2pEscrows;
export const permission = "Access P2P Escrow Management";
