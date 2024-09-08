// pages/chart.tsx
import React from "react";
import Layout from "@/layouts/Default";
import { AnalyticsChart } from "@/components/charts/AnalyticsChart";
import { useTranslation } from "next-i18next";
const path = "/admin/ext/p2p/escrow";
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
        value: "HELD",
        label: "held",
        color: "primary",
        icon: "ph:stop-circle",
        path: `${path}?status=HELD`,
      },
      {
        value: "RELEASED",
        label: "released",
        color: "success",
        icon: "ph:check-circle",
        path: `${path}?status=RELEASED`,
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
    <Layout color="muted" title={t("P2P Escrows Analytics")}>
      <AnalyticsChart
        model="p2pEscrow"
        modelName={t("P2P Escrows")}
        cardName={t("Escrows")}
        availableFilters={availableFilters}
        color="primary"
      />
    </Layout>
  );
};
export default P2PsAnalytics;
export const permission = "Access P2P Escrow Management";
