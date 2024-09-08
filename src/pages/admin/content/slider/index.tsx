"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { formatDate } from "date-fns";
import { useTranslation } from "next-i18next";
const api = "/api/admin/content/slider";

const columnConfig: ColumnConfigType[] = [
  {
    field: "image",
    label: "Slider Image",
    type: "image",
    sortable: true,
    placeholder: "/img/placeholder.svg",
  },
  {
    field: "link",
    label: "Link",
    type: "text",
    sortable: true,
    placeholder: "/img/placeholder.svg",
  },
  {
    field: "status",
    label: "Status",
    type: "switch",
    sortable: false,
    api: `${api}/:id/status`,
  },
];

const Sliders = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Sliders")} color="muted">
      <DataTable
        title={t("Sliders")}
        endpoint={api}
        columnConfig={columnConfig}
      />
    </Layout>
  );
};

export default Sliders;
export const permission = "Access Slider Management";
