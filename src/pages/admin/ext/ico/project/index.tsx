"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/ico/project";
const columnConfig: ColumnConfigType[] = [
  {
    field: "name",
    label: "Name",
    sublabel: "website",
    type: "text",
    sortable: true,
    hasImage: true,
    imageKey: "image",
    placeholder: "/img/placeholder.svg",
    className: "rounded-full",
  },
  {
    field: "description",
    label: "Description",
    type: "text",
    sortable: true,
    maxLength: 100,
  },
  {
    field: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "PENDING", label: "Pending", color: "warning" },
      { value: "ACTIVE", label: "Active", color: "success" },
      { value: "COMPLETED", label: "Completed", color: "success" },
      { value: "REJECTED", label: "Rejected", color: "danger" },
      { value: "CANCELLED", label: "Cancelled", color: "danger" },
    ],
    sortable: true,
  },
];
const ICOProjects = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("ICO Projects")} color="muted">
      <DataTable
        title={t("ICO Projects")}
        endpoint={api}
        columnConfig={columnConfig}
      />
    </Layout>
  );
};
export default ICOProjects;
export const permission = "Access ICO Project Management";
