"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { formatDate } from "date-fns";
import { useTranslation } from "next-i18next";
const api = "/api/admin/content/media";
const columnConfig: ColumnConfigType[] = [
  {
    field: "path",
    label: "Image",
    type: "image",
    sortable: false,
  },
  {
    field: "name",
    label: "Name",
    sublabel: "name",
    type: "text",
    sortable: true,
    sortName: "path",
    getValue: (row) =>
      // remove first /
      row.path?.replace(`/${row.name}`, ""),
    getSubValue: (row) => row.name,
  },
  {
    field: "dateModified",
    label: "Created At",
    type: "datetime",
    sortable: true,
    filterable: false,
    getValue: (row) => formatDate(new Date(row.createdAt), "yyyy-MM-dd"),
  },
];
const Media = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Media")} color="muted">
      <DataTable
        title={t("Media")}
        endpoint={api}
        columnConfig={columnConfig}
        isCrud={true}
        hasStructure={false}
        viewPath="[path]"
        blank={true}
        canEdit={false}
        canCreate={false}
        isParanoid={false}
      />
    </Layout>
  );
};
export default Media;
export const permission = "Access Media Management";
