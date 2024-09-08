"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/ecommerce/review";
const columnConfig: ColumnConfigType[] = [
  {
    field: "user",
    label: "User",
    sublabel: "user.email",
    type: "text",
    getValue: (item) => `${item.user?.firstName} ${item.user?.lastName}`,
    getSubValue: (item) => item.user?.email,
    path: "/admin/crm/user?email=[user.email]",
    sortable: true,
    sortName: "user.firstName",
    hasImage: true,
    imageKey: "user.avatar",
    placeholder: "/img/avatars/placeholder.webp",
    className: "rounded-full",
  },
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
    field: "rating",
    label: "Rating",
    type: "rating",
    sortable: true,
  },
  {
    field: "comment",
    label: "Comment",
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
const EcommerceReviews = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Ecommerce Reviews")} color="muted">
      <DataTable
        title={t("Ecommerce Reviews")}
        endpoint={api}
        columnConfig={columnConfig}
        hasAnalytics
        canCreate={false}
        canView={false}
      />
    </Layout>
  );
};
export default EcommerceReviews;
export const permission = "Access Ecommerce Review Management";
