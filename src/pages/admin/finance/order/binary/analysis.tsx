// pages/chart.tsx
import React from "react";
import Layout from "@/layouts/Default";
import { AnalyticsChart } from "@/components/charts/AnalyticsChart";
import { useTranslation } from "next-i18next";
const path = "/admin/finance/order/binary";
const BinaryOrdersAnalytics = () => {
  const { t } = useTranslation();
  const availableFilters: AvailableFilters = {
    status: [
      {
        value: "PENDING",
        label: "Pending",
        color: "warning",
        icon: "ph:circle",
        path: `${path}?status=PENDING`,
      },
      {
        value: "WIN",
        label: "Win",
        color: "success",
        icon: "ph:check-circle",
        path: `${path}?status=WIN`,
      },
      {
        value: "LOSS",
        label: "Loss",
        color: "danger",
        icon: "ph:x-circle",
        path: `${path}?status=LOSS`,
      },
      {
        value: "DRAW",
        label: "Draw",
        color: "primary",
        icon: "ph:minus-circle",
        path: `${path}?status=DRAW`,
      },
    ],
    side: [
      {
        value: "RISE",
        label: "Rise",
        color: "success",
        icon: "ph:arrow-up",
        path: `${path}?side=RISE`,
      },
      {
        value: "FALL",
        label: "Fall",
        color: "danger",
        icon: "ph:arrow-down",
        path: `${path}?side=FALL`,
      },
    ],
    type: [
      {
        value: "RISE_FALL",
        label: "Rise/Fall",
        color: "primary",
        icon: "ph:arrows-left-right",
        path: `${path}?type=RISE_FALL`,
      },
    ],
  };
  return (
    <Layout color="muted" title={t("Binary Orders Analytics")}>
      <AnalyticsChart
        model="binaryOrder"
        modelName={t("Binary Orders")}
        cardName={t("Orders")}
        availableFilters={availableFilters}
        color="primary"
      />
    </Layout>
  );
};
export default BinaryOrdersAnalytics;
export const permission = "Access Binary Order Management";
