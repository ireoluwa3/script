// pages/chart.tsx
import React from "react";
import Layout from "@/layouts/Default";
import { AnalyticsChart } from "@/components/charts/AnalyticsChart";
import { useTranslation } from "next-i18next";
const path = "/user/p2p";
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
        value: "ACTIVE",
        label: "active",
        color: "primary",
        icon: "ph:stop-circle",
        path: `${path}?status=ACTIVE`,
      },
      {
        value: "COMPLETED",
        label: "completed",
        color: "success",
        icon: "ph:check-circle",
        path: `${path}?status=COMPLETED`,
      },
      {
        value: "CANCELLED",
        label: "cancelled",
        color: "danger",
        icon: "ph:x-circle",
        path: `${path}?status=CANCELLED`,
      },
    ],
  };
  return (
    <Layout color="muted" title={t("P2P Offers Analytics")}>
      <AnalyticsChart
        model="p2pOffer"
        modelName={t("P2P Offers")}
        cardName={t("Offers")}
        availableFilters={availableFilters}
        color="primary"
        path={`/api/ext/p2p/trade/analysis`}
        pathModel={true}
      />
    </Layout>
  );
};
export default P2PsAnalytics;
