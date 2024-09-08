"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
import Alert from "@/components/elements/base/alert/Alert";
const api = "/api/admin/finance/exchange/provider";
const columnConfig: ColumnConfigType[] = [
  {
    field: "name",
    label: "Name",
    type: "text",
    sortable: true,
  },
  {
    field: "title",
    label: "Title",
    type: "text",
    sortable: true,
  },
  {
    field: "status",
    label: "Status",
    type: "switch",
    sortable: false,
    api: `${api}/:id/status`,
  },
];
const Exchanges = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Exchange Management")} color="muted">
      <DataTable
        title={t("Exchanges")}
        endpoint={api}
        columnConfig={columnConfig}
        canDelete={false}
        canEdit={false}
        canCreate={false}
        isParanoid={false}
        viewPath="/admin/finance/exchange/provider/[productId]"
        hasStructure={false}
        onlySingleActiveStatus={true}
      />
      <div className="mt-8">
        <Alert
          label={<div className="text-xl">{t("Important Notice")}</div>}
          sublabel={
            <div className="text-md">
              {t(
                "After activating an exchange for the first time or changing the active exchange, you have to import markets and currencies again."
              )}
              <br />
              {t(
                "You need to view the exchange to check its status, credentials, and connection status."
              )}
            </div>
          }
          color="info"
          canClose={false}
        />
      </div>
    </Layout>
  );
};
export default Exchanges;
export const permission = "Access Exchange Provider Management";
