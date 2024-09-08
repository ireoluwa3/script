"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/affiliate/reward";
const columnConfig: ColumnConfigType[] = [
  {
    field: "referrer",
    label: "Referrer",
    sublabel: "referrer.email",
    type: "text",
    getValue: (item) =>
      `${item.referrer?.firstName} ${item.referrer?.lastName}`,
    getSubValue: (item) => item.referrer?.email,
    path: "/admin/crm/user?email={referrer.email}",
    sortable: true,
    sortName: "referrer.firstName",
    hasImage: true,
    imageKey: "referrer.avatar",
    placeholder: "/img/avatars/placeholder.webp",
    className: "rounded-full",
  },
  {
    field: "condition.name",
    label: "Condition",
    type: "text",
    sortable: true,
    getValue: (row) => row.condition?.title,
  },
  {
    field: "reward",
    label: "Reward",
    type: "number",
    sortable: true,
    getValue: (row) => `${row.reward} ${row.condition?.rewardCurrency}`,
  },
  {
    field: "isClaimed",
    label: "Claimed",
    type: "switch",
    sortable: true,
    api: `${api}/:id/status`,
  },
];
const MlmReferralRewards = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("MLM Referral Rewards")} color="muted">
      <DataTable
        title={t("MLM Referral Rewards")}
        endpoint={api}
        columnConfig={columnConfig}
        hasAnalytics
      />
    </Layout>
  );
};
export default MlmReferralRewards;
export const permission = "Access MLM Referral Reward Management";
