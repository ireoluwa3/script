"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { capitalize } from "lodash";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/faq/question";
const columnConfig: ColumnConfigType[] = [
  {
    field: "question",
    label: "Question",
    type: "text",
    sortable: true,
    maxLength: 50,
  },
  {
    field: "answer",
    label: "Answer",
    type: "text",
    sortable: false,
    maxLength: 50,
  },
  {
    field: "faqCategory.id",
    label: "Category",
    type: "text",
    sortable: true,
    sortName: "faqCategory.id",
    getValue: (row) => capitalize(row.faqCategory?.id),
    path: "/admin/ext/faq/category?id=[faqCategory.id]",
  },
];
const FAQs = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("FAQ Management")} color="muted">
      <DataTable title={t("FAQs")} endpoint={api} columnConfig={columnConfig} />
    </Layout>
  );
};
export default FAQs;
export const permission = "Access FAQ Management";
