"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/crm/role";
const columnConfig = [
  {
    field: "name",
    label: "Name",
    type: "text",
    sortable: true,
  },
  {
    field: "permissions",
    label: "Permissions",
    type: "tags",
    key: "name",
    sortable: false,
    filterable: false,
  },
];
const Roles = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Roles Management")} color="muted">
      <DataTable
        title={t("Roles")}
        endpoint={api}
        columnConfig={columnConfig}
        isParanoid={false}
        canView={false}
      />
    </Layout>
  );
};
export default Roles;
export const permission = "Access Role Management";
