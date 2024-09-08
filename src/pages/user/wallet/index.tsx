import Layout from "@/layouts/Default";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useWalletStore } from "@/stores/user/wallet";
import { useRouter } from "next/router";
import Card from "@/components/elements/base/card/Card";
import Avatar from "@/components/elements/base/avatar/Avatar";
import { Icon } from "@iconify/react";
import { WalletChart } from "@/components/charts/WalletChart";
import { DataTable } from "@/components/elements/base/datatable";
import { useDashboardStore } from "@/stores/dashboard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Button from "@/components/elements/base/button/Button";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { debounce } from "lodash";

const api = "/api/finance/wallet";
const columnConfig: ColumnConfigType[] = [
  {
    field: "currency",
    label: "Currency",
    type: "text",
    sortable: true,
    getValue: (row) => (
      <div className="flex items-center gap-3">
        <Avatar
          size="sm"
          src={
            row.type === "ECO"
              ? row.icon || "/img/placeholder.svg"
              : `/img/crypto/${row.currency?.toLowerCase()}.webp`
          }
          alt={row.currency}
        />
        <span>{row.currency}</span>
      </div>
    ),
  },
  {
    field: "balance",
    label: "Balance",
    type: "number",
    sortable: true,
  },
  {
    field: "inOrder",
    label: "In Order",
    type: "number",
    sortable: true,
  },
  {
    field: "type",
    label: "Type",
    type: "select",
    sortable: true,
    options: [
      { value: "FIAT", label: "Fiat", color: "warning" },
      { value: "SPOT", label: "Spot", color: "info" },
      { value: "ECO", label: "Funding", color: "primary" },
      { value: "FUTURES", label: "Futures", color: "success" },
    ],
  },
];

const WalletDashboard = () => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { pnl, fetchPnl } = useWalletStore();
  const router = useRouter();
  const [togglePnl, setTogglePnl] = useState(false);
  const { isDark, settings } = useDashboardStore();

  const debounceFetchPnl = debounce(fetchPnl, 100);
  useEffect(() => {
    if (!router.isReady) return;
    debounceFetchPnl();
    setLoading(false);
  }, [router.isReady]);

  const deposit = settings?.deposit !== "false";
  const withdraw = settings?.withdraw !== "false";
  const transfer = settings?.transfer !== "false";

  return (
    <Layout title={t("Wallets Dashboard")} color="muted">
      <Card className="mb-4 p-4 relative" color={"mutedContrast"}>
        <div className="flex justify-between items-start sm:items-center px-4 flex-col sm:flex-row gap-5 mb-6 sm:mb-0">
          <h1 className="font-sans text-xl font-light uppercase tracking-wide text-muted-800 dark:text-muted-200">
            {t("Estimated Balance")}
          </h1>
          <div className="flex justify-between items-center gap-10 w-full sm:w-auto">
            <div>
              <p className="text-lg font-semibold text-muted-800 dark:text-muted-200">
                {pnl?.today ? (
                  `$${pnl.today?.toFixed(2)}`
                ) : loading ? (
                  <Skeleton
                    width={60}
                    height={12}
                    baseColor={isDark ? "#27272a" : "#f7fafc"}
                    highlightColor={isDark ? "#3a3a3e" : "#edf2f7"}
                  />
                ) : (
                  "$0.00"
                )}
              </p>
              <p className="text-sm text-muted-500 dark:text-muted-400">
                {t("Total Balance")}
              </p>
            </div>
            <div>
              <p className="text-lg font-semibold text-muted-800 dark:text-muted-200">
                {pnl?.today ? (
                  <>
                    {pnl.today > pnl.yesterday && pnl.yesterday !== 0 ? (
                      <span className="flex items-center gap-2 text-green-500">
                        <span>+${(pnl.today - pnl.yesterday).toFixed(2)}</span>
                        <span className="text-md">
                          (+
                          {pnl.yesterday !== 0
                            ? (
                                ((pnl.today - pnl.yesterday) / pnl.yesterday) *
                                100
                              ).toFixed(2)
                            : "0"}
                          %)
                        </span>
                      </span>
                    ) : pnl.today < pnl.yesterday ? (
                      <span className="flex items-center gap-2 text-red-500">
                        <span>-${(pnl.yesterday - pnl.today).toFixed(2)}</span>
                        <span className="text-md">
                          (-
                          {pnl.yesterday !== 0
                            ? (
                                ((pnl.yesterday - pnl.today) / pnl.yesterday) *
                                100
                              ).toFixed(2)
                            : 0}
                          %)
                        </span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-gray-500">
                        <span>$0.00</span>
                        <span className="text-md">(0.00%)</span>
                      </span>
                    )}
                  </>
                ) : loading ? (
                  <Skeleton
                    width={60}
                    height={12}
                    baseColor={isDark ? "#27272a" : "#f7fafc"}
                    highlightColor={isDark ? "#3a3a3e" : "#edf2f7"}
                  />
                ) : (
                  "$0.00"
                )}
              </p>
              <p className="text-sm text-muted-500 dark:text-muted-400">
                {t("Today's PnL")}
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 left-[50%] border-t border-x bg-muted-50 dark:bg-muted-900 hover:bg-muted-200 hover:dark:bg-muted-950 text-muted-400 dark:text-muted-400 hover:text-muted-600 dark:hover:text-muted-300 cursor-pointer border-muted-200 dark:border-muted-700 transform -translate-x-1/2 w-12 flex items-center justify-center rounded-t-md">
            <Icon
              icon={togglePnl ? "mdi:chevron-up" : "mdi:chevron-down"}
              className="h-6 w-6 "
              onClick={() => setTogglePnl(!togglePnl)}
            />
          </div>
        </div>
        <AnimatePresence>
          {togglePnl && pnl?.chart && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
            >
              <WalletChart data={pnl.chart} />
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      <div className="mt-4">
        <DataTable
          title={t("Wallets")}
          postTitle=""
          endpoint={api}
          columnConfig={columnConfig}
          hasStructure={false}
          canDelete={false}
          canEdit={false}
          canCreate={false}
          viewPath="/user/wallet/[type]/[currency]"
          blank={false}
          isParanoid={false}
          navSlot={
            <div className="flex gap-2">
              {deposit && (
                <Link href="/user/wallet/deposit">
                  <Button color="primary" variant="outlined" shape={"rounded"}>
                    {t("Deposit")}
                  </Button>
                </Link>
              )}
              {withdraw && (
                <Link href="/user/wallet/withdraw">
                  <Button color="warning" variant="outlined" shape={"rounded"}>
                    {t("Withdraw")}
                  </Button>
                </Link>
              )}
              {transfer && (
                <Link href="/user/wallet/transfer">
                  <Button color="info" variant="outlined" shape={"rounded"}>
                    {t("Transfer")}
                  </Button>
                </Link>
              )}
            </div>
          }
        />
      </div>
    </Layout>
  );
};

export default WalletDashboard;
