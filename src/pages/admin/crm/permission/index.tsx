"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/crm/permission";
const columnConfig = [
  {
    field: "name",
    label: "Name",
    type: "text",
    sortable: true,
  },
];
const Permissions = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Permissions Management")} color="muted">
      <DataTable
        title={t("Permissions")}
        endpoint={api}
        columnConfig={columnConfig}
        isCrud={false}
      />
    </Layout>
  );
};
export default Permissions;
export const permission = "Access Permission Management";
