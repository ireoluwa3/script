// pages/chart.tsx
import React from "react";
import Layout from "@/layouts/Default";
import { AnalyticsChart } from "@/components/charts/AnalyticsChart";
import { useTranslation } from "next-i18next";
const P2pCommissionsAnalytics = () => {
  const { t } = useTranslation();
  return (
    <Layout color="muted" title={t("P2P Commissions Analytics")}>
      <AnalyticsChart
        model="p2pCommission"
        modelName={t("P2P Commissions")}
        cardName={t("Commissions")}
        color="primary"
      />
    </Layout>
  );
};
export default P2pCommissionsAnalytics;
export const permission = "Access P2P Commission Management";
