import React, { useState } from "react";
import { useAccount, useConnect, useDisconnect, useChainId } from "wagmi";
import Button from "@/components/elements/base/button/Button";
import $fetch from "@/utils/api";
import { useDashboardStore } from "@/stores/dashboard";
import { Icon } from "@iconify/react";
import { useTranslation } from "next-i18next";

const WalletConnectButton = () => {
  const { t } = useTranslation();
  const { walletConnected, setWalletConnected } = useDashboardStore();
  const { connectors, connect } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [walletLoading, setWalletLoading] = useState(false);
  const chainId = useChainId();
  const handleConnect = async (connector) => {
    setWalletLoading(true);
    connect({ connector });
    setWalletLoading(false);
  };
  const handleDisconnect = async () => {
    setWalletLoading(true);
    await $fetch({
      url: "/api/user/profile/wallet/disconnect",
      method: "POST",
      body: { address },
    });
    disconnect();
    setWalletLoading(false);
    setWalletConnected(false);
  };
  const registerWalletAddress = async () => {
    const { data, error } = await $fetch({
      url: "/api/user/profile/wallet/connect",
      method: "POST",
      body: { address, chainId },
    });
    if (!error) {
      setWalletConnected(true);
    }
  };
  const uniqueConnectors = connectors.reduce((acc: any[], connector: any) => {
    if (!acc.find((c) => c.name === connector.name)) {
      acc.push(connector);
    }
    return acc;
  }, []);
  return (
    <div>
      {walletConnected && isConnected ? (
        <Button
          onClick={handleDisconnect}
          disabled={walletLoading}
          loading={walletLoading}
          color="danger"
          shape={"rounded"}
        >
          <Icon
            icon="hugeicons:wifi-disconnected-01"
            className="w-6 h-6 mr-2"
          />
          {t("Remove Wallet")}
        </Button>
      ) : !walletConnected && isConnected ? (
        <Button
          onClick={registerWalletAddress}
          disabled={walletLoading}
          loading={walletLoading}
          color="success"
          shape={"rounded"}
        >
          <Icon icon="hugeicons:wifi-connected-03" className="w-6 h-6 mr-2" />
          {t("Register Wallet")}
        </Button>
      ) : (
        <div className="flex gap-2">
          {uniqueConnectors.map((connector) => (
            <div className="w-full" key={connector.id}>
              <Button
                onClick={() => {
                  handleConnect(connector);
                }}
                variant="pastel"
                className="w-full"
                disabled={walletLoading}
                loading={walletLoading}
                color="warning"
                shape={"rounded"}
              >
                <Icon
                  icon={
                    connector.name === "MetaMask"
                      ? "logos:metamask-icon"
                      : "simple-icons:walletconnect"
                  }
                  className="w-6 h-6 mr-2"
                />
                {t("Connect")} {connector.name}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default WalletConnectButton;
