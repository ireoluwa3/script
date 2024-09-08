"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const columnConfig: ColumnConfigType[] = [
  {
    field: "subject",
    label: "Subject",
    type: "text",
    sortable: true,
  },
  {
    field: "email",
    label: "Email",
    type: "select",
    sortable: false,
    options: [
      { value: true, label: "Yes", color: "success" },
      { value: false, label: "No", color: "danger" },
    ],
  },
  {
    field: "sms",
    label: "SMS",
    type: "select",
    sortable: false,
    options: [
      { value: true, label: "Yes", color: "success" },
      { value: false, label: "No", color: "danger" },
    ],
  },
  {
    field: "push",
    label: "Push",
    type: "select",
    sortable: false,
    options: [
      { value: true, label: "Yes", color: "success" },
      { value: false, label: "No", color: "danger" },
    ],
  },
];
const NotificationTemplates = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Notification Templates Management")} color="muted">
      <DataTable
        title={t("Notification Templates")}
        endpoint="/api/admin/system/notification/template"
        columnConfig={columnConfig}
        formSize="sm"
        isParanoid={false}
        canCreate={false}
        canView={false}
        canDelete={false}
        editPath="/admin/system/notification/template/[id]"
      />
    </Layout>
  );
};
export default NotificationTemplates;
export const permission = "Access Notification Template Management";
