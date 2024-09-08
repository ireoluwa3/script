import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useAccount, useChainId, useConnect, useDisconnect } from "wagmi";
import Button from "@/components/elements/base/button/Button";
import { useLoginWallet } from "@/hooks/useLoginWallet";
import $fetch from "@/utils/api";
import { toast } from "sonner"; // Updated import for toast notifications
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { useRouter } from "next/router";
import { useDashboardStore } from "@/stores/dashboard";
import { useTranslation } from "next-i18next";
import { AnimatedTooltip } from "@/components/elements/base/tooltips/AnimatedTooltip";

const defaultUserPath = process.env.NEXT_PUBLIC_DEFAULT_USER_PATH || "/user";

const WalletLogin = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { setIsFetched } = useDashboardStore();
  const { connectors, connect } = useConnect() as any;
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [walletLoading, setWalletLoading] = useState(false);
  const { handleWalletLogin, signature, message } = useLoginWallet(); // Added message to destructuring
  const [chain, setChain] = useState<number | null>(null);
  const chainId = useChainId();
  useEffect(() => {
    if (chainId) {
      setChain(chainId);
    }
  }, [chainId]);
  useEffect(() => {
    const signInWithWallet = async () => {
      if (signature && address && chain && message) {
        // Check if message is available
        try {
          const { data, error } = await $fetch({
            url: "/api/auth/login/wallet",
            method: "POST",
            body: { message, signature },
          });
          if (error || !data) {
            throw new Error("Signature verification failed");
          }
          setIsFetched(false);
          router.push(defaultUserPath);
        } catch (error) {
          console.error(error);
          toast.error("Failed to sign in with wallet.");
        }
      }
    };
    signInWithWallet();
  }, [signature, address, chain, message]); // Added message to dependencies
  // Filter out unique connectors based on name
  const uniqueConnectors = connectors.reduce((acc: any[], connector: any) => {
    if (!acc.find((c) => c.name === connector.name)) {
      acc.push(connector);
    }
    return acc;
  }, []);
  const handleDisconnect = () => {
    setWalletLoading(true);
    disconnect();
    setWalletLoading(false);
  };
  return (
    <div className="flex gap-2 mb-5 w-full">
      {isConnected && address ? (
        <AnimatedTooltip content={t("Disconnect Wallet")}>
          <IconButton
            onClick={() => {
              handleDisconnect();
            }}
            variant="pastel"
            disabled={walletLoading}
            loading={walletLoading}
            color="danger"
          >
            <Icon icon="hugeicons:wifi-disconnected-01" className="w-6 h-6" />
          </IconButton>
        </AnimatedTooltip>
      ) : (
        <div className="flex gap-2 w-full">
          {uniqueConnectors.map((connector) => (
            <div className="w-full" key={connector.id}>
              <Button
                onClick={() => {
                  setWalletLoading(true);
                  connect({ connector });
                  setWalletLoading(false);
                }}
                variant="pastel"
                className="w-full"
                disabled={walletLoading}
                loading={walletLoading}
                color="warning"
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
      {isConnected && address && (
        <div className="w-full">
          <Button
            onClick={() => handleWalletLogin(address, chain as number)}
            color="info"
            className="w-full"
            loading={walletLoading}
            disabled={walletLoading}
          >
            <Icon icon="simple-icons:walletconnect" className="w-4 h-4 mr-2" />
            {t("Sign In With Wallet")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default WalletLogin;
