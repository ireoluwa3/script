"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/layouts/Default";
import { useTranslation } from "next-i18next";
import $fetch from "@/utils/api";
import { ObjectTable } from "@/components/elements/base/object-table";
import { useRouter } from "next/router";
import IconBox from "@/components/elements/base/iconbox/IconBox";
const api = "/api/admin/system/cron";
const columnConfig: ColumnConfigType[] = [
  {
    field: "title",
    label: "Title",
    type: "text",
    sortable: true,
  },
  {
    field: "description",
    label: "Description",
    type: "text",
    sortable: true,
  },
  {
    field: "period",
    label: "Every",
    type: "text",
    sortable: true,
    getValue: (item) => {
      return item.period ? `${item.period / 60000} minutes` : "Never";
    },
  },
  {
    field: "lastRun",
    label: "Last Run",
    type: "text",
    sortable: true,
    getValue: (item) => {
      return item.lastRun ? new Date(item.lastRun).toLocaleString() : "Never";
    },
  },
];
const Log = () => {
  const { t } = useTranslation();
  const [items, setItems] = useState<Record<string, any>[]>([]);
  const fetchCron = async () => {
    const { data, error } = await $fetch({
      url: api,
      silent: true,
    });
    if (!error) {
      setItems(data);
    }
  };
  const router = useRouter();
  useEffect(() => {
    if (router.isReady) {
      fetchCron();
    }
  }, [router.isReady]);
  const runCron = async () => {
    const { error } = await $fetch({
      url: `/api/cron`,
    });
    if (!error) {
      fetchCron();
    }
  };
  return (
    <Layout title={t("Cron Jobs Monitor")} color="muted">
      <ObjectTable
        title={t("Cron Jobs")}
        items={items}
        setItems={setItems}
        columnConfig={columnConfig}
        shape="rounded"
        size="sm"
        filterField="title"
        initialPerPage={20}
        navSlot={
          <IconBox
            color="primary"
            onClick={() => runCron()}
            shape={"rounded"}
            size={"sm"}
            variant={"pastel"}
            className="cursor-pointer hover:shadow transition-all duration-300 ease-in-out hover:shadow-muted-300/30 dark:hover:shadow-muted-800/20 hover:bg-primary-500 hover:text-muted-100"
            icon="lucide:play"
          />
        }
      />
    </Layout>
  );
};
export default Log;
export const permission = "Access Cron Job Management";
