"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
import $fetch from "@/utils/api";
import Button from "@/components/elements/base/button/Button";
import { Icon } from "@iconify/react";
import { useDataTable } from "@/stores/datatable";
const api = "/api/admin/system/log";
const columnConfig: ColumnConfigType[] = [
  // category
  {
    field: "category",
    label: "Category",
    sublabel: "file",
    type: "text",
    sortable: true,
  },
  // timestamp
  {
    field: "timestamp",
    label: "Timestamp",
    type: "datetime",
    sortable: true,
    filterable: false,
  },
  {
    field: "level",
    label: "Level",
    type: "select",
    sortable: true,
    options: [
      {
        label: "Error",
        value: "error",
        color: "danger",
      },
      {
        label: "Warn",
        value: "warn",
        color: "warning",
      },
      {
        label: "Info",
        value: "info",
        color: "info",
      },
      {
        label: "Debug",
        value: "debug",
      },
    ],
  },
  // message
  {
    field: "message",
    label: "Message",
    type: "text",
    sortable: true,
  },
];
const Log = () => {
  const { t } = useTranslation();
  const { fetchData } = useDataTable();

  const cleanLogs = async () => {
    const { data, error } = await $fetch({
      url: "/api/admin/system/log/clean",
      method: "DELETE",
    });

    if (!error) {
      fetchData();
    }
  };
  return (
    <Layout title={t("Log Monitor")} color="muted">
      <DataTable
        title={t("Log")}
        endpoint={api}
        columnConfig={columnConfig}
        isParanoid={false}
        canCreate={false}
        canEdit={false}
        canView={false}
        hasStructure={false}
        navSlot={
          <>
            <Button onClick={cleanLogs} color="danger" shape={"rounded"}>
              <Icon icon="mdi:delete" />
              {t("Clean Logs")}
            </Button>
          </>
        }
      />
    </Layout>
  );
};
export default Log;
export const permission = "Access Log Monitor";
