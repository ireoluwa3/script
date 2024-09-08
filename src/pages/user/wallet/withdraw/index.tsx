import React, { useEffect } from "react";
import MinimalLayout from "@/layouts/Minimal";
import MinimalHeader from "@/components/widgets/MinimalHeader";
import { StepProgress } from "@/components/elements/addons/StepProgress";
import { SelectWalletType } from "@/components/pages/user/wallet/withdraw/SelectWalletType";
import { SelectCurrency } from "@/components/pages/user/wallet/withdraw/SelectCurrency";
import { SelectNetwork } from "@/components/pages/user/wallet/withdraw/SelectNetwork";
import { useWithdrawStore } from "@/stores/user/wallet/withdraw";
import { SelectFiatWithdrawMethod } from "@/components/pages/user/wallet/withdraw/SelectFiatWithdrawMethod";
import { FiatWithdrawAmount } from "@/components/pages/user/wallet/withdraw/FiatWithdrawAmount";
import { WithdrawConfirmed } from "@/components/pages/user/wallet/withdraw/WithdrawConfirmed";
import { WithdrawAmount } from "@/components/pages/user/wallet/withdraw/WithdrawAmount";
import { useTranslation } from "next-i18next";
import { useDashboardStore } from "@/stores/dashboard";
import { useRouter } from "next/router";
import { toast } from "sonner";
import Link from "next/link";
import { Faq } from "@/components/pages/knowledgeBase/Faq";

export default function AuthWizard() {
  const { t } = useTranslation();
  const { step, selectedWalletType, clearAll, initializeWalletTypes } =
    useWithdrawStore();
  const { profile, getSetting } = useDashboardStore();
  const router = useRouter();

  const withdrawEnabled = getSetting("withdraw") !== "false";

  useEffect(() => {
    if (
      router.isReady &&
      getSetting("withdrawalRestrictions") === "true" &&
      (!profile?.kyc?.status ||
        (parseFloat(profile?.kyc?.level || "0") < 2 &&
          profile?.kyc?.status !== "APPROVED")) &&
      withdrawEnabled
    ) {
      router.push("/user/profile?tab=kyc");
      toast.error(t("Please complete your KYC to withdraw funds"));
    }
  }, [router.isReady, profile?.kyc?.status, withdrawEnabled]);

  useEffect(() => {
    if (router.isReady) initializeWalletTypes();
  }, [router.isReady]);

  useEffect(() => {
    // Change this condition as needed to control when to clear
    return () => {
      if (step === 5) {
        clearAll();
      }
    };
  }, [step]);

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
        {withdrawEnabled ? (
          <form
            action="#"
            method="POST"
            className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-stretch pt-36 pb-10"
          >
            {step === 1 && <SelectWalletType />}

            {step === 2 && <SelectCurrency />}

            {step === 3 && selectedWalletType.value === "FIAT" && (
              <SelectFiatWithdrawMethod />
            )}

            {step === 4 && selectedWalletType.value === "FIAT" && (
              <FiatWithdrawAmount />
            )}

            {step === 3 &&
              ["ECO", "SPOT"].includes(selectedWalletType.value) && (
                <SelectNetwork />
              )}

            {step === 4 &&
              ["ECO", "SPOT"].includes(selectedWalletType.value) && (
                <WithdrawAmount />
              )}

            {step === 5 && <WithdrawConfirmed />}

            <hr className="my-6 border-t border-muted-200 dark:border-muted-800" />
            <div className="text-center">
              <p className="mt-4 space-x-2 font-sans text-sm leading-5 text-muted-600 dark:text-muted-400">
                <span>{t("Having any trouble")}</span>
                <Link
                  href="/user/support/ticket"
                  className="font-medium text-primary-600 underline-offset-4 transition duration-150 ease-in-out hover:text-primary-500 hover:underline focus:underline focus:outline-none"
                >
                  {t("Contact us")}
                </Link>
              </p>
            </div>

            {selectedWalletType.value === "FIAT" && (
              <Faq category="WITHDRAW_FIAT" />
            )}

            {selectedWalletType.value === "SPOT" && (
              <Faq category="WITHDRAW_SPOT" />
            )}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white shadow-md flex justify-between rounded-t-md items-center flex-col md:flex-row dark:bg-muted-800">
              <p className="text-sm text-center text-gray-500 dark:text-muted-300">
                {t("Please note that withdrawing funds may take some time.")}
              </p>
              <span
                className="text-sm text-center text-muted-500 dark:text-muted-200 underline cursor-pointer"
                onClick={() => {
                  clearAll();
                  router.back();
                }}
              >
                {t("Cancel")}
              </span>
            </div>
          </form>
        ) : (
          <>
            <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center pt-36 pb-10">
              <p className="text-lg font-semibold text-red-600">
                {t(
                  "Withdrawals are currently disabled. Please contact support for more information."
                )}
              </p>

              <hr className="my-6 border-t border-muted-200 dark:border-muted-800" />

              <div className="text-center">
                <p className="mt-4 space-x-2 font-sans text-sm leading-5 text-muted-600 dark:text-muted-400">
                  <span>{t("Having any trouble")}</span>
                  <Link
                    href="/user/support/ticket"
                    className="font-medium text-primary-600 underline-offset-4 transition duration-150 ease-in-out hover:text-primary-500 hover:underline focus:underline focus:outline-none"
                  >
                    {t("Contact us")}
                  </Link>
                </p>

                <span
                  className="text-sm text-center text-muted-500 dark:text-muted-200 underline cursor-pointer"
                  onClick={() => router.back()}
                >
                  {t("Go back")}
                </span>
              </div>
            </div>
          </>
        )}
      </main>
    </MinimalLayout>
  );
}
