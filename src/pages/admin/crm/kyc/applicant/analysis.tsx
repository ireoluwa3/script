// pages/chart.tsx
import React from "react";
import Layout from "@/layouts/Default";
import { AnalyticsChart } from "@/components/charts/AnalyticsChart";
import { useTranslation } from "next-i18next";
const KycApplicantsAnalytics = () => {
  const { t } = useTranslation();
  const availableFilters: AvailableFilters = {
    status: [
      {
        value: "PENDING",
        label: "pending",
        color: "warning",
        icon: "ph:circle",
        path: "/admin/crm/kyc?status=PENDING",
      },
      {
        value: "APPROVED",
        label: "approved",
        color: "success",
        icon: "ph:check-circle",
        path: "/admin/crm/kyc?status=APPROVED",
      },
      {
        value: "REJECTED",
        label: "rejected",
        color: "danger",
        icon: "ph:x-circle",
        path: "/admin/crm/kyc?status=REJECTED",
      },
    ],
  };
  return (
    <Layout color="muted" title={t("KYC Applicants Analytics")}>
      <AnalyticsChart
        model="kyc"
        modelName={t("KYC Applicants")}
        availableFilters={availableFilters}
        color="primary"
      />
    </Layout>
  );
};
export default KycApplicantsAnalytics;
export const permission = "Access KYC Application Management";
