"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/ext/affiliate/referral";
const columnConfig: ColumnConfigType[] = [
  {
    field: "referred",
    label: "Referred",
    sublabel: "referred.email",
    type: "text",
    getValue: (item) =>
      `${item.referred?.firstName} ${item.referred?.lastName}`,
    getSubValue: (item) => item.referred?.email,
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
        title={t("MLM")}
        postTitle={t("Referrals")}
        endpoint={api}
        columnConfig={columnConfig}
        isCrud={false}
        hasStructure={false}
        hasAnalytics
      />
    </Layout>
  );
};
export default MlmReferrals;
