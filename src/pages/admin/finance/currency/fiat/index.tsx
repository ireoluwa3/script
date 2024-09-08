"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/finance/currency/fiat";
const columnConfig: ColumnConfigType[] = [
  {
    field: "name",
    label: "Name",
    type: "text",
    sortable: true,
  },
  {
    field: "symbol",
    label: "Symbol",
    type: "text",
    sortable: true,
  },
  {
    field: "precision",
    label: "Precision",
    type: "number",
    sortable: true,
  },
  {
    field: "price",
    label: "Price",
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
const Currencies = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Currencies Management")} color="muted">
      <DataTable
        title={t("Currencies")}
        endpoint={api}
        columnConfig={columnConfig}
        canCreate={false}
        canView={false}
        canDelete={false}
        isParanoid={false}
      />
    </Layout>
  );
};
export default Currencies;
export const permission = "Access Fiat Currency Management";
