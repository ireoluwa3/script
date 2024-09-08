// pages/chart.tsx
import React from "react";
import Layout from "@/layouts/Default";
import { AnalyticsChart } from "@/components/charts/AnalyticsChart";
import { useTranslation } from "next-i18next";
const path = "/user/p2p/trade";
const P2PsAnalytics = () => {
  const { t } = useTranslation();
  const availableFilters: AvailableFilters = {
    status: [
      {
        value: "PENDING",
        label: "pending",
        color: "warning",
        icon: "ph:circle",
        path: `${path}?status=PENDING`,
      },
      {
        value: "PAID",
        label: "paid",
        color: "primary",
        icon: "ph:stop-circle",
        path: `${path}?status=PAID`,
      },
      {
        value: "DISPUTE_OPEN",
        label: "dispute open",
        color: "info",
        icon: "ph:circle-half",
        path: `${path}?status=DISPUTE_OPEN`,
      },
      {
        value: "ESCROW_REVIEW",
        label: "escrow review",
        color: "info",
        icon: "ph:circle-half",
        path: `${path}?status=ESCROW_REVIEW`,
      },
      {
        value: "CANCELLED",
        label: "cancelled",
        color: "danger",
        icon: "ph:x-circle",
        path: `${path}?status=CANCELLED`,
      },
      {
        value: "COMPLETED",
        label: "completed",
        color: "success",
        icon: "ph:check-circle",
        path: `${path}?status=COMPLETED`,
      },
      {
        value: "REFUNDED",
        label: "refunded",
        color: "danger",
        icon: "ph:x-circle",
        path: `${path}?status=REFUNDED`,
      },
    ],
  };
  return (
    <Layout color="muted" title={t("P2P Trades Analytics")}>
      <AnalyticsChart
        model="p2pTrade"
        modelName={t("P2P Trades")}
        cardName={t("Trades")}
        availableFilters={availableFilters}
        color="primary"
        path={`/api/ext/p2p/trade/analysis`}
        pathModel={true}
      />
    </Layout>
  );
};
export default P2PsAnalytics;
