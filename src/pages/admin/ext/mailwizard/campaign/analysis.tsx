// pages/chart.tsx
import React from "react";
import Layout from "@/layouts/Default";
import { AnalyticsChart } from "@/components/charts/AnalyticsChart";
import { useTranslation } from "next-i18next";
const path = "/admin/ext/mailwizard/campaign";
const MailwizardCampaignsAnalytics = () => {
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
        value: "PAUSED",
        label: "paused",
        color: "warning",
        icon: "ph:pause-circle",
        path: `${path}?status=PAUSED`,
      },
      {
        value: "ACTIVE",
        label: "active",
        color: "primary",
        icon: "ph:play-circle",
        path: `${path}?status=ACTIVE`,
      },
      {
        value: "STOPPED",
        label: "stopped",
        color: "danger",
        icon: "ph:stop-circle",
        path: `${path}?status=STOPPED`,
      },
      {
        value: "COMPLETED",
        label: "completed",
        color: "success",
        icon: "ph:check-circle",
        path: `${path}?status=COMPLETED`,
      },
      // TODO: make it CANCELLED
      {
        value: "CANCELLED",
        label: "cancelled",
        color: "muted",
        icon: "ph:x-circle",
        path: `${path}?status=CANCELLED`,
      },
    ],
  };
  return (
    <Layout color="muted" title={t("Mailwizard Campaigns Analytics")}>
      <AnalyticsChart
        model="mailwizardCampaign"
        modelName={t("Mailwizard Campaigns")}
        cardName={t("Campaigns")}
        availableFilters={availableFilters}
        color="primary"
      />
    </Layout>
  );
};
export default MailwizardCampaignsAnalytics;
export const permission = "Access Mailwizard Campaign Management";
