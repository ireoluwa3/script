import { memo } from "react";
import Button from "@/components/elements/base/button/Button";
import { Icon } from "@iconify/react";
import { useDepositStore } from "@/stores/user/wallet/deposit";
import { useTranslation } from "next-i18next";
import RadioHeadless from "@/components/elements/form/radio/RadioHeadless";
const SelectWalletTypeBase = ({}) => {
  const { t } = useTranslation();
  const {
    walletTypes,
    selectedWalletType,
    setSelectedWalletType,
    setStep,
    fetchCurrencies,
  } = useDepositStore();

  return (
    <div>
      <div className="mb-12 space-y-1 text-center font-sans">
        <h2 className="text-2xl font-light text-muted-800 dark:text-muted-100">
          {t("Select a Wallet Type")}
        </h2>
        <p className="text-sm text-muted-400">
          {t("Pick one of the following wallet types to continue")}
        </p>
      </div>

      <div className="mx-auto mb-4 w-full max-w-lg rounded px-8 pb-8">
        {/* <RadioHeadless
              name="radio_custom"
              defaultChecked
              checked={activeRadio === "starter"}
              onChange={() => {
                setActiveRadio("starter");
              }}
            >
              <Card
                shape="curved"
                className="relative border-2 p-5 peer-checked:!border-success-500 peer-checked:!bg-success-500/10 peer-checked:[&>span]:!opacity-100"
              >
                <div className="flex flex-col">
                  <h5 className="mb-3 font-sans text-sm font-medium uppercase leading-tight text-muted-500 dark:text-muted-200">
                    Starter
                  </h5>

                  <h6 className="font-sans font-normal text-muted-800 dark:text-muted-100">
                    <span className="text-4xl">1</span>

                    <span className="text-2xl uppercase">GB</span>
                  </h6>

                  <div className="font-sans">
                    <span className="text-xl font-normal text-muted-800 dark:text-muted-100">
                      $5
                    </span>

                    <span className="text-sm font-medium text-muted-500 dark:text-muted-400">
                      /month
                    </span>
                  </div>
                </div>

                <span className="absolute end-2 top-3 block opacity-0">
                  <Icon
                    icon="ph:check-circle-duotone"
                    className="h-7 w-7 text-success-500"
                  />
                </span>
              </Card>
            </RadioHeadless> */}

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {walletTypes.map((walletType) => (
            <RadioHeadless
              key={walletType.value}
              name="walletType"
              checked={selectedWalletType.value === walletType.value}
              onChange={() => setSelectedWalletType(walletType)}
            >
              <div className="flex items-center justify-between p-4 bg-white dark:bg-muted-800 rounded-md shadow-md">
                <div className="flex items-center space-x-4">
                  <h5 className="text-lg font-medium text-muted-800 dark:text-muted-100">
                    {t(walletType.label)}
                  </h5>
                </div>
                <div className="flex items-center">
                  {selectedWalletType.value === walletType.value && (
                    <Icon
                      icon="ph:check-circle-duotone"
                      className="h-7 w-7 text-success-500"
                    />
                  )}
                </div>
              </div>
            </RadioHeadless>
          ))}
        </div>

        <div className="mt-6">
          <Button
            type="button"
            color="primary"
            size="lg"
            className="w-full"
            onClick={() => {
              fetchCurrencies();
              setStep(2);
            }}
            disabled={selectedWalletType.value === ""}
          >
            {t("Continue")}
            <Icon icon="mdi:chevron-right" className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
export const SelectWalletType = memo(SelectWalletTypeBase);
