"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/ecommerce/discount";
const columnConfig: ColumnConfigType[] = [
  {
    field: "product",
    label: "Product",
    sublabel: "category",
    type: "text",
    getValue: (item) => item.product?.name,
    getSubValue: (item) => item.product?.category?.name,
    path: "/admin/ext/ecommerce/product?name=[product.name]",
    subpath: "/admin/ext/ecommerce/category?name=[product.category.name]",
    sortable: true,
    sortName: "product.name",
    hasImage: true,
    imageKey: "product.image",
    placeholder: "/img/placeholder.svg",
  },
  {
    field: "code",
    label: "Code",
    type: "text",
    sortable: true,
  },
  {
    field: "percentage",
    label: "Percentage",
    type: "number",
    sortable: true,
    getValue: (item) => item.percentage + "%",
  },
  {
    field: "validUntil",
    label: "Valid Until",
    type: "datetime",
    sortable: true,
    filterable: false,
  },
  {
    field: "status",
    label: "Status",
    type: "switch",
    sortable: false,
    api: `${api}/:id/status`,
  },
];
const EcommerceDiscounts = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Ecommerce Discounts")} color="muted">
      <DataTable
        title={t("Ecommerce Discounts")}
        endpoint={api}
        columnConfig={columnConfig}
        canView={false}
      />
    </Layout>
  );
};
export default EcommerceDiscounts;
export const permission = "Access Ecommerce Discount Management";
