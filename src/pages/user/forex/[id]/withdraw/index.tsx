import React, { useEffect } from "react";
import MinimalLayout from "@/layouts/Minimal";
import MinimalHeader from "@/components/widgets/MinimalHeader";
import { StepProgress } from "@/components/elements/addons/StepProgress";
import { SelectWalletType } from "@/components/pages/user/forex/withdraw/SelectWalletType";
import { SelectCurrency } from "@/components/pages/user/forex/withdraw/SelectCurrency";
import { SelectNetwork } from "@/components/pages/user/forex/withdraw/SelectNetwork";
import { useWithdrawStore } from "@/stores/user/forex/withdraw";
import { WithdrawAmount } from "@/components/pages/user/forex/withdraw/WithdrawAmount";
import { WithdrawConfirmed } from "@/components/pages/user/forex/withdraw/WithdrawConfirmed";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Link from "next/link";
export default function AuthWizard() {
  const { t } = useTranslation();
  const { step, selectedWalletType, clearAll, fetchAccount } =
    useWithdrawStore();
  const router = useRouter();
  const { id } = router.query as {
    id: string;
  };
  // Clear all state when leaving the wizard or completing the process
  useEffect(() => {
    if (router.isReady) {
      fetchAccount(id);
    }
    return () => {
      if (step === 5) {
        clearAll();
      }
    };
  }, [router.isReady, step]);
  return (
    <MinimalLayout title={t("Wizard")} color="muted">
      <main className="relative min-h-screen">
        <MinimalHeader />
        <StepProgress
          step={step}
          icons={[
            "solar:wallet-bold-duotone",
            "ph:currency-dollar-simple-duotone",
            "ph:sketch-logo-duotone",
            "solar:password-minimalistic-input-line-duotone",
            "ph:flag-duotone",
          ]}
        />
        <form
          action="#"
          method="POST"
          className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-stretch pt-36"
        >
          {step === 1 && <SelectWalletType />}

          {step === 2 && <SelectCurrency />}

          {step === 3 && ["ECO", "SPOT"].includes(selectedWalletType.value) && (
            <SelectNetwork />
          )}

          {step === 4 && <WithdrawAmount />}

          {step === 5 && <WithdrawConfirmed />}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-white shadow-md flex justify-between rounded-t-md items-center flex-col md:flex-row dark:bg-muted-800">
            <p className="text-sm text-center text-gray-500 dark:text-muted-300">
              {t("Please note that withdrawing funds may take some time.")}
            </p>
            <span
              className="text-sm text-center text-muted-500 dark:text-muted-200 underline cursor-pointer"
              onClick={() => router.back()}
            >
              {t("Cancel")}
            </span>
          </div>
        </form>
      </main>
    </MinimalLayout>
  );
}
