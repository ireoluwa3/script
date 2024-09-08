"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { addDays, format } from "date-fns";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/staking/log";
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
    field: "pool.name",
    label: "Pool",
    sublabel: "pool.currency",
    type: "text",
    sortable: true,
    sortName: "pool.name",
    hasImage: true,
    imageKey: "pool.icon",
    placeholder: "/img/placeholder.svg",
    className: "rounded-full",
    getValue: (item) => item.pool?.name,
    getSubValue: (item) => item.pool?.currency,
  },
  {
    field: "createdAt",
    label: "Start Date",
    type: "text",
    sortable: true,
    getValue: (item) =>
      `${format(new Date(item.createdAt), "dd MMM yyyy HH:mm")}`,
  },
  {
    field: "durationId",
    label: "End Date",
    type: "text",
    sortable: true,
    getValue: (item) =>
      item.duration
        ? format(
            addDays(
              new Date(item.createdAt || new Date()),
              item.duration.duration
            ),
            "dd MMM yyyy HH:mm"
          )
        : "N/A",
  },
  {
    field: "amount",
    label: "Amount",
    type: "number",
    sortable: true,
  },
  {
    field: "duration.interestRate",
    label: "ROI",
    type: "number",
    sortable: true,
    getValue: (item) =>
      item.duration?.interestRate
        ? `${item.amount * (item.duration?.interestRate / 100)}`
        : "N/A",
  },
  {
    field: "status",
    label: "Status",
    type: "select",
    sortable: true,
    options: [
      { value: "ACTIVE", label: "Active", color: "primary" },
      { value: "RELEASED", label: "Released", color: "info" },
      { value: "COLLECTED", label: "Collected", color: "success" },
    ],
  },
];
const StakingLogs = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Staking Logs")} color="muted">
      <DataTable
        title={t("Staking Logs")}
        endpoint={api}
        columnConfig={columnConfig}
        canCreate={false}
        hasAnalytics
      />
    </Layout>
  );
};
export default StakingLogs;
export const permission = "Access Staking Management";
