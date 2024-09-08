"use client";
import React from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import ActionItem from "@/components/elements/base/dropdown-action/ActionItem";
import { toast } from "sonner";
import { useTranslation } from "next-i18next";
import WagmiProviderWrapper from "@/context/useWagmi";
import WalletConnectButton from "@/components/pages/user/profile/WalletConnectButton";

const api = "/api/admin/ext/ecosystem/token";
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID;

const columnConfig: ColumnConfigType[] = [
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
    field: "chain",
    label: "Chain",
    type: "select",
    sortable: true,
    options: [
      { value: "ETH", label: "Ethereum", color: "primary" },
      { value: "BSC", label: "Binance Smart Chain", color: "info" },
      { value: "POLYGON", label: "Polygon", color: "success" },
      { value: "FTM", label: "Fantom", color: "warning" },
      { value: "OPTIMISM", label: "Optimism", color: "danger" },
      { value: "ARBITRUM", label: "Arbitrum", color: "contrast" },
      { value: "CELO", label: "Celo", color: "success" },
      { value: "BASE", label: "Basechain", color: "info" },
      { value: "BTC", label: "Bitcoin", color: "warning" },
      { value: "LTC", label: "Litecoin", color: "danger" },
      { value: "DOGE", label: "Dogecoin", color: "contrast" },
    ],
  },
  {
    field: "network",
    label: "Network",
    type: "text",
    sortable: true,
  },
  {
    field: "contractType",
    label: "Type",
    type: "select",
    sortable: true,
    options: [
      { value: "PERMIT", label: "Permit", color: "success" },
      { value: "NO_PERMIT", label: "No Permit", color: "warning" },
      { value: "NATIVE", label: "Native", color: "info" },
    ],
  },
  {
    field: "status",
    label: "Status",
    type: "switch",
    sortable: false,
    api: `${api}/:id/status`,
    options: [
      { value: true, label: "Active", color: "success" },
      { value: false, label: "Inactive", color: "danger" },
    ],
  },
];

const Tokens = () => {
  const { t } = useTranslation();
  const handleAddToMetamask = async (item) => {
    try {
      if (window.ethereum) {
        await (window as any).ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: item.contract,
              symbol: item.symbol,
              decimals: item.decimals,
              image: item.image, // A string url of the token logo
            },
          },
        });
        toast.success(`${item.name} added to Metamask`);
      } else {
        toast.error("Metamask not detected");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <Layout title={t("Ecosystem Tokens")} color="muted">
      <DataTable
        title={t("Tokens")}
        endpoint={api}
        columnConfig={columnConfig}
        canImport={true}
        dropdownActionsSlot={(item) => (
          <>
            {["BTC", "LTC", "DOGE", "DASH"].includes(item.currency) ? null : (
              <ActionItem
                key="addToMetamask"
                icon="logos:metamask-icon"
                text="Add to Metamask"
                subtext="Add Token to Metamask"
                onClick={() => handleAddToMetamask(item)}
              />
            )}
          </>
        )}
        navSlot={
          <>
            {projectId && (
              <WagmiProviderWrapper>
                <WalletConnectButton />
              </WagmiProviderWrapper>
            )}
          </>
        }
      />
    </Layout>
  );
};
export default Tokens;
export const permission = "Access Ecosystem Token Management";
