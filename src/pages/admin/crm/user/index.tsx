"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/crm/user";
const columnConfig: ColumnConfigType[] = [
  {
    field: "fullName",
    label: "Full Name",
    type: "text",
    sortable: true,
    sortName: "firstName",
    getValue: (item) => `${item.firstName} ${item.lastName}`,
    hasImage: true,
    imageKey: "avatar",
    placeholder: "/img/avatars/placeholder.webp",
    className: "rounded-full",
  },
  { field: "email", label: "Email", type: "text", sortable: true },
  {
    field: "status",
    label: "Status",
    type: "select",
    active: "ACTIVE",
    disabled: "INACTIVE",
    sortable: false,
    api: `${api}/:id/status`,
    options: [
      { value: "ACTIVE", label: "Active", color: "success" },
      { value: "INACTIVE", label: "Inactive", color: "warning" },
      { value: "BANNED", label: "Banned", color: "danger" },
      { value: "SUSPENDED", label: "Suspended", color: "info" },
    ],
  },
  {
    field: "createdAt",
    label: "Registered",
    type: "date",
    sortable: true,
    filterable: false,
    getValue: (item) =>
      item.createdAt ? new Date(item.createdAt).toLocaleString() : "N/A",
  },
];
const Users = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Users Management")} color="muted">
      <DataTable
        title={t("Users")}
        endpoint={api}
        columnConfig={columnConfig}
        hasAnalytics
      />
    </Layout>
  );
};
export default Users;
export const permission = "Access User Management";
