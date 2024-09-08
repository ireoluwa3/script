"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/ecosystem/utxo";
const columnConfig: ColumnConfigType[] = [
  {
    field: "wallet.currency",
    label: "Wallet",
    sublabel: "wallet.chain",
    type: "text",
    sortable: true,
  },
  {
    field: "transactionId",
    label: "Transaction ID",
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
    sortable: false,
    api: `${api}/:id/status`,
    options: [
      { value: true, label: "Active", color: "success" },
      { value: false, label: "Inactive", color: "danger" },
    ],
  },
];
const Utxos = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Ecosystem UTXOs")} color="muted">
      <DataTable
        title={t("UTXOs")}
        endpoint={api}
        columnConfig={columnConfig}
      />
    </Layout>
  );
};
export default Utxos;
export const permission = "Access Ecosystem UTXO Management";
