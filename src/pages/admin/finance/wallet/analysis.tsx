// pages/chart.tsx
import React from "react";
import Layout from "@/layouts/Default";
import { AnalyticsChart } from "@/components/charts/AnalyticsChart";
import { useTranslation } from "next-i18next";
const path = "/admin/finance/wallet";
const WalletsAnalytics = () => {
  const { t } = useTranslation();
  const availableFilters: AvailableFilters = {
    type: [
      {
        value: "FIAT",
        label: "Fiat",
        color: "success",
        icon: "ph:circle",
        path: `${path}?type=FIAT`,
      },
      {
        value: "SPOT",
        label: "Spot",
        color: "success",
        icon: "ph:check-circle",
        path: `${path}?type=SPOT`,
      },
      {
        value: "ECO",
        label: "Eco",
        color: "warning",
        icon: "ph:x-circle",
        path: `${path}?type=ECO`,
      },
    ],
  };
  return (
    <Layout color="muted" title={t("Wallets Analytics")}>
      <AnalyticsChart
        model="wallet"
        modelName={t("Wallets")}
        cardName={t("Wallets")}
        availableFilters={availableFilters}
        color="primary"
      />
    </Layout>
  );
};
export default WalletsAnalytics;
export const permission = "Access Wallet Management";
