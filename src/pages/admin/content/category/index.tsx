"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { formatDate } from "date-fns";
import { useTranslation } from "next-i18next";
const api = "/api/admin/content/category";
const columnConfig: ColumnConfigType[] = [
  {
    field: "name",
    label: "Name",
    sublabel: "createdAt",
    type: "text",
    sortable: true,
    hasImage: true,
    imageKey: "image",
    placeholder: "/img/placeholder.svg",
    getSubValue: (row) => formatDate(new Date(row.createdAt), "yyyy-MM-dd"),
  },
  {
    field: "slug",
    label: "Slug",
    type: "text",
    sortable: true,
  },
  {
    field: "description",
    label: "Description",
    type: "text",
    sortable: false,
  },
  {
    field: "posts",
    label: "Posts",
    type: "number",
    sortable: true,
    filterable: false,
    getValue: (row) => row.posts?.length,
  },
];
const Categories = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Categories")} color="muted">
      <DataTable
        title={t("Categories")}
        endpoint={api}
        columnConfig={columnConfig}
        viewPath="/blog/category/[slug]"
      />
    </Layout>
  );
};
export default Categories;
export const permission = "Access Category Management";
