import React, { useEffect } from "react";
import MinimalLayout from "@/layouts/Minimal";
import MinimalHeader from "@/components/widgets/MinimalHeader";
import { StepProgress } from "@/components/elements/addons/StepProgress";
import { SelectTransferType } from "@/components/pages/user/wallet/transfer/SelectTransferType"; // New component
import { SelectWalletType } from "@/components/pages/user/wallet/transfer/SelectWalletType";
import { SelectTargetWalletType } from "@/components/pages/user/wallet/transfer/SelectTargetWalletType";
import { SelectCurrency } from "@/components/pages/user/wallet/transfer/SelectCurrency";
import { TransferAmount } from "@/components/pages/user/wallet/transfer/TransferAmount";
import { TransferConfirmed } from "@/components/pages/user/wallet/transfer/TransferConfirmed";
import { useTransferStore } from "@/stores/user/wallet/transfer";
import { useDashboardStore } from "@/stores/dashboard";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { toast } from "sonner";
import Link from "next/link";

export default function AuthWizard() {
  const { t } = useTranslation();
  const { step, clearAll, transferType, initializeWalletTypes } =
    useTransferStore();
  const { profile, getSetting } = useDashboardStore();
  const router = useRouter();

  const transferEnabled = getSetting("transfer") !== "false";

  useEffect(() => {
    if (
      router.isReady &&
      getSetting("transferRestrictions") === "true" &&
      (!profile?.kyc?.status ||
        (parseFloat(profile?.kyc?.level || "0") < 2 &&
          profile?.kyc?.status !== "APPROVED")) &&
      transferEnabled
    ) {
      router.push("/user/profile?tab=kyc");
      toast.error(t("Please complete your KYC to transfer funds"));
    }
  }, [router.isReady, profile?.kyc?.status, transferEnabled]);

  useEffect(() => {
    if (router.isReady) initializeWalletTypes();
  }, [router.isReady]);

  // Clear all state when leaving the wizard or completing the process
  useEffect(() => {
    return () => {
      if (step === 6) {
        clearAll();
      }
    };
  }, [step]);

  const renderStep = () => {
    switch (step) {
      case 1:
        return <SelectTransferType />;
      case 2:
        return <SelectWalletType />;
      case 3:
        return transferType.value === "client" ? (
          <SelectCurrency />
        ) : (
          <SelectTargetWalletType />
        );
      case 4:
        return <SelectCurrency />;
      case 5:
        return <TransferAmount />;
      case 6:
        return <TransferConfirmed />;
      default:
        return null;
    }
  };

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
            "ph:check-circle-duotone",
          ]}
        />
        {transferEnabled ? (
          <form
            action="#"
            method="POST"
            className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-stretch pt-36"
          >
            {renderStep()}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white shadow-md flex justify-between rounded-t-md items-center flex-col md:flex-row dark:bg-muted-800">
              <p className="text-sm text-center text-gray-500 dark:text-muted-300">
                {t("Please note that transferring funds may take some time.")}
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
                  "Transfers are currently disabled. Please contact support for more information."
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
