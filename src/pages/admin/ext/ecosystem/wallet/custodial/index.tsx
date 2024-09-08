"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/ecosystem/wallet/custodial";
const columnConfig: ColumnConfigType[] = [
  {
    field: "masterWallet",
    label: "Master Wallet",
    type: "text",
    getValue: (item) => `${item.masterWallet?.chain}`,
    sortable: true,
  },
  {
    field: "address",
    label: "Address",
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
    field: "status",
    label: "Status",
    type: "select",
    sortable: true,
    options: [
      { value: "ACTIVE", label: "Active", color: "success" },
      { value: "INACTIVE", label: "Inactive", color: "warning" },
      { value: "SUSPENDED", label: "Suspended", color: "danger" },
    ],
  },
];
const CustodialWallets = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Ecosystem Custodial Wallets")} color="muted">
      <DataTable
        title={t("Custodial Wallets")}
        endpoint={api}
        columnConfig={columnConfig}
        canEdit={true}
        canDelete={false}
        isParanoid={false}
        viewPath="/admin/ext/ecosystem/wallet/custodial/[id]"
      />
    </Layout>
  );
};
export default CustodialWallets;
export const permission = "Access Ecosystem Custodial Wallet Management";
