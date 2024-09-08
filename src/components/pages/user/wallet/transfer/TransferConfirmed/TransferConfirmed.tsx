import { memo } from "react";
import Card from "@/components/elements/base/card/Card";
import IconBox from "@/components/elements/base/iconbox/IconBox";
import { useTransferStore } from "@/stores/user/wallet/transfer";
import Button from "@/components/elements/base/button/Button";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const TransferConfirmedBase = () => {
  const { t } = useTranslation();
  const { transfer, clearAll } = useTransferStore();
  const router = useRouter();

  const transferMessage = () => {
    if (!transfer || !transfer.fromTransfer) return "";

    if (transfer.fromTransfer.status === "COMPLETED") {
      return transfer.transferType === "client" ? (
        <>
          {t("Great, you've successfully transferred")}{" "}
          {transfer?.fromTransfer?.amount} {transfer?.fromCurrency}{" "}
          {t("from your")} {transfer?.fromType} {t("wallet to the client's")}{" "}
          {transfer?.toType} {t("wallet")}.
        </>
      ) : (
        <>
          {t("Great, you've successfully transferred")}{" "}
          {transfer?.fromTransfer?.amount} {transfer?.fromCurrency}{" "}
          {t("from your")} {transfer?.fromType} {t("wallet to your")}{" "}
          {transfer?.toType} {t("wallet")}. {t("Your new balance is")}{" "}
          {transfer?.fromBalance} {transfer?.fromCurrency}.
        </>
      );
    }

    if (transfer.fromTransfer.status === "PENDING") {
      return (
        <>
          {t("Your transfer of")} {transfer?.fromTransfer?.amount}{" "}
          {transfer?.fromCurrency} {t("from your")} {transfer?.fromType}{" "}
          {t("wallet to your")} {transfer?.toType}{" "}
          {t(
            "wallet is currently pending. You will receive an email once the transaction is completed."
          )}
          .
        </>
      );
    }

    return (
      <>
        {t(
          "Your transfer has been processed. However, it seems there was an issue with the transaction. Please contact support for further assistance."
        )}
        .
      </>
    );
  };

  return (
    <div>
      <div className="mb-12 space-y-1 text-center font-sans">
        <h2 className="text-2xl font-light text-muted-800 dark:text-muted-100">
          {t("Looks like you're all set")}
        </h2>
        <p className="text-sm text-muted-400">
          {t(
            "Thank you for using our service. You can now start using your wallet."
          )}
        </p>
      </div>

      <div className="mx-auto mb-4 w-full max-w-lg rounded px-8 pb-8">
        <Card color="contrast" className="p-6 text-center font-sans">
          <IconBox
            icon="ph:check-circle-duotone"
            variant="pastel"
            color={
              transfer.fromTransfer?.status === "COMPLETED" ? "success" : "info"
            }
            className="mx-auto mb-4"
            size={"xl"}
          />
          <h3 className="mb-1 text-lg font-light text-muted-800 dark:text-muted-100">
            {t("Congratulations")}
          </h3>
          <p className="text-sm text-muted-500 dark:text-muted-400">
            {transferMessage()}
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Button
              color="primary"
              className="w-full"
              onClick={async () => {
                clearAll();
                router.push("/user/wallet");
              }}
            >
              {t("Go to Wallet")}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export const TransferConfirmed = memo(TransferConfirmedBase);
