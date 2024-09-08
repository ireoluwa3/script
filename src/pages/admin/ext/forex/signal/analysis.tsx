// pages/chart.tsx
import React from "react";
import Layout from "@/layouts/Default";
import { AnalyticsChart } from "@/components/charts/AnalyticsChart";
import { useTranslation } from "next-i18next";
const path = "/admin/ext/forex/signal";
const ForexSignalsAnalytics = () => {
  const { t } = useTranslation();
  const availableFilters: AvailableFilters = {
    status: [
      {
        value: "LIVE",
        label: "Live",
        color: "success",
        icon: "ph:check-circle",
        path: `${path}?status=true`,
      },
      {
        value: "DEMO",
        label: "Demo",
        color: "danger",
        icon: "ph:x-circle",
        path: `${path}?status=false`,
      },
    ],
  };
  return (
    <Layout color="muted" title={t("Forex Signals Analytics")}>
      <AnalyticsChart
        model="forexSignal"
        modelName={t("Forex Signals")}
        cardName={t("Signals")}
        availableFilters={availableFilters}
        color="primary"
      />
    </Layout>
  );
};
export default ForexSignalsAnalytics;
export const permission = "Access Forex Signal Management";
