"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/ecommerce/category";
const columnConfig: ColumnConfigType[] = [
  {
    field: "name",
    label: "Name",
    type: "text",
    sortable: true,
    hasImage: true,
    imageKey: "image",
    placeholder: "/img/placeholder.svg",
  },
  {
    field: "description",
    label: "Description",
    type: "text",
    sortable: false,
  },
  {
    field: "status",
    label: "Status",
    type: "switch",
    sortable: false,
    api: `${api}/:id/status`,
  },
];
const EcommerceCategories = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Ecommerce Categories")} color="muted">
      <DataTable
        title={t("Ecommerce Categories")}
        endpoint={api}
        columnConfig={columnConfig}
        viewPath="/store/category/[id]"
      />
    </Layout>
  );
};
export default EcommerceCategories;
export const permission = "Access Ecommerce Category Management";
