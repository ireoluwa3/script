"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/mailwizard/template";
const columnConfig: ColumnConfigType[] = [
  {
    field: "name",
    label: "Template Name",
    type: "text",
    sortable: true,
  },
];
const MailwizardTemplates = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Mailwizard Templates")} color="muted">
      <DataTable
        title={t("Mailwizard Templates")}
        endpoint={api}
        columnConfig={columnConfig}
        editPath="/admin/ext/mailwizard/template/[id]"
        canView={false}
        canImport
      />
    </Layout>
  );
};
export default MailwizardTemplates;
export const permission = "Access Mailwizard Template Management";
