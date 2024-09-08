"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/crm/kyc/applicant";
const columnConfig: ColumnConfigType[] = [
  {
    field: "user",
    label: "User",
    sublabel: "user.email",
    type: "text",
    getValue: (item) => `${item.user?.firstName} ${item.user?.lastName}`,
    getSubValue: (item) => item.user?.email,
    path: "/admin/crm/user?email=[user.email]",
    sortable: true,
    sortName: "user.firstName",
    hasImage: true,
    imageKey: "user.avatar",
    placeholder: "/img/avatars/placeholder.webp",
    className: "rounded-full",
  },
  {
    field: "level",
    label: "Level",
    type: "number",
    sortable: true,
  },
  {
    field: "status",
    label: "Status",
    type: "select",
    sortable: true,
    options: [
      { value: "PENDING", label: "Pending", color: "warning" },
      { value: "APPROVED", label: "Approved", color: "success" },
      { value: "REJECTED", label: "Rejected", color: "danger" },
    ],
    placeholder: "Select status",
  },
];
const KycApplications = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("KYC Applications Management")} color="muted">
      <DataTable
        title={t("KYC Applications")}
        endpoint={api}
        columnConfig={columnConfig}
        canCreate={false}
        canEdit={false}
        viewPath="/admin/crm/kyc/applicant/[id]"
        hasAnalytics
      />
    </Layout>
  );
};
export default KycApplications;
export const permission = "Access KYC Application Management";
