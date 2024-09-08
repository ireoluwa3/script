"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/p2p/offer";
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
    field: "paymentMethod.name",
    label: "Method",
    sublabel: "paymentMethod.currency",
    type: "text",
    sortable: true,
    sortName: "paymentMethod.name",
    getValue: (item) => item.paymentMethod?.name,
    getSubValue: (item) => item.paymentMethod?.currency,
    path: "/admin/ext/p2p/payment/method?name=[paymentMethod.name]",
    hasImage: true,
    imageKey: "paymentMethod.image",
    placeholder: "/img/placeholder.svg",
  },
  {
    field: "currency",
    label: "Currency",
    sublabel: "walletType",
    type: "text",
    sortable: true,
    getValue: (item) => `${item.currency} (${item.chain})`,
  },
  {
    field: "amount",
    label: "Amount",
    type: "number",
    sortable: true,
  },
  {
    field: "price",
    label: "Price",
    type: "number",
    sortable: true,
  },
  {
    field: "p2pReviews",
    label: "Rating",
    type: "rating",
    getValue: (data) => {
      if (!data.p2pReviews.length) return 0;
      const rating = data.p2pReviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      return rating / data.p2pReviews.length;
    },
    sortable: true,
    sortName: "p2pReviews.rating",
  },
  {
    field: "status",
    label: "Status",
    type: "select",
    sortable: true,
    options: [
      { value: "PENDING", label: "Pending", color: "warning" },
      { value: "ACTIVE", label: "Active", color: "success" },
      { value: "COMPLETED", label: "Completed", color: "success" },
      { value: "CANCELLED", label: "Cancelled", color: "danger" },
    ],
  },
];
const P2pOffers = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("P2P Offers")} color="muted">
      <DataTable
        title={t("P2P Offers")}
        endpoint={api}
        columnConfig={columnConfig}
        canCreate={false}
        hasAnalytics
      />
    </Layout>
  );
};
export default P2pOffers;
export const permission = "Access P2P Offer Management";
