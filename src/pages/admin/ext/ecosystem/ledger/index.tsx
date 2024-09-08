"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/ecosystem/ledger";
const columnConfig: ColumnConfigType[] = [
  {
    field: "user",
    label: "User",
    sublabel: "wallet.user.email",
    type: "text",
    getValue: (item) =>
      `${item.wallet?.user?.firstName} ${item.wallet?.user?.lastName}`,
    getSubValue: (item) => item.wallet?.user?.email,
    path: "/admin/crm/user?email=[wallet.user.email]",
    sortable: true,
    sortName: "wallet.user.firstName",
    hasImage: true,
    imageKey: "wallet.user.avatar",
    placeholder: "/img/avatars/placeholder.webp",
    className: "rounded-full",
  },
  {
    field: "currency",
    label: "Currency",
    sublabel: "chain",
    type: "text",
    sortable: true,
  },
  {
    field: "network",
    label: "Network",
    type: "text",
    sortable: true,
  },
  {
    field: "offchainDifference",
    label: "Offchain Difference",
    type: "number",
    sortable: true,
    precision: 2,
  },
];
const PrivateLedgers = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Ecosystem Private Ledgers")} color="muted">
      <DataTable
        title={t("Private Ledgers")}
        endpoint={api}
        columnConfig={columnConfig}
        canCreate={false}
        canEdit={false}
        canDelete={false}
      />
    </Layout>
  );
};
export default PrivateLedgers;
export const permission = "Access Ecosystem Private Ledger Management";
