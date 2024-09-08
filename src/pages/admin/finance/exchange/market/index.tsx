"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";
import Button from "@/components/elements/base/button/Button";
import $fetch from "@/utils/api";
import { useDataTable } from "@/stores/datatable";
import ButtonLink from "@/components/elements/base/button-link/ButtonLink";
const api = "/api/admin/finance/exchange/market";
const columnConfig: ColumnConfigType[] = [
  {
    field: "currency",
    label: "Currency",
    type: "text",
    sortable: true,
    getValue: (item) => item.currency?.toUpperCase(),
    sortName: "currency",
  },
  {
    field: "pair",
    label: "Pair",
    type: "text",
    sortable: true,
    getValue: (item) => item.pair?.toUpperCase(),
    sortName: "pair",
  },
  {
    field: "isTrending",
    label: "Trending",
    type: "select",
    sortable: true,
    options: [
      { value: true, label: "Yes", color: "success" },
      { value: false, label: "No", color: "danger" },
    ],
  },
  {
    field: "isHot",
    label: "Hot",
    type: "select",
    sortable: true,
    options: [
      { value: true, label: "Yes", color: "success" },
      { value: false, label: "No", color: "danger" },
    ],
  },
  {
    field: "status",
    label: "Status",
    type: "switch",
    sortable: true,
    api: `${api}/:id/status`,
  },
];
const Markets = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { fetchData } = useDataTable();
  const [loading, setLoading] = React.useState(false);
  const importMarket = async () => {
    setLoading(true);
    const { error } = await $fetch({
      url: `${api}/import`,
    });
    if (!error) {
      fetchData();
    }
    setLoading(false);
  };
  return (
    <Layout title={t("Exchange Markets")} color="muted">
      <DataTable
        title={t("Markets")}
        endpoint={api}
        columnConfig={columnConfig}
        canCreate={false}
        navSlot={
          <>
            <Button
              type="button"
              color="primary"
              onClick={importMarket}
              loading={loading}
              disabled={loading}
            >
              <Icon icon="mdi:plus" className={`"h-6 w-6`} />
              <span>{t("Import")}</span>
            </Button>
            <ButtonLink
              href="/admin/finance/exchange"
              type="button"
              color="muted"
            >
              <Icon icon="line-md:chevron-left" className={`"h-4 w-4 mr-2`} />
              <span>{t("Back")}</span>
            </ButtonLink>
          </>
        }
      />
    </Layout>
  );
};
export default Markets;
export const permission = "Access Exchange Market Management";
