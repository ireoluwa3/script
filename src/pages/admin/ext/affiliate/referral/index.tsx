"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/affiliate/referral";
const columnConfig: ColumnConfigType[] = [
  {
    field: "referrer",
    label: "Referrer",
    sublabel: "referrer.email",
    type: "text",
    getValue: (item) =>
      `${item.referrer?.firstName} ${item.referrer?.lastName}`,
    getSubValue: (item) => item.referrer?.email,
    path: "/admin/crm/user?email=[referrer.email]",
    sortable: true,
    sortName: "referrer.firstName",
    hasImage: true,
    imageKey: "referrer.avatar",
    placeholder: "/img/avatars/placeholder.webp",
    className: "rounded-full",
  },
  {
    field: "referred",
    label: "Referred",
    sublabel: "referred.email",
    type: "text",
    getValue: (item) =>
      `${item.referred?.firstName} ${item.referred?.lastName}`,
    getSubValue: (item) => item.referred?.email,
    path: "/admin/crm/user?email=[referred.email]",
    sortable: true,
    sortName: "referred.firstName",
    hasImage: true,
    imageKey: "referred.avatar",
    placeholder: "/img/avatars/placeholder.webp",
    className: "rounded-full",
  },
  {
    field: "status",
    label: "Status",
    type: "select",
    sortable: true,
    options: [
      { value: "PENDING", label: "Pending", color: "warning" },
      { value: "ACTIVE", label: "Approved", color: "success" },
      { value: "REJECTED", label: "Rejected", color: "danger" },
    ],
  },
];
const MlmReferrals = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("MLM Referrals")} color="muted">
      <DataTable
        title={t("MLM Referrals")}
        endpoint={api}
        columnConfig={columnConfig}
        hasAnalytics
      />
    </Layout>
  );
};
export default MlmReferrals;
export const permission = "Access MLM Referral Management";
