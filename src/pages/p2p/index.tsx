"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { Faq } from "@/components/pages/knowledgeBase/Faq";
import { useTranslation } from "next-i18next";
const api = "/api/ext/p2p/offer";
const columnConfig: ColumnConfigType[] = [
  {
    field: "user",
    label: "Seller",
    type: "text",
    getValue: (item) => `${item.user?.firstName} ${item.user?.lastName}`,
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
    getValue: (item) =>
      `${item.currency} ${item.chain ? `(${item.chain})` : ""}`,
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
];
const P2pOffers = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("P2P Offers")} color="muted">
      <DataTable
        title={t("P2P")}
        postTitle={t("Offers")}
        hasBreadcrumb={false}
        hasRotatingBackButton={false}
        endpoint={api}
        columnConfig={columnConfig}
        canDelete={false}
        canCreate={false}
        canEdit={false}
        hasStructure={false}
        hasAnalytics={false}
        isParanoid={false}
        viewPath="/p2p/offer/[id]"
      />
      <Faq category="P2P" />
    </Layout>
  );
};
export default P2pOffers;
