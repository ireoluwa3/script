// pages/chart.tsx
import React from "react";
import Layout from "@/layouts/Default";
import { AnalyticsChart } from "@/components/charts/AnalyticsChart";
import { useTranslation } from "next-i18next";
const UsersAnalytics = () => {
  const { t } = useTranslation();
  const availableFilters: AvailableFilters = {
    status: [
      {
        value: "ACTIVE",
        label: "Active",
        color: "success",
        icon: "solar:user-check-bold-duotone",
        path: "/admin/crm/user?status=ACTIVE",
      },
      {
        value: "INACTIVE",
        label: "Inactive",
        color: "danger",
        icon: "solar:user-minus-bold-duotone",
        path: "/admin/crm/user?status=INACTIVE",
      },
      {
        value: "BANNED",
        label: "Banned",
        color: "warning",
        icon: "solar:user-block-bold-duotone",
        path: "/admin/crm/user?status=BANNED",
      },
      {
        value: "SUSPENDED",
        label: "Suspended",
        color: "info",
        icon: "solar:user-cross-bold-duotone",
        path: "/admin/crm/user?status=SUSPENDED",
      },
    ],
  };
  return (
    <Layout color="muted" title={t("Users Analytics")}>
      <AnalyticsChart
        model="user"
        modelName={t("Users")}
        availableFilters={availableFilters}
        color="primary"
      />
    </Layout>
  );
};
export default UsersAnalytics;
export const permission = "Access User Management";
