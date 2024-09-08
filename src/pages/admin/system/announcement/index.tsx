"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { formatDate } from "date-fns";
import { useTranslation } from "next-i18next";
const api = "/api/admin/system/announcement";
const columnConfig: ColumnConfigType[] = [
  {
    field: "title",
    label: "Announcement",
    sublabel: "createdAt",
    type: "text",
    sortable: true,
    placeholder: "/img/placeholder.svg",
    getSubValue: (item) =>
      item.createdAt
        ? formatDate(new Date(item.createdAt), "MMM dd, yyyy")
        : "N/A",
  },
  {
    field: "type",
    label: "Type",
    type: "select",
    options: [
      { value: "GENERAL", label: "General" },
      { value: "EVENT", label: "Event" },
      { value: "UPDATE", label: "Update" },
    ],
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
const Announcements = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Announcements")} color="muted">
      <DataTable
        title={t("Announcements")}
        endpoint={api}
        columnConfig={columnConfig}
      />
    </Layout>
  );
};
export default Announcements;
export const permission = "Access Announcement Management";
