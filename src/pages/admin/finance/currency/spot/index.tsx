"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
import { Icon } from "@iconify/react";
import Button from "@/components/elements/base/button/Button";
import Alert from "@/components/elements/base/alert/Alert";
import { useRouter } from "next/router";
import { useDataTable } from "@/stores/datatable";
import $fetch from "@/utils/api";
const api = "/api/admin/finance/currency/spot";

const columnConfig: ColumnConfigType[] = [
  {
    field: "currency",
    sublabel: "name",
    label: "Currency",
    type: "text",
    sortable: true,
    sortName: "currency",
    getValue: (row) => row.currency,
    getSubValue: (row) => row.name,
  },
  {
    field: "precision",
    label: "Precision",
    type: "number",
    sortable: true,
  },
  {
    field: "price",
    label: "Price",
    type: "number",
    sortable: true,
    getValue: (item) => (
      <span
        className={
          item.price
            ? "text-muted-800 dark:text-gray-200"
            : "text-muted-400 dark:text-gray-500"
        }
      >
        {item.price || "N/A"}
      </span>
    ),
  },
  {
    field: "status",
    label: "Status",
    type: "switch",
    sortable: false,
    api: `${api}/:id/status`,
  },
];

const SpotCurrencies = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { fetchData } = useDataTable();
  const [loading, setLoading] = useState(false);
  const [missingCurrencies, setMissingCurrencies] = useState<
    { id: string; currency: string }[]
  >([]);

  const importCurrency = async () => {
    setLoading(true);
    const { error } = await $fetch({
      url: `${api}/import`,
    });
    if (!error) {
      fetchData();
    }
    setLoading(false);
  };

  const fetchMissingCurrency = async () => {
    setLoading(true);
    const { data, error } = await $fetch({
      url: `${api}/missing`,
      silent: true,
    });
    if (!error) {
      setMissingCurrencies(data);
    }
    setLoading(false);
  };

  const activateMissingCurrencies = async () => {
    setLoading(true);
    const { error } = await $fetch({
      url: `${api}/status`,
      method: "PUT",
      body: {
        ids: missingCurrencies.map((currency) => currency.id),
        status: true,
      },
    });
    if (!error) {
      fetchData();
      setMissingCurrencies([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (router.isReady) fetchMissingCurrency();
  }, [router.isReady]);

  return (
    <Layout title={t("Spot Currencies Management")} color="muted">
      {missingCurrencies.length > 0 && (
        <div className="mb-4">
          <Alert
            color="danger"
            sublabel={t(
              "There are missing currencies that need to be activated."
            )}
            canClose={false}
          >
            <div className="flex justify-between items-center gap-2 text-sm w-full">
              <div className="flex items-center gap-2">
                <Icon
                  icon="mdi:alert-circle"
                  className="text-danger-500 h-8 w-8"
                />
                <div>
                  <h2 className="text-lg">{t("Missing Currencies")}</h2>
                  <div>
                    <span className="mr-2">
                      {t(
                        "The following currencies are missing from the system:"
                      )}
                    </span>
                    <p className="inline">
                      {missingCurrencies.map((currency, index) => (
                        <span key={currency.id}>
                          {currency.currency}
                          {index < missingCurrencies.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <Button
                  type="button"
                  color="success"
                  onClick={activateMissingCurrencies}
                  loading={loading}
                  disabled={loading}
                >
                  <span>{t("Activate Missing Currencies")}</span>
                </Button>
              </div>
            </div>
          </Alert>
        </div>
      )}
      <DataTable
        title={t("Spot Currencies")}
        endpoint={api}
        columnConfig={columnConfig}
        isParanoid={false}
        canCreate={false}
        canEdit={false}
        canView={false}
        navSlot={
          <>
            <Button
              type="button"
              color="primary"
              onClick={importCurrency}
              loading={loading}
              disabled={loading}
            >
              <Icon icon="mdi:plus" className={`"h-6 w-6`} />
              <span>{t("Import")}</span>
            </Button>
            <Button
              onClick={() => {
                router.back();
              }}
              type="button"
              color="muted"
            >
              <Icon icon="line-md:chevron-left" className={`"h-4 w-4 mr-2`} />
              <span>{t("Back")}</span>
            </Button>
          </>
        }
      />
    </Layout>
  );
};

export default SpotCurrencies;
export const permission = "Access Spot Currency Management";
