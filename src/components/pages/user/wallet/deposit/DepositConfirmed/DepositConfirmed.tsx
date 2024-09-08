import { memo } from "react";
import { DepositConfirmedProps } from "./DepositConfirmed.types";
import Card from "@/components/elements/base/card/Card";
import IconBox from "@/components/elements/base/iconbox/IconBox";
import { useDepositStore } from "@/stores/user/wallet/deposit";
import Button from "@/components/elements/base/button/Button";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
const DepositConfirmedBase = ({}: DepositConfirmedProps) => {
  const { t } = useTranslation();
  const { deposit, clearAll } = useDepositStore();
  const router = useRouter();
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
            color={deposit?.balance ? "success" : "info"}
            className="mx-auto mb-4"
            size={"xl"}
          />
          <h3 className="mb-1 text-lg font-light text-muted-800 dark:text-muted-100">
            {t("Congratulations")}
          </h3>
          <p className="text-sm text-muted-500 dark:text-muted-400">
            {deposit.transaction?.status === "COMPLETED" ? (
              <>
                {t("Great, you've sucessfully deposited")}{" "}
                {deposit?.transaction?.amount} {deposit?.currency}{" "}
                {t("to your wallet using")}{" "}
                {deposit?.method}. {t("Your new balance is")} {deposit?.balance}{" "}
                {deposit?.currency}
              </>
            ) : deposit.transaction?.status === "PENDING" ? (
              <>
                {t("Your deposit of")}{" "}
                {deposit?.transaction?.amount} {deposit?.currency}{" "}
                {t(
                  "is currently pending. You will receive an email once the transaction is completed."
                )}
              </>
            ) : (
              <>
                {t(
                  "Your deposit has been processed. However, it seems there was an issue with the transaction. Please contact support for further assistance."
                )}
              </>
            )}
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
export const DepositConfirmed = memo(DepositConfirmedBase);
