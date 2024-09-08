import Layout from "@/layouts/Default";
import React from "react";
import { useRouter } from "next/router";
import Avatar from "@/components/elements/base/avatar/Avatar";
import { DataTable } from "@/components/elements/base/datatable";
import "react-loading-skeleton/dist/skeleton.css";
import Link from "next/link";
import Button from "@/components/elements/base/button/Button";
import { useTranslation } from "next-i18next";
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
];
const WalletDashboard = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { walletType } = router.query;
  return (
    <Layout title={t("Wallets Dashboard")} color="muted">
      {walletType && (
        <DataTable
          title={`${walletType}`}
          postTitle={t("Wallets")}
          endpoint={api}
          columnConfig={columnConfig}
          hasStructure={false}
          canDelete={false}
          canEdit={false}
          canCreate={false}
          viewPath="/user/wallet/[type]/[currency]"
          blank={false}
          navSlot={
            <div className="flex items-center gap-2">
              {[
                { value: "", label: "ALL", color: "muted" },
                { value: "FIAT", label: "Fiat", color: "warning" },
                { value: "SPOT", label: "Spot", color: "info" },
                { value: "ECO", label: "Funding", color: "primary" },
              ]
                .filter((option) => option.value !== walletType)
                .map((option) => (
                  <Link
                    href={`/user/wallet/${option.value}`}
                    key={option.value}
                  >
                    <Button
                      key={option.value}
                      color={option.color as any}
                      variant={
                        option.value === router.query.walletType
                          ? "solid"
                          : "outlined"
                      }
                    >
                      {option.label}
                    </Button>
                  </Link>
                ))}
            </div>
          }
        />
      )}
    </Layout>
  );
};
export default WalletDashboard;
