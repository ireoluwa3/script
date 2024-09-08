"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/p2p/dispute";
const columnConfig: ColumnConfigType[] = [
  {
    field: "raisedBy",
    label: "User",
    sublabel: "raisedBy.email",
    type: "text",
    getValue: (item) =>
      `${item.raisedBy?.firstName} ${item.raisedBy?.lastName}`,
    getSubValue: (item) => item.raisedBy?.email,
    path: "/admin/crm/user?email=[raisedBy.email]",
    sortable: true,
    sortName: "raisedBy.firstName",
    hasImage: true,
    imageKey: "raisedBy.avatar",
    placeholder: "/img/avatars/placeholder.webp",
    className: "rounded-full",
  },
  {
    field: "tradeId",
    label: "Trade ID",
    type: "text",
    sortable: true,
  },
  {
    field: "reason",
    label: "Reason",
    type: "text",
    sortable: true,
  },
  {
    field: "resolution",
    label: "Resolution",
    type: "text",
    sortable: true,
  },
  {
    field: "status",
    label: "Status",
    type: "select",
    sortable: true,
    options: [
      { value: "PENDING", label: "Pending", color: "warning" },
      { value: "OPEN", label: "Open", color: "info" },
      { value: "RESOLVED", label: "Resolved", color: "success" },
      { value: "CANCELLED", label: "Cancelled", color: "danger" },
    ],
  },
];
const P2pDisputes = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("P2P Disputes")} color="muted">
      <DataTable
        title={t("P2P Disputes")}
        endpoint={api}
        columnConfig={columnConfig}
        canCreate={false}
        hasAnalytics
      />
    </Layout>
  );
};
export default P2pDisputes;
export const permission = "Access P2P Dispute Management";
