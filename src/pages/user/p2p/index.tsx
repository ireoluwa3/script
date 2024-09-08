"use client";
import React, { useState } from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import ActionItem from "@/components/elements/base/dropdown-action/ActionItem";
import Button from "@/components/elements/base/button/Button";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { Icon } from "@iconify/react";
import Modal from "@/components/elements/base/modal/Modal";
import Card from "@/components/elements/base/card/Card";
import Input from "@/components/elements/form/input/Input";
import $fetch from "@/utils/api";
import { toast } from "sonner";
import { useDataTable } from "@/stores/datatable";
import { useWalletStore } from "@/stores/user/wallet";
import { useTranslation } from "next-i18next";
import ButtonLink from "@/components/elements/base/button-link/ButtonLink";
import Link from "next/link";

const api = "/api/ext/p2p/offer/manage";
const columnConfig: ColumnConfigType[] = [
  {
    field: "paymentMethod.name",
    label: "Method",
    sublabel: "paymentMethod.currency",
    type: "text",
    sortable: true,
    sortName: "paymentMethod.name",
    getValue: (item) => item.paymentMethod?.name,
    getSubValue: (item) => item.paymentMethod?.currency,
    path: "/admin/ext/p2p/payment/method?name=[paymentMethod.name]",
    hasImage: true,
    imageKey: "paymentMethod.image",
    placeholder: "/img/placeholder.svg",
  },
  {
    field: "currency",
    label: "Currency",
    sublabel: "walletType",
    type: "text",
    sortable: true,
    getValue: (item) =>
      `${item.currency} ${item.chain ? `(${item.chain})` : ""}`,
  },
  {
    field: "amount",
    label: "Amount",
    type: "number",
    sortable: true,
  },
  {
    field: "inOrder",
    label: "In Order",
    type: "number",
    sortable: true,
  },
  {
    field: "price",
    label: "Price",
    type: "number",
    sortable: true,
  },
  {
    field: "p2pReviews",
    label: "Rating",
    type: "rating",
    getValue: (data) => {
      if (!data.p2pReviews.length) return 0;
      const rating = data.p2pReviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      return rating / data.p2pReviews.length;
    },
    sortable: true,
    sortName: "p2pReviews.rating",
  },
  {
    field: "status",
    label: "Status",
    type: "select",
    sortable: true,
    options: [
      { value: "PENDING", label: "Pending", color: "warning" },
      { value: "ACTIVE", label: "Active", color: "success" },
      { value: "COMPLETED", label: "Completed", color: "success" },
      { value: "CANCELLED", label: "Cancelled", color: "danger" },
    ],
  },
];

const P2pOffers = () => {
  const { t } = useTranslation();
  const { fetchData } = useDataTable();
  const { wallet, fetchWallet } = useWalletStore();
  const [amount, setAmount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isDepositingOpen, setIsDepositingOpen] = useState(false);
  const [isWithdrawingOpen, setIsWithdrawingOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  const handleDeposit = async () => {
    if (!amount || amount <= 0)
      return toast.error("Please enter a valid amount to deposit");
    if (!selectedOffer) return toast.error("Please select an offer to deposit");
    setIsLoading(true);
    const { error } = await $fetch({
      url: `/api/ext/p2p/offer/manage/${selectedOffer.id}/deposit`,
      method: "POST",
      body: {
        amount,
      },
    });
    if (!error) {
      fetchData();
    }
    setIsLoading(false);
  };

  const handleWithdraw = async () => {
    if (!amount || amount <= 0)
      return toast.error("Please enter a valid amount to withdraw");
    if (!selectedOffer)
      return toast.error("Please select an offer to withdraw");
    setIsLoading(true);
    const { error } = await $fetch({
      url: `/api/ext/p2p/offer/manage/${selectedOffer.id}/withdraw`,
      method: "POST",
      body: {
        amount,
      },
    });
    if (!error) {
      fetchData();
    }
    setIsLoading(false);
  };

  return (
    <Layout title={t("P2P Offers")} color="muted">
      <DataTable
        title={t("P2P Offers")}
        endpoint={api}
        columnConfig={columnConfig}
        canDelete={false}
        hasAnalytics
        viewPath="/p2p/offer/[id]"
        canCreate={false}
        isParanoid={false}
        dropdownActionsSlot={(item) => (
          <>
            <ActionItem
              key="deposit"
              icon="mdi:wallet-plus"
              text="Deposit"
              subtext="Deposit funds"
              onClick={async () => {
                await fetchWallet(item.walletType, item.currency);
                setSelectedOffer(item);
                setIsDepositingOpen(true);
              }}
            />
            <ActionItem
              key="withdraw"
              icon="mdi:credit-card-minus"
              text="Withdraw"
              subtext="Withdraw funds"
              onClick={async () => {
                await fetchWallet(item.walletType, item.currency);
                setSelectedOffer(item);
                setIsWithdrawingOpen(true);
              }}
            />
          </>
        )}
        navSlot={
          <>
            <Link href="/user/p2p/offer" color="success">
              <IconButton
                variant="pastel"
                aria-label="Create Offer"
                color="success"
                size="lg"
              >
                <Icon icon={"mdi-plus"} className="h-6 w-6" />
              </IconButton>
            </Link>
          </>
        }
      />

      <Modal open={isDepositingOpen} size="sm">
        {selectedOffer && (
          <Card shape="smooth">
            <div className="flex items-center justify-between p-4 md:p-6">
              <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
                {t("Deposit Funds")}
              </p>

              <IconButton
                size="sm"
                shape="full"
                onClick={() => {
                  setIsDepositingOpen(false);
                  setAmount(0);
                }}
              >
                <Icon icon="lucide:x" className="h-4 w-4" />
              </IconButton>
            </div>
            <div className="p-4 md:p-6">
              <p className="text-muted-400 dark:text-muted-600 text-sm mb-4">
                {t(
                  "Deposit funds to the offer, the amount will be transferred from wallet to the offer and change the status to ACTIVE"
                )}
              </p>
              <Input
                type="number" // Ensure the input type is number
                shape="curved"
                placeholder={t("Enter the amount to deposit")}
                label={t("Amount")}
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))} // Allow decimal values
                min={selectedOffer.minAmount}
                max={wallet ? wallet.balance : selectedOffer.maxAmount}
                step="0.01" // Allow decimal values
                error={
                  amount > (wallet?.balance || 0)
                    ? "Amount is more than the wallet balance"
                    : ""
                }
              />

              {/* wallet balance */}
              <Card className="mt-6 p-3">
                <div className="flex items-center justify-between gap-2 ">
                  <span className="text-sm text-muted-500 dark:text-muted-400">
                    {t("Wallet Balance")}
                  </span>
                  <span className="text-sm text-muted-500 dark:text-muted-400">
                    {wallet ? wallet.balance : 0} {selectedOffer.currency}
                  </span>
                </div>
                {/* wallet remaining balance */}
                <div className="flex items-center justify-between gap-2 ">
                  <span className="text-sm text-muted-500 dark:text-muted-400">
                    {t("Remaining Balance")}
                  </span>
                  <span className="text-sm text-muted-500 dark:text-muted-400">
                    {wallet ? wallet.balance - amount : 0}{" "}
                    {selectedOffer.currency}
                  </span>
                </div>
                {/* new offer balance */}
                <div className="flex items-center justify-between gap-2 ">
                  <span className="text-sm text-muted-500 dark:text-muted-400">
                    {t("New Offer Balance")}
                  </span>
                  <span className="text-sm text-muted-500 dark:text-muted-400">
                    {selectedOffer.amount + amount} {selectedOffer.currency}
                  </span>
                </div>
              </Card>
            </div>
            <div className="p-4 md:p-6">
              <div className="flex gap-x-2 justify-end">
                <Button
                  color="success"
                  type="button"
                  onClick={async () => {
                    await handleDeposit();
                    setIsDepositingOpen(false);
                    setAmount(0);
                  }}
                  disabled={
                    (wallet ? amount > wallet?.balance : false) ||
                    amount === 0 ||
                    isLoading
                  }
                  loading={isLoading}
                >
                  {t("Deposit")}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </Modal>

      <Modal open={isWithdrawingOpen} size="sm">
        {selectedOffer && (
          <Card shape="smooth">
            <div className="flex items-center justify-between p-4 md:p-6">
              <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
                {t("Withdraw Funds")}
              </p>

              <IconButton
                size="sm"
                shape="full"
                onClick={() => {
                  setIsWithdrawingOpen(false);
                  setAmount(0);
                }}
              >
                <Icon icon="lucide:x" className="h-4 w-4" />
              </IconButton>
            </div>
            <div className="p-4 md:p-6">
              <p className="text-muted-400 dark:text-muted-600 text-sm mb-4">
                {t(
                  "Withdraw funds from the offer, the amount will be transferred from the offer to wallet and change the status to ACTIVE"
                )}
              </p>
              <Input
                type="number" // Ensure the input type is number
                shape="curved"
                placeholder={t("Enter the amount to withdraw")}
                label={t("Amount")}
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))} // Allow decimal values
                min={selectedOffer.minAmount}
                max={selectedOffer.amount}
                step="0.01" // Allow decimal values
                error={
                  amount > selectedOffer.amount
                    ? "Amount is more than the offer amount"
                    : ""
                }
              />
              <Card className="mt-6 p-3">
                <div className="flex items-center justify-between gap-2 ">
                  <span className="text-sm text-muted-500 dark:text-muted-400">
                    {t("Wallet Balance")}
                  </span>
                  <span className="text-sm text-muted-500 dark:text-muted-400">
                    {wallet ? wallet.balance : 0} {selectedOffer.currency}
                  </span>
                </div>
                {/* wallet remaining balance */}
                <div className="flex items-center justify-between gap-2 ">
                  <span className="text-sm text-muted-500 dark:text-muted-400">
                    {t("Remaining Wallet Balance")}
                  </span>
                  <span className="text-sm text-muted-500 dark:text-muted-400">
                    {wallet ? wallet.balance + amount : 0}{" "}
                    {selectedOffer.currency}
                  </span>
                </div>
                {/* remaining offer balance */}
                <div className="flex items-center justify-between gap-2 ">
                  <span className="text-sm text-muted-500 dark:text-muted-400">
                    {t("Remaining Offer Balance")}
                  </span>
                  <span className="text-sm text-muted-500 dark:text-muted-400">
                    {selectedOffer.amount - amount} {selectedOffer.currency}
                  </span>
                </div>
              </Card>
            </div>
            <div className="p-4 md:p-6">
              <div className="flex gap-x-2 justify-end">
                <Button
                  color="success"
                  type="button"
                  onClick={async () => {
                    await handleWithdraw();
                    setIsWithdrawingOpen(false);
                    setAmount(0);
                  }}
                  disabled={
                    amount > selectedOffer.amount || amount === 0 || isLoading
                  }
                  loading={isLoading}
                >
                  {t("Withdraw")}
                </Button>
              </div>
            </div>
          </Card>
        )}
      </Modal>
    </Layout>
  );
};

export default P2pOffers;
