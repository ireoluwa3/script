"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/finance/deposit/gateway";
const columnConfig: ColumnConfigType[] = [
  {
    field: "title",
    label: "Title",
    type: "text",
    sortable: true,
    hasImage: true,
    imageKey: "image",
    placeholder: "/img/placeholder.svg",
  },
  {
    field: "fixedFee",
    label: "Fixed Fee",
    type: "number",
    sortable: true,
  },
  {
    field: "percentageFee",
    label: "% Fee",
    type: "number",
    sortable: true,
  },
  {
    field: "minAmount",
    label: "Min Amount",
    type: "number",
    sortable: true,
  },
  {
    field: "status",
    label: "Status",
    type: "switch",
    sortable: false,
    api: `${api}/:id/status`,
  },
];
const DepositGateways = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Deposit Gateways Management")} color="muted">
      <DataTable
        title={t("Deposit Gateways")}
        endpoint={api}
        columnConfig={columnConfig}
        isParanoid={false}
        canCreate={false}
        canDelete={false}
      />
    </Layout>
  );
};
export default DepositGateways;
export const permission = "Access Deposit Gateway Management";
