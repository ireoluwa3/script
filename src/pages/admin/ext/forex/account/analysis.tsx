// pages/chart.tsx
import React from "react";
import Layout from "@/layouts/Default";
import { AnalyticsChart } from "@/components/charts/AnalyticsChart";
import { useTranslation } from "next-i18next";
const path = "/admin/ext/forex/account";
const ForexAccountsAnalytics = () => {
  const { t } = useTranslation();
  const availableFilters: AvailableFilters = {
    type: [
      {
        value: "LIVE",
        label: "Live",
        color: "success",
        icon: "ph:check-circle",
        path: `${path}?type=true`,
      },
      {
        value: "DEMO",
        label: "Demo",
        color: "danger",
        icon: "ph:x-circle",
        path: `${path}?type=false`,
      },
    ],
  };
  return (
    <Layout color="muted" title={t("Forex Accounts Analytics")}>
      <AnalyticsChart
        model="forexAccount"
        modelName={t("Forex Accounts")}
        cardName={t("Accounts")}
        availableFilters={availableFilters}
        color="primary"
      />
    </Layout>
  );
};
export default ForexAccountsAnalytics;
export const permission = "Access Forex Account Management";
