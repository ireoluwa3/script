import Layout from "@/layouts/Default";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import $fetch from "@/utils/api";
import { useTranslation } from "next-i18next";
import { debounce } from "lodash";
import { ObjectTable } from "@/components/elements/base/object-table";
import IconBox from "@/components/elements/base/iconbox/IconBox";
const api = "/api/admin/finance/exchange/balance";
interface Balance {
  asset: string;
  available: number;
  inOrder: number;
  total: number;
}
const columnConfig: ColumnConfigType[] = [
  {
    field: "asset",
    label: "Asset",
    type: "string",
    sortable: true,
  },
  {
    field: "available",
    label: "Available Balance",
    type: "number",
    precision: 8,
    sortable: true,
  },
  {
    field: "inOrder",
    label: "In Order Balance",
    type: "number",
    precision: 8,
    sortable: true,
  },
  {
    field: "total",
    label: "Total Balance",
    type: "number",
    precision: 8,
    sortable: true,
  },
];
const ExchangeBalanceDashboard: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [balances, setBalances] = useState<Balance[]>([]);
  const fetchExchangeBalance = async () => {
    const { data, error } = await $fetch({
      url: api,
      silent: true,
    });
    if (!error) {
      setBalances(data.balance);
    }
  };
  const debounceFetchExchangeBalance = debounce(fetchExchangeBalance, 100);
  useEffect(() => {
    if (router.isReady) {
      debounceFetchExchangeBalance();
    }
  }, [router.isReady]);
  return (
    <Layout title={t("Exchange Balance")} color="muted">
      <ObjectTable
        title={t("Exchange Balance")}
        items={balances}
        setItems={setBalances}
        columnConfig={columnConfig}
        navSlot={
          <IconBox
            color="primary"
            onClick={() => fetchExchangeBalance()}
            size={"sm"}
            shape={"rounded"}
            variant={"pastel"}
            className="cursor-pointer hover:shadow transition-all duration-300 ease-in-out hover:shadow-muted-300/30 dark:hover:shadow-muted-800/20 hover:bg-primary-500 hover:text-muted-100"
            icon="mdi:refresh"
          />
        }
        shape="rounded"
        size="sm"
        filterField="asset"
        initialPerPage={20}
      />
    </Layout>
  );
};
export default ExchangeBalanceDashboard;
export const permission = "Access Exchange Balance Management";
