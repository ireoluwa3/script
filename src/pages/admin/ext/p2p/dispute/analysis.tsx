// pages/chart.tsx
import React from "react";
import Layout from "@/layouts/Default";
import { AnalyticsChart } from "@/components/charts/AnalyticsChart";
import { useTranslation } from "next-i18next";
const path = "/admin/ext/p2p/dispute";
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
        value: "OPEN",
        label: "open",
        color: "primary",
        icon: "ph:stop-circle",
        path: `${path}?status=OPEN`,
      },
      {
        value: "RESOLVED",
        label: "resolved",
        color: "success",
        icon: "ph:check-circle",
        path: `${path}?status=RESOLVED`,
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
    <Layout color="muted" title={t("P2P Disputes Analytics")}>
      <AnalyticsChart
        model="p2pDispute"
        modelName={t("P2P Disputes")}
        cardName={t("Disputes")}
        availableFilters={availableFilters}
        color="primary"
      />
    </Layout>
  );
};
export default P2PsAnalytics;
export const permission = "Access P2P Dispute Management";
