import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/layouts/Default";
import Button from "@/components/elements/base/button/Button";
import Modal from "@/components/elements/base/modal/Modal";
import Card from "@/components/elements/base/card/Card";
import $fetch from "@/utils/api";
import { ObjectTable } from "@/components/elements/base/object-table";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { Icon } from "@iconify/react";
import Input from "@/components/elements/form/input/Input";
import { BackButton } from "@/components/elements/base/button/BackButton";
import { useTranslation } from "next-i18next";

const ViewCustodialWallet = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [nativeTransferModalOpen, setNativeTransferModalOpen] = useState(false);
  const [tokenTransferModalOpen, setTokenTransferModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    recipient: "",
    amount: "",
    tokenAddress: "",
  });
  useEffect(() => {
    if (id) {
      fetchCustodialWallet(id);
    }
  }, [id]);
  const fetchCustodialWallet = async (walletId) => {
    setLoading(true);
    const { data, error } = await $fetch({
      url: `/api/admin/ext/ecosystem/wallet/custodial/${walletId}`,
      silent: true,
    });
    if (!error) {
      setWallet(data);
    }
    setLoading(false);
  };
  const handleTransfer = async (type) => {
    const url = `/api/admin/ext/ecosystem/wallet/custodial/${id}/transfer/${type}`;
    const payload =
      type === "native"
        ? { recipient: formData.recipient, amount: formData.amount }
        : {
            recipient: formData.recipient,
            amount: formData.amount,
            tokenAddress: formData.tokenAddress,
          };
    const { error } = await $fetch({
      url,
      method: "POST",
      body: payload,
    });
    if (!error) {
      fetchCustodialWallet(id);
    }
    // Close the modal after the transfer
    if (type === "native") {
      setNativeTransferModalOpen(false);
    } else {
      setTokenTransferModalOpen(false);
    }
  };
  const columns: ColumnConfigType[] = [
    {
      field: "currency",
      label: "Currency",
      sublabel: "name",
      type: "text",
      sortable: true,
      hasImage: true,
      imageKey: "icon",
      placeholder: "/img/placeholder.svg",
      className: "rounded-full",
    },
    {
      field: "tokenAddress",
      label: "Token Address",
      type: "text",
      sortable: false,
    },
    { field: "balance", label: "Balance", type: "text", sortable: false },
  ];
  if (!wallet) {
    return null;
  }
  return (
    <Layout title={t("Custodial Wallet")} color="muted">
      <main className="mx-auto max-w-7xl">
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center">
            <h2 className="font-sans text-2xl font-light leading-[1.125] text-muted-800 dark:text-muted-100">
              {t("Custodial Wallet")}
            </h2>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              color={"primary"}
              onClick={() => setNativeTransferModalOpen(true)}
            >
              {t("Transfer Native Tokens")}
            </Button>
            <Button
              type="button"
              color={"primary"}
              onClick={() => setTokenTransferModalOpen(true)}
            >
              {t("Transfer ERC-20 Tokens")}
            </Button>
            <BackButton href="/admin/ext/ecosystem/wallet/custodial" />
          </div>
        </div>

        <ObjectTable items={wallet.tokenBalances} columnConfig={columns} />
        <Modal open={nativeTransferModalOpen} size="sm">
          <Card shape="smooth">
            <div className="flex items-center justify-between p-4 md:p-6">
              <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
                {t("Transfer Native Tokens")}
              </p>
              <IconButton
                size="md"
                shape="full"
                onClick={() => setNativeTransferModalOpen(false)}
              >
                <Icon icon="lucide:x" className="h-4 w-4" />
              </IconButton>
            </div>
            <div className="p-4 md:px-6 md:pb-8">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleTransfer("native");
                }}
              >
                <Input
                  label={t("Recipient Address")}
                  placeholder={t("Recipient Address")}
                  value={formData.recipient}
                  onChange={(e) =>
                    setFormData({ ...formData, recipient: e.target.value })
                  }
                  required
                />
                <Input
                  label={t("Amount")}
                  placeholder={t("Amount")}
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  required
                />
                <div className="flex w-full justify-end gap-2 mt-4">
                  <Button
                    type="submit"
                    variant="solid"
                    color="primary"
                    shape="smooth"
                    loading={loading}
                    disabled={loading}
                  >
                    {t("Transfer")}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </Modal>
        <Modal open={tokenTransferModalOpen} size="sm">
          <Card shape="smooth">
            <div className="flex items-center justify-between p-4 md:p-6">
              <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
                {t("Transfer ERC-20 Tokens")}
              </p>
              <IconButton
                size="md"
                shape="full"
                onClick={() => setTokenTransferModalOpen(false)}
              >
                <Icon icon="lucide:x" className="h-4 w-4" />
              </IconButton>
            </div>
            <div className="p-4 md:px-6 md:pb-8">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleTransfer("token");
                }}
              >
                <Input
                  label={t("Recipient Address")}
                  placeholder={t("Recipient Address")}
                  value={formData.recipient}
                  onChange={(e) =>
                    setFormData({ ...formData, recipient: e.target.value })
                  }
                  required
                />
                <Input
                  label={t("Amount")}
                  placeholder={t("Amount")}
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  required
                />
                <Input
                  label={t("Token Address")}
                  placeholder={t("Token Address")}
                  value={formData.tokenAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, tokenAddress: e.target.value })
                  }
                  required
                />
                <div className="flex w-full justify-end gap-2 mt-4">
                  <Button
                    type="submit"
                    variant="solid"
                    color="primary"
                    shape="smooth"
                    loading={loading}
                    disabled={loading}
                  >
                    {t("Transfer")}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </Modal>
      </main>
    </Layout>
  );
};
export default ViewCustodialWallet;
export const permission = "Access Ecosystem Custodial Wallet Management";
