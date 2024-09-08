import React, { useEffect } from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { statusOptions, transactionTypeOptions } from "@/utils/constants";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { BackButton } from "@/components/elements/base/button/BackButton";
import { useDashboardStore } from "@/stores/dashboard";
import { toast } from "sonner";
const api = "/api/finance/transaction";
const columnConfig: ColumnConfigType[] = [
  {
    field: "id",
    label: "ID",
    type: "text",
    sortable: true,
  },
  {
    field: "type",
    label: "Type",
    type: "select",
    options: transactionTypeOptions,
    sortable: true,
  },
  {
    field: "amount",
    label: "Amount",
    type: "number",
    precision: 8,
    sortable: true,
  },
  {
    field: "fee",
    label: "Fee",
    type: "number",
    precision: 8,
    sortable: true,
  },
  {
    field: "status",
    label: "Status",
    type: "select",
    options: statusOptions,
    sortable: true,
  },
  {
    field: "createdAt",
    label: "Date",
    type: "date",
    sortable: true,
    filterable: false,
    getValue: (item) => new Date(item.createdAt).toLocaleString(),
  },
];
const WalletTransactions = () => {
  const { t } = useTranslation();
  const { profile, getSetting } = useDashboardStore();
  const router = useRouter();
  useEffect(() => {
    if (
      router.isReady &&
      getSetting("walletRestrictions") === "true" &&
      (!profile?.kyc?.status ||
        (parseFloat(profile?.kyc?.level || "0") < 2 &&
          profile?.kyc?.status !== "APPROVED"))
    ) {
      router.push("/user/profile?tab=kyc");
      toast.error(t("Please complete your KYC to access wallet transactions"));
    }
  }, [router.isReady, profile?.kyc?.status]);
  const { walletType, currency } = router.query;
  if (!walletType || !currency) {
    return null;
  }
  return (
    <Layout title={t("Transactions")} color="muted">
      <DataTable
        title={t("Transactions")}
        postTitle={currency as string}
        endpoint={api}
        columnConfig={columnConfig}
        canCreate={false}
        canEdit={false}
        canDelete={false}
        hasAnalytics
        params={{ walletType, currency }}
        navSlot={
          <>
            <BackButton href={`/user/wallet`} />
          </>
        }
      />
    </Layout>
  );
};
export default WalletTransactions;
