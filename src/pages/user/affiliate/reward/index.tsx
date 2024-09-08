"use client";
import React, { useState } from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import ActionItem from "@/components/elements/base/dropdown-action/ActionItem";
import $fetch from "@/utils/api";
import { useDataTable } from "@/stores/datatable";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { Icon } from "@iconify/react";
import Card from "@/components/elements/base/card/Card";
import Modal from "@/components/elements/base/modal/Modal";
import Button from "@/components/elements/base/button/Button";
import IconBox from "@/components/elements/base/iconbox/IconBox";
import { useTranslation } from "next-i18next";
const api = "/api/admin/ext/affiliate/reward";
const columnConfig: ColumnConfigType[] = [
  {
    field: "condition.name",
    label: "Condition",
    type: "text",
    sortable: true,
    getValue: (row) => row.condition?.title,
  },
  {
    field: "reward",
    label: "Reward",
    type: "number",
    sortable: true,
    getValue: (row) => `${row.reward} ${row.condition?.rewardCurrency}`,
  },
  {
    field: "isClaimed",
    label: "Status",
    type: "select",
    sortable: true,
    options: [
      { value: true, label: "Claimed", color: "success" },
      { value: false, label: "Unclaimed", color: "warning" },
    ],
  },
];
const MlmReferralRewards = () => {
  const { t } = useTranslation();
  const { fetchData } = useDataTable();
  const [isLoading, setIsLoading] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const handleClaim = async () => {
    setIsLoading(true);
    const { error } = await $fetch({
      url: `/api/ext/affiliate/reward/${selectedItem.id}/claim`,
      method: "POST",
    });
    if (!error) {
      fetchData();
    }
    setIsLoading(false);
  };
  return (
    <Layout title={t("MLM Referral Rewards")} color="muted">
      <DataTable
        title={t("MLM Referral Rewards")}
        endpoint={api}
        columnConfig={columnConfig}
        hasStructure={false}
        isCrud={false}
        hasAnalytics
        dropdownActionsSlot={(item) => (
          <>
            <ActionItem
              key="claim"
              icon="mdi:wallet-plus-outline"
              text="Claim"
              subtext="Claim reward"
              onClick={async () => {
                setSelectedItem(item);
                setIsClaiming(true);
              }}
            />
          </>
        )}
      />

      <Modal open={isClaiming} size="sm">
        <Card shape="smooth">
          <div className="flex items-center justify-between p-4 md:p-6">
            <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
              {t("Claim Reward")}
            </p>

            <IconButton
              size="sm"
              shape="full"
              onClick={() => {
                setIsClaiming(false);
              }}
            >
              <Icon icon="lucide:x" className="h-4 w-4" />
            </IconButton>
          </div>
          <div className="p-4 md:p-6 text-center">
            <div className="flex justify-center">
              <IconBox
                icon="mdi:wallet-plus-outline"
                color="success"
                className="mb-4"
                size={"xl"}
                variant={"pastel"}
              />
            </div>
            <p className="text-muted-400 dark:text-muted-600 text-sm mb-4">
              {t("Are you sure you want to claim this reward")}
            </p>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex gap-x-2 justify-end">
              <Button
                color="success"
                type="button"
                onClick={async () => {
                  await handleClaim();
                  setIsClaiming(false);
                }}
                disabled={isLoading}
                loading={isLoading}
              >
                {t("Claim")}
              </Button>
            </div>
          </div>
        </Card>
      </Modal>
    </Layout>
  );
};
export default MlmReferralRewards;
