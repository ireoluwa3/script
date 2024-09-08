// pages/chart.tsx
import React from "react";
import Layout from "@/layouts/Default";
import { AnalyticsChart } from "@/components/charts/AnalyticsChart";
import { useTranslation } from "next-i18next";
const path = "/admin/ext/affiliate/reward";
const ReferralRewardsAnalytics = () => {
  const { t } = useTranslation();
  const availableFilters: AvailableFilters = {
    isClaimed: [
      {
        value: "true",
        label: "claimed",
        color: "success",
        icon: "ph:check-circle",
        path: `${path}?isClaimed=true`,
      },
      {
        value: "false",
        label: "unclaimed",
        color: "danger",
        icon: "ph:x-circle",
        path: `${path}?isClaimed=false`,
      },
    ],
  };
  return (
    <Layout color="muted" title={t("Referral Rewards Analytics")}>
      <AnalyticsChart
        model="mlmReferralReward"
        modelName={t("Referral Rewards")}
        cardName={t("Rewards")}
        availableFilters={availableFilters}
        color="primary"
      />
    </Layout>
  );
};
export default ReferralRewardsAnalytics;
export const permission = "Access MLM Referral Reward Management";
