"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { formatDate } from "date-fns";
import { useTranslation } from "next-i18next";
const api = "/api/admin/content/tag";
const columnConfig: ColumnConfigType[] = [
  {
    field: "name",
    label: "Name",
    sublabel: "slug",
    type: "text",
    sortable: true,
  },
  {
    field: "createdAt",
    label: "Created At",
    type: "text",
    sortable: true,
    getValue: (row) => formatDate(new Date(row.createdAt), "yyyy-MM-dd"),
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
const Tags = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Tags")} color="muted">
      <DataTable
        title={t("Tags")}
        endpoint={api}
        columnConfig={columnConfig}
        viewPath="/blog/tag/[slug]"
      />
    </Layout>
  );
};
export default Tags;
export const permission = "Access Tag Management";
