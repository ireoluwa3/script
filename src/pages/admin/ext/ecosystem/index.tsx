import React, { useState, useEffect } from "react";
import Layout from "@/layouts/Default";
import Input from "@/components/elements/form/input/Input";
import Button from "@/components/elements/base/button/Button";
import Card from "@/components/elements/base/card/Card";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { Icon } from "@iconify/react";
import Modal from "@/components/elements/base/modal/Modal";
import $fetch from "@/utils/api";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const EcosystemBlockchains: React.FC = () => {
  const { t } = useTranslation();
  const [blockchains, setBlockchains] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPassPhraseModelOpen, setIsPassPhraseModelOpen] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const utxoChains = ["BTC", "LTC", "DOGE", "DASH"];
  const router = useRouter();
  const fetchBlockchains = async () => {
    const { data, error } = await $fetch({
      url: "/api/admin/ext/ecosystem",
      silent: true,
    });
    if (!error) {
      setBlockchains(data);
    }
  };
  useEffect(() => {
    if (router.isReady) fetchBlockchains();
  }, [router.isReady]);
  const supportedChainsImagesMap = (chain: string) => {
    switch (chain) {
      case "ETH":
        return "eth";
      case "BSC":
        return "bnb";
      case "POLYGON":
        return "matic";
      case "FTM":
        return "ftm";
      case "OPTIMISM":
        return "op";
      case "ARBITRUM":
        return "arbitrum";
      case "BASE":
        return "base";
      case "CELO":
        return "celo";
      case "BTC":
        return "btc";
      case "LTC":
        return "ltc";
      case "DOGE":
        return "doge";
      case "DASH":
        return "dash";
      default:
        return "";
    }
  };
  const setPassphraseHandler = async () => {
    setIsSubmitting(true);
    const { error } = await $fetch({
      url: "/api/admin/ext/ecosystem/kms",
      method: "POST",
      body: { passphrase },
    });
    if (!error) {
      setIsPassPhraseModelOpen(false);
      setPassphrase("");
      await fetchBlockchains();
    }
    setIsSubmitting(false);
  };
  return (
    <Layout title={t("Ecosystem Blockchains")} color="muted">
      <div className="space-y-5">
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 md:grid-cols-4">
          {blockchains.metrics?.map((item: any, index: number) => (
            <div className="relative" key={index}>
              <Card className="space-y-1 p-5">
                <p className="text-xs text-muted-500 dark:text-muted-400">
                  {item.metric}
                </p>
                <h2 className="text-lg font-semibold text-muted-800 dark:text-white">
                  <span>{item.value}</span>
                </h2>
              </Card>
            </div>
          ))}
        </div>
        <div>
          <Card className="space-y-5 p-5" color={"contrast"}>
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-muted-800 dark:text-white">
                  {t("Ecosystem Blockchains")}
                </h2>
                <p className="text-xs text-muted-500 dark:text-muted-400">
                  {t("Manage the blockchains of the ecosystem")}
                </p>
              </div>
              {blockchains.isUnlockedVault ? (
                <div className="flex items-center gap-2 bg-success-100 text-success-600 rounded-md px-3 py-1 text-md">
                  <Icon icon="line-md:confirm-circle" className="h-5 w-5" />
                  {t("Vault Active")}
                </div>
              ) : (
                <Button
                  color="success"
                  onClick={() => setIsPassPhraseModelOpen(true)}
                  className="ms-2"
                >
                  <Icon icon="lucide:lock" className="mr-2 h-4 w-4" />
                  {t("Initiate Vault")}
                </Button>
              )}
            </div>
            <div className="grid gap-5 mt-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {blockchains.chains?.map((item: any, index: number) => (
                <div key={index}>
                  <div
                    className={`
                    ${
                      (utxoChains.includes(item.chain) &&
                        item.info.nodeProvider) ||
                      (item.info.rpc &&
                        item.info.rpcWss &&
                        item.info.explorerApi)
                        ? "grayscale-0"
                        : "grayscale"
                    }
                  `}
                  >
                    <img
                      src={`/img/crypto/${supportedChainsImagesMap(
                        item.chain
                      )}.webp`}
                      alt={`${item.chain} logo`}
                      className="h-10 w-10 rounded-full"
                    />
                  </div>
                  <span className="text-sm font-semibold text-muted-800 dark:text-muted-200">
                    {item.chain} ({item.info.network})
                  </span>
                  <ul className="text-xs">
                    {utxoChains.includes(item.chain) ? (
                      <li>
                        <span className="text-muted-500">{t("Node")} </span>
                        <span className="text-info-500">
                          {item.info.nodeProvider}
                        </span>
                      </li>
                    ) : (
                      <>
                        <li
                          className={`flex items-center gap-2 ${
                            item.info.rpc
                              ? "text-success-500"
                              : "text-danger-500"
                          }`}
                        >
                          <Icon
                            icon={item.info.rpc ? "lucide:check" : "lucide:x"}
                            className="h-3 w-3 text-current"
                          />
                          {t("RPC")}
                        </li>
                        <li
                          className={`flex items-center gap-2 ${
                            item.info.rpcWss
                              ? "text-success-500"
                              : "text-danger-500"
                          }`}
                        >
                          <Icon
                            icon={
                              item.info.rpcWss ? "lucide:check" : "lucide:x"
                            }
                            className="h-3 w-3 text-current"
                          />
                          {t("RPC WSS")}
                        </li>
                        <li
                          className={`flex items-center gap-2 ${
                            item.info.explorerApi
                              ? "text-success-500"
                              : "text-danger-500"
                          }`}
                        >
                          <Icon
                            icon={
                              item.info.explorerApi
                                ? "lucide:check"
                                : "lucide:x"
                            }
                            className="h-3 w-3 text-current"
                          />
                          {t("Explorer API")}
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
      <Modal open={isPassPhraseModelOpen} size="sm">
        <Card className="space-y-5">
          <div className="flex items-center justify-between p-4 md:p-6">
            <h3 className="font-heading text-muted-900 text-lg font-medium leading-6 dark:text-white">
              {t("Set Ecosystem Passphrase")}
            </h3>
            <IconButton
              size="sm"
              shape="full"
              onClick={() => setIsPassPhraseModelOpen(false)}
            >
              <Icon icon="lucide:x" className="h-4 w-4" />
            </IconButton>
          </div>
          <div className="p-4 md:p-6">
            <p className="font-alt text-muted-500 dark:text-muted-400 text-sm leading-5 mb-3">
              {t("Please enter the passphrase of the ecosystem vault.")}
            </p>
            <Input
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              label={t("Passphrase")}
              placeholder={t("Enter passphrase")}
              type="password"
              disabled={isSubmitting}
              loading={isSubmitting}
            />
          </div>
          <div className="p-4 md:p-6">
            <div className="flex gap-x-2 justify-end">
              <Button onClick={() => setIsPassPhraseModelOpen(false)}>
                {t("Cancel")}
              </Button>
              <Button
                color="primary"
                variant="solid"
                onClick={setPassphraseHandler}
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                {t("Submit")}
              </Button>
            </div>
          </div>
        </Card>
      </Modal>
    </Layout>
  );
};
export default EcosystemBlockchains;
export const permission = "Access Ecosystem Management";
