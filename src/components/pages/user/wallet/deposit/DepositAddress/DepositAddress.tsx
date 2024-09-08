import { useEffect } from "react";
import { memo } from "react";
import Typewriter from "@/components/ui/Typewriter";
import QRCode from "qrcode.react";
import Button from "@/components/elements/base/button/Button";
import { Icon } from "@iconify/react";
import Input from "@/components/elements/form/input/Input";
import { useDepositStore } from "@/stores/user/wallet/deposit";
import { useTranslation } from "next-i18next";
import { toast } from "sonner";

const DepositAddressBase = ({}) => {
  const { t } = useTranslation();
  const {
    setSelectedDepositMethod,
    depositAddress,
    selectedDepositMethod,
    setStep,
    transactionHash,
    setTransactionHash,
    sendTransactionHash,
    loading,
    unlockAddress,
    contractType,
  } = useDepositStore();

  const copyToClipboard = () => {
    if (depositAddress?.address) {
      navigator.clipboard.writeText(depositAddress.address);
      toast.success(t("Address copied to clipboard!"));
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (loading) {
        event.preventDefault();
        event.returnValue = t(
          "Please do not close this page until the verification is complete."
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [loading, t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <Icon
            icon="mdi:loading"
            className="h-12 w-12 animate-spin text-primary-500"
          />
          <p className="text-xl text-primary-500">
            {t("Processing payment...")}
          </p>
          <p className="text-sm text-primary-500">
            {t(
              "Please do not close this page until the verification is complete."
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-12 space-y-1 text-center font-sans">
        <h2 className="text-2xl font-light text-muted-800 dark:text-muted-100">
          {t("Deposit Address")}
        </h2>
        <p className="text-sm text-muted-400 px-5">
          {t("Please send the amount to the following address in")}{" "}
          <span className="text-primary-500 font-bold">
            {selectedDepositMethod}
          </span>{" "}
          {t("network")}{" "}
          {depositAddress?.trx &&
            `and enter the transaction hash below to complete the deposit.
          Please note that the transaction hash is required for us to verify
          your deposit.`}
        </p>
      </div>

      <div className="mx-auto mb-4 w-full max-w-lg rounded px-8 pb-8">
        <div className="flex flex-col items-center justify-center gap-5">
          <Typewriter className="hidden sm:flex flex-start text-muted-800 dark:text-muted-200">
            {depositAddress?.address}
          </Typewriter>
          <Button type="button" onClick={copyToClipboard} color={"info"}>
            <Icon icon="mdi:content-copy" className="h-5 w-5" />
            {t("Copy Address")}
          </Button>
          <Input
            className="flex sm:hidden"
            readOnly
            value={depositAddress?.address}
          />
          <div className="bg-white p-5">
            <QRCode value={depositAddress?.address} size={128} level={"H"} />
          </div>
          {depositAddress?.info?.tag && (
            <div className="text-muted-400 text-sm">
              {t("Tag")} {depositAddress.info.tag}
            </div>
          )}
        </div>
        {depositAddress.trx && (
          <>
            <Input
              value={transactionHash}
              placeholder={t("Enter transaction hash")}
              label={t("Transaction Hash")}
              className="w-full"
              required
              onChange={(e) => {
                setTransactionHash(e.target.value);
              }}
            />
          </>
        )}

        <div className="mt-6">
          <div className="flex w-full gap-4 justify-center">
            <Button
              type="button"
              size="lg"
              className="w-full"
              onClick={async () => {
                if (contractType === "NO_PERMIT")
                  await unlockAddress(depositAddress.address);
                setSelectedDepositMethod(null, null);
                setStep(3);
              }}
            >
              <Icon icon="mdi:chevron-left" className="h-5 w-5" />
              {t("Go Back")}
            </Button>
            {depositAddress.trx && (
              <Button
                type="button"
                size="lg"
                className="w-full"
                onClick={async () => {
                  sendTransactionHash();
                  if (contractType === "NO_PERMIT")
                    await unlockAddress(depositAddress.address);
                }}
                disabled={transactionHash === ""}
                color="primary"
              >
                {t("Deposit")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export const DepositAddress = memo(DepositAddressBase);
