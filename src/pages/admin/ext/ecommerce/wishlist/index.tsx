"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/ecommerce/wishlist";
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
    field: "products",
    label: "Products",
    type: "tags",
    key: "name",
    sortable: false,
    filterable: false,
    path: "/admin/ext/ecommerce/product?name={name}",
  },
];
const EcommerceWishlists = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Ecommerce Wishlists")} color="muted">
      <DataTable
        title={t("Ecommerce Wishlists")}
        endpoint={api}
        columnConfig={columnConfig}
        hasStructure={false}
        canCreate={false}
        canView={false}
        canEdit={false}
      />
    </Layout>
  );
};
export default EcommerceWishlists;
export const permission = "Access Ecommerce Wishlist Management";
