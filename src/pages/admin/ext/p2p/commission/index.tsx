"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/p2p/commission";
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
];
const P2pCommissions = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("P2P Commissions")} color="muted">
      <DataTable
        title={t("P2P Commissions")}
        endpoint={api}
        columnConfig={columnConfig}
        canCreate={false}
        canView={false}
        hasAnalytics
      />
    </Layout>
  );
};
export default P2pCommissions;
export const permission = "Access P2P Commission Management";
