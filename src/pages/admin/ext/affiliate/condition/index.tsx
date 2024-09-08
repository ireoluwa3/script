"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/affiliate/condition";
const columnConfig: ColumnConfigType[] = [
  {
    field: "name",
    label: "Name",
    type: "text",
    sortable: true,
  },
  {
    field: "reward",
    label: "Reward",
    type: "number",
    sortable: true,
  },
  {
    field: "rewardType",
    label: "Type",
    type: "select",
    sortable: true,
    options: [
      { value: "FIXED", label: "Fixed", color: "primary" },
      { value: "PERCENTAGE", label: "Percentage", color: "info" },
    ],
  },
  {
    field: "rewardWalletType",
    label: "Wallet Type",
    type: "select",
    sortable: true,
    options: [
      { value: "FIAT", label: "Fiat", color: "primary" },
      { value: "SPOT", label: "Spot", color: "info" },
      { value: "ECO", label: "Eco", color: "success" },
    ],
  },
  {
    field: "rewardCurrency",
    label: "Currency",
    type: "text",
    sortable: true,
  },
  {
    field: "status",
    label: "Status",
    type: "switch",
    sortable: true,
    api: `${api}/:id/status`,
  },
];
const MlmReferralConditions = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("MLM Referral Conditions")} color="muted">
      <DataTable
        title={t("MLM Referral Conditions")}
        endpoint={api}
        columnConfig={columnConfig}
        isParanoid={false}
        canDelete={false}
        canCreate={false}
      />
    </Layout>
  );
};
export default MlmReferralConditions;
export const permission = "Access MLM Referral Condition Management";
