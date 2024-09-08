"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/ecommerce/order";
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
    path: "/admin/ext/ecommerce/product?name=[name]",
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
    <Layout title={t("Ecommerce Orders")} color="muted">
      <DataTable
        title={t("Ecommerce Orders")}
        endpoint={api}
        columnConfig={columnConfig}
        canCreate={false}
        canEdit={false}
        viewPath="/admin/ext/ecommerce/order/[id]"
        hasAnalytics
      />
    </Layout>
  );
};
export default EcommerceOrders;
export const permission = "Access Ecommerce Order Management";
