"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/ico/contribution";
const columnConfig: ColumnConfigType[] = [
  {
    field: "user",
    label: "User",
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
    field: "phase.token.currency",
    label: "Token",
    sublabel: "phase.token.chain",
    type: "text",
    sortable: true,
    sortName: "phase.token.currency",
    hasImage: true,
    imageKey: "phase.token.image",
    placeholder: "/img/placeholder.svg",
    className: "rounded-full",
    getValue: (row) => row.phase?.token?.currency,
    getSubValue: (row) => row.phase?.token?.chain,
  },
  {
    field: "phase.name",
    label: "Phase",
    type: "text",
    sortable: true,
    sortName: "phase.name",
    getValue: (item) => item.phase?.name,
  },
  {
    field: "amount",
    label: "Amount",
    type: "number",
    sortable: true,
  },
  {
    field: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "PENDING", label: "Pending", color: "warning" },
      { value: "COMPLETED", label: "Completed", color: "success" },
      { value: "CANCELLED", label: "Cancelled", color: "danger" },
      { value: "REJECTED", label: "Rejected", color: "danger" },
    ],
    sortable: true,
  },
];
const ICOContributions = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("ICO Contributions")} color="muted">
      <DataTable
        title={t("ICO Contributions")}
        endpoint={api}
        columnConfig={columnConfig}
        canView={false}
        hasAnalytics
        canCreate={false}
      />
    </Layout>
  );
};
export default ICOContributions;
export const permission = "Access ICO Contribution Management";
