import { memo } from "react";
import Button from "@/components/elements/base/button/Button";
import { Icon } from "@iconify/react";
import Avatar from "@/components/elements/base/avatar/Avatar";
import { useWithdrawStore } from "@/stores/user/wallet/withdraw";
import { useTranslation } from "next-i18next";
const SelectFiatWithdrawMethodBase = () => {
  const { t } = useTranslation();
  const {
    selectedCurrency,
    setSelectedCurrency,
    withdrawMethods,
    selectedWithdrawMethod,
    setSelectedWithdrawMethod,
    setStep,
  } = useWithdrawStore();
  return (
    <div>
      <div className="mb-12 space-y-1 text-center font-sans">
        <h2 className="text-2xl font-light text-muted-800 dark:text-muted-100">
          {t("Select a Payment Method")}
        </h2>
        <p className="text-sm text-muted-400">
          {t("Pick one of the following payment methods to withdraw funds.")}
        </p>
      </div>

      <div className="mx-auto mb-4 w-full max-w-xl space-y-5 rounded px-8 pb-8">
        {withdrawMethods?.gateways?.map((gateway) => (
          <div
            key={gateway.id}
            onClick={() => {
              setSelectedWithdrawMethod(gateway);
            }}
            className={
              selectedWithdrawMethod?.alias === gateway.alias
                ? "border border-primary-600 dark:border-primary-400 rounded cursor-pointer transition-colors duration-30 bg-white dark:bg-muted-950"
                : "group relative border rounded cursor-pointer transition-colors duration-300 border-muted-200 dark:border-muted-800 hover:border-primary-600 dark:hover:border-primary-400 bg-muted-100 dark:bg-muted-800 hover:bg-white dark:hover:bg-muted-900"
            }
          >
            <div className="flex items-center justify-between gap-5 px-4 py-3 font-sans text-sm text-muted-600 transition-colors duration-300">
              <div className="flex items-center gap-4">
                <Avatar src={gateway.image} alt={gateway.name} size="md" />
                <div>
                  <h3 className="text-lg font-medium text-muted-800 dark:text-muted-100">
                    {gateway.title}
                  </h3>
                  <p className="text-sm text-muted-500 dark:text-muted-400">
                    {gateway.description}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 flex-col min-w-12">
                <span className="text-sm text-muted-500 dark:text-muted-400">
                  {gateway.fixedFee} {selectedCurrency}
                </span>
                <span className="text-sm text-muted-500 dark:text-muted-400">
                  {gateway.percentageFee}%
                </span>
              </div>
            </div>
          </div>
        ))}
        {withdrawMethods?.methods?.map((method) => (
          <div
            key={method.id}
            onClick={() => {
              setSelectedWithdrawMethod(method);
            }}
            className={
              selectedWithdrawMethod?.id === method.id
                ? "border border-primary-600 dark:border-primary-400 rounded cursor-pointer transition-colors duration-30 bg-white dark:bg-muted-950"
                : "group relative border rounded cursor-pointer transition-colors duration-300 border-muted-200 dark:border-muted-800 hover:border-primary-600 dark:hover:border-primary-400 bg-muted-100 dark:bg-muted-800 hover:bg-white dark:hover:bg-muted-900"
            }
          >
            <div className="flex items-center justify-between gap-5 px-4 py-3 font-sans text-sm text-muted-600 transition-colors duration-300 peer-hover:bg-muted-100 dark:text-muted-400 dark:peer-hover:bg-muted-800 peer-checked:[&>button]:hidden peer-checked:[&>div]:!flex">
              <div className="flex items-center gap-4">
                <Avatar src={method.image} alt={method.title} size="md" />
                <div>
                  <h3 className="text-lg font-medium text-muted-800 dark:text-muted-100">
                    {method.title}
                  </h3>
                  <p className="text-sm text-muted-500 dark:text-muted-400">
                    {method.instructions}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 flex-col min-w-12">
                <span className="text-sm text-muted-500 dark:text-muted-400">
                  {method.fixedFee} {selectedCurrency}
                </span>
                <span className="text-sm text-muted-500 dark:text-muted-400">
                  {method.percentageFee}%
                </span>
              </div>
            </div>
          </div>
        ))}
        <div className="mx-auto !mt-16 max-w-sm">
          <div className="flex w-full gap-4 justify-center">
            <Button
              type="button"
              size="lg"
              className="w-full"
              onClick={() => {
                setSelectedCurrency("Select a currency");
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
                setStep(4);
              }}
              disabled={
                !selectedWithdrawMethod || selectedWithdrawMethod === ""
              }
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
export const SelectFiatWithdrawMethod = memo(SelectFiatWithdrawMethodBase);
