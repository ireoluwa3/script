"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/p2p/trade";
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
    field: "seller",
    label: "Seller",
    sublabel: "seller.email",
    type: "text",
    getValue: (item) => `${item.seller?.firstName} ${item.seller?.lastName}`,
    getSubValue: (item) => item.seller?.email,
    path: "/admin/crm/user?email=[seller.email]",
    sortable: true,
    sortName: "seller.firstName",
    hasImage: true,
    imageKey: "seller.avatar",
    placeholder: "/img/avatars/placeholder.webp",
    className: "rounded-full",
  },
  {
    field: "offerId",
    label: "Offer",
    type: "text",
    sortable: true,
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
    sortable: true,
    options: [
      { value: "PENDING", label: "Pending", color: "warning" },
      { value: "PAID", label: "Paid", color: "success" },
      { value: "DISPUTE_OPEN", label: "Dispute Open", color: "danger" },
      { value: "ESCROW_REVIEW", label: "Escrow Review", color: "info" },
      { value: "CANCELLED", label: "Cancelled", color: "danger" },
      { value: "COMPLETED", label: "Completed", color: "success" },
      { value: "REFUNDED", label: "Refunded", color: "danger" },
    ],
  },
];
const P2pTrades = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("P2P Trades")} color="muted">
      <DataTable
        title={t("P2P Trades")}
        endpoint={api}
        columnConfig={columnConfig}
        canCreate={false}
        hasAnalytics
        viewPath="/admin/ext/p2p/trade/[id]"
      />
    </Layout>
  );
};
export default P2pTrades;
export const permission = "Access P2P Trade Management";
