"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { capitalize } from "lodash";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/faq/category";
const columnConfig: ColumnConfigType[] = [
  {
    field: "id",
    label: "id",
    type: "text",
    sortable: true,
    getValue: (row) => capitalize(row.id),
  },
];
const FaqCategories = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("FAQ Categories")} color="muted">
      <DataTable
        title={t("FAQ Categories")}
        endpoint={api}
        columnConfig={columnConfig}
        isCrud={false}
      />
    </Layout>
  );
};
export default FaqCategories;
export const permission = "Access FAQ Category Management";
