import { memo } from "react";
import ListBox from "@/components/elements/form/listbox/Listbox";
import Button from "@/components/elements/base/button/Button";
import { Icon } from "@iconify/react";
import { useTransferStore } from "@/stores/user/wallet/transfer";
import { useTranslation } from "next-i18next";

const SelectTargetWalletTypeBase = () => {
  const { t } = useTranslation();
  const {
    walletTypes,
    selectedWalletType,
    selectedTargetWalletType,
    setSelectedTargetWalletType,
    setStep,
    fetchCurrencies,
  } = useTransferStore();

  // In SelectTargetWalletTypeBase component
  const getFilteredWalletTypes = () => {
    const { value: fromWalletType } = selectedWalletType;

    if (fromWalletType === "ECO") {
      return walletTypes.filter(
        (type) =>
          type.value === "FIAT" ||
          type.value === "SPOT" ||
          type.value === "FUTURES"
      );
    } else if (fromWalletType === "FUTURES") {
      return walletTypes.filter((type) => type.value === "ECO");
    } else {
      return walletTypes.filter(
        (type) => type.value !== "FUTURES" && type.value !== fromWalletType
      );
    }
  };

  return (
    <div>
      <div className="mb-12 space-y-1 text-center font-sans">
        <h2 className="text-2xl font-light text-muted-800 dark:text-muted-100">
          {t("Select a Target Wallet Type")}
        </h2>
        <p className="text-sm text-muted-400">
          {t("Choose the wallet type you want to transfer to")}
        </p>
      </div>

      <div className="mx-auto mb-4 w-full max-w-lg rounded px-8 pb-8">
        <ListBox
          selected={selectedTargetWalletType}
          options={getFilteredWalletTypes()}
          setSelected={setSelectedTargetWalletType}
        />

        <div className="mx-auto !mt-8 max-w-sm">
          <div className="flex w-full gap-4 justify-center">
            <Button
              type="button"
              size="lg"
              onClick={() => {
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
                fetchCurrencies();
                setStep(4);
              }}
              disabled={selectedTargetWalletType.value === ""}
            >
              {t("Continue")}
              <Icon icon="mdi:chevron-right" className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SelectTargetWalletType = memo(SelectTargetWalletTypeBase);
