"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { formatDate } from "date-fns";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/forex/signal";
const columnConfig: ColumnConfigType[] = [
  {
    field: "title",
    label: "Title",
    sublabel: "createdAt",
    type: "text",
    sortable: true,
    hasImage: true,
    imageKey: "image",
    placeholder: "/img/placeholder.svg",
    getSubValue: (item) => formatDate(new Date(item.createdAt), "MMM dd, yyyy"),
  },
  {
    field: "status",
    label: "Status",
    type: "switch",
    sortable: true,
    api: `${api}/:id/status`,
  },
];
const ForexSignals = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Forex Signals")} color="muted">
      <DataTable
        title={t("Forex Signals")}
        endpoint={api}
        columnConfig={columnConfig}
        canView={false}
        hasAnalytics
      />
    </Layout>
  );
};
export default ForexSignals;
export const permission = "Access Forex Signal Management";
