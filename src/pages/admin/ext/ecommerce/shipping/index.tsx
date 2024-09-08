"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/ecommerce/shipping";
const columnConfig: ColumnConfigType[] = [
  {
    field: "loadId",
    label: "ID",
    type: "text",
    sortable: true,
  },
  {
    field: "shipper",
    label: "Shipper",
    type: "text",
    sortable: true,
  },
  {
    field: "transporter",
    label: "Transporter",
    type: "text",
    sortable: true,
  },
  {
    field: "deliveryDate",
    label: "Delivery",
    type: "datetime",
    sortable: true,
  },
  {
    field: "loadStatus",
    label: "Status",
    type: "select",
    sortable: true,
    options: [
      { value: "PENDING", label: "Pending", color: "warning" },
      { value: "TRANSIT", label: "In Transit", color: "info" },
      { value: "DELIVERED", label: "Delivered", color: "success" },
      { value: "CANCELLED", label: "Cancelled", color: "danger" },
    ],
  },
];
const EcommerceShipping = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Ecommerce Shipping")} color="muted">
      <DataTable
        title={t("Ecommerce Shipping")}
        endpoint={api}
        columnConfig={columnConfig}
      />
    </Layout>
  );
};
export default EcommerceShipping;
export const permission = "Access Ecommerce Shipping Management";
