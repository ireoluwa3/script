"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { capitalize } from "lodash";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/ecommerce/product";
const columnConfig: ColumnConfigType[] = [
  {
    field: "name",
    label: "Name",
    type: "text",
    sortable: true,
    hasImage: true,
    imageKey: "image",
    placeholder: "/img/placeholder.svg",
    getValue: (item) => capitalize(item.name),
  },
  {
    field: "category",
    label: "Category",
    type: "tag",
    getValue: (item) => capitalize(item.category?.name),
    color: "primary",
    path: "/admin/ext/ecommerce/category?name=[name]",
    sortable: true,
    sortName: "category.name",
  },
  {
    field: "type",
    label: "Type",
    type: "text",
    sortable: true,
    getValue: (item) => capitalize(item.type),
  },
  {
    field: "ecommerceReviews",
    label: "Rating",
    type: "rating",
    getValue: (data) => {
      if (!data.ecommerceReviews.length) return 0;
      const rating = data.ecommerceReviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      return rating / data.ecommerceReviews.length;
    },
    sortable: true,
    sortName: "ecommerceReviews.rating",
  },
  {
    field: "price",
    label: "Price",
    type: "number",
    sortable: true,
    getValue: (item) => `${item.price} ${item.currency}`,
  },
  {
    field: "inventoryQuantity",
    label: "Stock",
    type: "number",
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
const EcommerceProducts = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Ecommerce Products")} color="muted">
      <DataTable
        title={t("Ecommerce Products")}
        endpoint={api}
        columnConfig={columnConfig}
        hasAnalytics
      />
    </Layout>
  );
};
export default EcommerceProducts;
export const permission = "Access Ecommerce Product Management";
