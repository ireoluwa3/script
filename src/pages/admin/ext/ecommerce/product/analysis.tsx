// pages/chart.tsx
import React from "react";
import Layout from "@/layouts/Default";
import { AnalyticsChart } from "@/components/charts/AnalyticsChart";
import { useTranslation } from "next-i18next";
const path = "/admin/ext/ecommerce/product";
const EcommerceProductsAnalytics = () => {
  const { t } = useTranslation();
  const availableFilters: AvailableFilters = {
    status: [
      {
        value: "true",
        label: "Active",
        color: "success",
        icon: "ph:check-circle",
        path: `${path}?status=true`,
      },
      {
        value: "false",
        label: "Disabled",
        color: "danger",
        icon: "ph:x-circle",
        path: `${path}?status=false`,
      },
    ],
  };
  return (
    <Layout color="muted" title={t("Ecommerce Products Analytics")}>
      <AnalyticsChart
        model="ecommerceProduct"
        modelName={t("Ecommerce Products")}
        cardName={t("Products")}
        availableFilters={availableFilters}
        color="primary"
      />
    </Layout>
  );
};
export default EcommerceProductsAnalytics;
export const permission = "Access Ecommerce Product Management";
