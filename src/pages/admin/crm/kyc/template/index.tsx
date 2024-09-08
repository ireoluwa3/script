"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { useTranslation } from "next-i18next";
import IconBox from "@/components/elements/base/iconbox/IconBox";
import Link from "next/link";
const api = "/api/admin/crm/kyc/template";
const columnConfig = [
  {
    field: "title",
    label: "Title",
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
const KYCTemplates = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("KYC Templates Management")} color="muted">
      <DataTable
        title={t("KYC Templates")}
        endpoint={api}
        columnConfig={columnConfig}
        canCreate={false}
        canView={false}
        isParanoid={false}
        editPath="/admin/crm/kyc/template/[id]"
        onlySingleActiveStatus
        navSlot={
          <>
            <Link href="/admin/crm/kyc/template/create">
              <IconBox
                variant={"pastel"}
                icon={"mdi:plus"}
                color={"success"}
                shape="rounded"
                className="cursor-pointer"
              />
            </Link>
          </>
        }
      />
    </Layout>
  );
};
export default KYCTemplates;
export const permission = "Access KYC Template Management";
