"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
import { useDashboardStore } from "@/stores/dashboard";
import Tag from "@/components/elements/base/tag/Tag";

const api = "/api/ext/p2p/trade";

const P2pTrades = () => {
  const { t } = useTranslation();
  const { profile } = useDashboardStore();
  const columnConfig: ColumnConfigType[] = [
    {
      field: "seller",
      label: "Seller",
      type: "text",
      getValue: (item) => `${item.seller?.firstName} ${item.seller?.lastName}`,
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
      sublabel: "offer.walletType",
      type: "text",
      sortable: true,
      hasImage: true,
      imageKey: "offer.currency",
      placeholder: "/img/placeholder.svg",
      path: "/p2p/offer/[offer.id]",
      getImage: (item) => `/img/crypto/${item.offer?.currency}.webp`,
      getValue: (item) =>
        `${item.offer?.currency} ${item.offer?.chain ? item.offer?.chain : ""}`,
      getSubValue: (item) => item.offer?.walletType,
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
    {
      field: "type",
      label: "Type",
      type: "text",
      sortable: false,
      filterable: false,
      getValue: (item) => {
        return (
          <>
            <Tag
              color={item.seller?.id === profile?.id ? "danger" : "success"}
              variant={"pastel"}
            >
              {item.seller?.id === profile?.id ? "Sell" : "Buy"}
            </Tag>
          </>
        );
      },
    },
  ];

  return (
    <Layout title={t("P2P Trades")} color="muted">
      <DataTable
        title={t("P2P Trades")}
        endpoint={api}
        columnConfig={columnConfig}
        canCreate={false}
        canEdit={false}
        canDelete={false}
        viewPath="/user/p2p/trade/[id]"
        hasAnalytics
        hasStructure={false}
      />
    </Layout>
  );
};

export default P2pTrades;
