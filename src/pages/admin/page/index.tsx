"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const columnConfig = [
  {
    field: "title",
    label: "Title",
    type: "text",
    sortable: true,
  },
  {
    field: "content",
    label: "Content",
    type: "textarea",
    sortable: false,
  },
  {
    field: "description",
    label: "Description",
    type: "textarea",
    sortable: false,
  },
  {
    field: "image",
    label: "Image",
    type: "file",
    sortable: false,
    fileType: "image",
  },
  {
    field: "slug",
    label: "Slug",
    type: "text",
    sortable: true,
  },
  {
    field: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "PUBLISHED", label: "Published" },
      { value: "DRAFT", label: "Draft" },
    ],
    sortable: true,
  },
];
const Pages = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("CMS Pages Management")} color="muted">
      <DataTable
        title={t("Pages")}
        endpoint="/api/admin/page"
        columnConfig={columnConfig}
        hasStructure
        formSize="sm"
        isCrud
        isParanoid={false}
        canCreate
        canEdit
        canDelete
      />
    </Layout>
  );
};
export default Pages;
export const permission = "Access Pages Management";
