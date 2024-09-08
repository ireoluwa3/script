import Layout from "@/layouts/Default";
import React from "react";
import { DataTable } from "@/components/elements/base/datatable";
import { BackButton } from "@/components/elements/base/button/BackButton";
import { useTranslation } from "next-i18next";
const api = "/api/ext/ico/contribution";
const columnConfig: ColumnConfigType[] = [
  {
    field: "phase.token.currency",
    label: "Token",
    sublabel: "phase.token.chain",
    type: "text",
    sortable: true,
    sortName: "phase.token.currency",
    hasImage: true,
    imageKey: "phase.token.image",
    placeholder: "/img/placeholder.svg",
    className: "rounded-full",
    getValue: (row) => row.phase?.token?.currency,
    getSubValue: (row) => row.phase?.token?.chain,
  },
  {
    field: "phase.name",
    label: "Phase",
    type: "text",
    sortable: true,
    sortName: "phase.name",
    getValue: (item) => item.phase?.name,
  },
  {
    field: "amount",
    label: "Amount",
    type: "number",
    sortable: true,
  },
  {
    field: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "PENDING", label: "Pending", color: "warning" },
      { value: "COMPLETED", label: "Completed", color: "success" },
      { value: "CANCELLED", label: "Cancelled", color: "danger" },
      { value: "REJECTED", label: "Rejected", color: "danger" },
    ],
    sortable: true,
  },
];
const ForexAccountsDashboard = () => {
  const { t } = useTranslation();
  return (
    <Layout title={t("Contributions")} color="muted">
      <DataTable
        title={t("ICO")}
        postTitle={t("Contributions")}
        endpoint={api}
        columnConfig={columnConfig}
        isCrud={false}
        hasStructure={false}
        navSlot={
          <>
            <BackButton href={`/user/ico`} />
          </>
        }
      />
    </Layout>
  );
};
export default ForexAccountsDashboard;
