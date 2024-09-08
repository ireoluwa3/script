import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/ecosystem/wallet/master";
const columnConfig = [
  {
    field: "chain",
    label: "Chain",
    sublabel: "address",
    type: "text",
    sortable: true,
    hasImage: true,
    imageKey: "chain",
    getImage: (item) => `/img/crypto/${item.chain?.toLowerCase()}.webp`,
  },
  {
    field: "status",
    label: "Status",
    type: "switch",
    sortable: true,
    api: `${api}/:id/status`,
  },
];
const MasterWallets = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Ecosystem Master Wallets")} color="muted">
      <DataTable
        title={t("Master Wallets")}
        endpoint={api}
        columnConfig={columnConfig}
        isParanoid={false}
        canDelete={false}
        canEdit={false}
      />
    </Layout>
  );
};
export default MasterWallets;
export const permission = "Access Ecosystem Master Wallet Management";
