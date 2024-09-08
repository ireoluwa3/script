"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";

const api = "/api/admin/api";
const columnConfig = [
  {
    field: "user",
    label: "Author",
    sublabel: "user.email",
    type: "text",
    getValue: (item) => `${item.user?.firstName} ${item.user?.lastName}`,
    getSubValue: (item) => item.user?.email,
    path: "/admin/crm/user?email=[user.email]",
    sortable: true,
    sortName: "user.firstName",
    hasImage: true,
    imageKey: "user.avatar",
    placeholder: "/img/avatars/placeholder.webp",
    className: "rounded-full",
  },
  {
    field: "name",
    label: "API Key Name",
    type: "text",
    sortable: true,
  },
  {
    field: "key",
    label: "API Key",
    type: "text",
    sortable: true,
    getValue: (item) => `**** **** **** ${item.key.slice(-5)}`, // Mask the API key for security
  },
  {
    field: "permissions",
    label: "Permissions",
    type: "text",
    sortable: false,
    getValue: (item) => {
      // Ensure permissions is an array
      const permissions = Array.isArray(item.permissions)
        ? item.permissions
        : [];
      return permissions.length > 0 ? permissions.join(", ") : "No Permissions"; // Display permissions or a default message
    },
  },
  {
    field: "ipWhitelist",
    label: "IP Whitelist",
    type: "text",
    sortable: false,
    getValue: (item) => {
      // Ensure ipWhitelist is an array
      const ipWhitelist = Array.isArray(item.ipWhitelist)
        ? item.ipWhitelist
        : [];
      return ipWhitelist.length > 0
        ? ipWhitelist.join(", ")
        : "No IPs Whitelisted"; // Display IPs or a default message
    },
  },
  {
    field: "createdAt",
    label: "Created At",
    type: "date",
    filterable: false,
    sortable: true,
  },
];

const ApiKeys = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("API Keys")} color="muted">
      <DataTable
        title={t("API Keys")}
        endpoint={api}
        columnConfig={columnConfig}
        canEdit={false}
        canView={false}
        canCreate={false}
      />
    </Layout>
  );
};

export default ApiKeys;
export const permission = "Access API Key Management";
