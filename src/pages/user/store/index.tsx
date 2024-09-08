"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
import { BackButton } from "@/components/elements/base/button/BackButton";
const api = "/api/ext/ecommerce/order";
const columnConfig: ColumnConfigType[] = [
  {
    field: "id",
    label: "ID",
    type: "text",
    sortable: true,
  },
  {
    field: "products",
    label: "Products",
    type: "tags",
    key: "name",
    sortable: false,
    filterable: false,
  },
  {
    field: "status",
    label: "Status",
    type: "select",
    sortable: true,
    options: [
      { value: "PENDING", label: "Pending", color: "warning" },
      { value: "COMPLETED", label: "Completed", color: "success" },
      { value: "CANCELLED", label: "Cancelled", color: "danger" },
      { value: "REJECTED", label: "Rejected", color: "muted" },
    ],
  },
];
const EcommerceOrders = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Store Orders")} color="muted">
      <DataTable
        title={t("Store Orders")}
        endpoint={api}
        columnConfig={columnConfig}
        canCreate={false}
        canDelete={false}
        canEdit={false}
        hasStructure={false}
        viewPath="/user/store/[id]"
        hasAnalytics
        navSlot={
          <>
            <BackButton size="lg" href={"/store"}>
              {t("Back to Store")}
            </BackButton>
          </>
        }
      />
    </Layout>
  );
};
export default EcommerceOrders;
