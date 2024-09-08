import { memo, useEffect } from "react";
import ComboBox from "@/components/elements/form/combobox/ComboBox";
import Button from "@/components/elements/base/button/Button";
import { Icon } from "@iconify/react";
import { useTransferStore } from "@/stores/user/wallet/transfer";
import { useTranslation } from "next-i18next";

const SelectCurrencyBase = ({}) => {
  const { t } = useTranslation();
  const {
    selectedWalletType,
    setSelectedWalletType,
    currencies,
    selectedCurrency,
    setSelectedCurrency,
    targetCurrency,
    setTargetCurrency,
    setStep,
    transferType,
  } = useTransferStore();

  return (
    <div>
      <div className="mb-12 space-y-1 text-center font-sans">
        <h2 className="text-2xl font-light text-muted-800 dark:text-muted-100">
          {t("Select a")} {selectedWalletType.label} {t("Source Currency")}
        </h2>
        <p className="text-sm text-muted-400">
          {t("Choose the currency you want to transfer")}
        </p>
      </div>

      <div className="mx-auto mb-4 w-full max-w-lg rounded px-4 md:px-8 pb-8">
        <div className="flex flex-col gap-5">
          <ComboBox
            label={t("Source Currency")}
            selected={selectedCurrency}
            options={currencies?.from}
            setSelected={setSelectedCurrency}
            loading={!currencies?.from}
          />
          {transferType.value === "wallet" &&
            !["ECO", "FUTURES"].includes(selectedWalletType.value) && (
              <ComboBox
                label={t("Target Currency")}
                selected={targetCurrency}
                options={currencies?.to}
                setSelected={setTargetCurrency}
                loading={!currencies?.to}
              />
            )}
        </div>
        <div className="px-8">
          <div className="mx-auto mt-12 max-w-sm">
            <div className="flex w-full gap-4 justify-center">
              <Button
                type="button"
                size="lg"
                className="w-full"
                onClick={() => {
                  setSelectedWalletType({
                    value: "",
                    label: "Select a wallet type",
                  });
                  setStep(2);
                }}
              >
                <Icon icon="mdi:chevron-left" className="h-5 w-5" />
                {t("Go Back")}
              </Button>
              <Button
                type="button"
                color="primary"
                size="lg"
                className="w-full"
                onClick={() => {
                  setStep(5);
                }}
                disabled={
                  !selectedCurrency || selectedCurrency === "Select a currency"
                }
              >
                {t("Continue")}
                <Icon icon="mdi:chevron-right" className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SelectCurrency = memo(SelectCurrencyBase);
