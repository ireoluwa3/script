import Avatar from "@/components/elements/base/avatar/Avatar";
import Button from "@/components/elements/base/button/Button";
import { useDepositStore } from "@/stores/user/forex/deposit";
import { Icon } from "@iconify/react";
import { memo } from "react";
import { useTranslation } from "next-i18next";
const SelectNetworkBase = ({}) => {
  const { t } = useTranslation();
  const {
    selectedCurrency,
    setSelectedCurrency,
    selectedDepositMethod,
    setSelectedDepositMethod,
    setStep,
    depositMethods,
  } = useDepositStore();
  if (!depositMethods || depositMethods.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <Icon
            icon="mdi:loading"
            className="h-12 w-12 animate-spin text-primary-500"
          />
          <p className="text-xl text-primary-500">
            {t("Loading")} {selectedCurrency} {t("networks...")}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="mb-12 space-y-1 text-center font-sans">
        <h2 className="text-2xl font-light text-muted-800 dark:text-muted-100">
          {t("Select a Network")}
        </h2>
        <p className="text-sm text-muted-400">
          {t("Pick one of the following currency networks to continue")}
        </p>
      </div>

      <div className="mx-auto mb-4 w-full max-w-4xl space-y-10 rounded px-8 pb-8">
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <h3 className="mb-1 font-sans font-medium text-muted-800 dark:text-muted-100">
              {selectedCurrency} {t("Networks")}
            </h3>
            <p className="font-sans text-sm text-muted-500 dark:text-muted-400 md:max-w-[190px]">
              {t("Select a network to continue")}
            </p>
          </div>
          <div className="md:col-span-8">
            <div className="mx-auto mb-4 w-full max-w-xl space-y-5 rounded px-8 pb-8">
              {depositMethods.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedDepositMethod(item);
                  }}
                  className={`cursor-pointer transition-colors duration-300 border rounded ${
                    selectedDepositMethod?.chain === item.chain
                      ? "border border-primary-600 dark:border-primary-400 rounded cursor-pointer transition-colors duration-30 bg-white dark:bg-muted-950"
                      : "group relative border rounded cursor-pointer transition-colors duration-300 border-muted-200 dark:border-muted-800 hover:border-primary-600 dark:hover:border-primary-400 bg-muted-100 dark:bg-muted-800 hover:bg-white dark:hover:bg-muted-900"
                  }`}
                >
                  <div className="flex items-center justify-between gap-5 px-4 py-3 font-sans text-sm text-muted-600 transition-colors duration-300">
                    <div className="flex gap-10">
                      <div className="flex justify-start items-center gap-2">
                        <Avatar
                          src={
                            `/img/crypto/${(
                              item.id || item.chain
                            ).toLowerCase()}.webp` || "/img/placeholder.svg"
                          }
                          alt={item.chain}
                          size="sm"
                        />
                        <span className="text-muted-800 dark:text-muted-200 text-md font-semibold">
                          {item.chain}
                        </span>
                      </div>
                      <div className="flex flex-col text-sm">
                        <div className="flex gap-1">
                          <span className="text-muted-500 dark:text-muted-400">
                            {t("Minimum Deposit")}
                          </span>
                          <span className="text-muted-800 dark:text-muted-200">
                            {item.limits?.deposit?.min ||
                              item.limits?.amount?.min ||
                              0}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <span className="text-muted-500 dark:text-muted-400">
                            {t("Maximum Deposit")}
                          </span>
                          <span className="text-muted-800 dark:text-muted-200">
                            {item.limits?.deposit?.max ||
                              item.limits?.amount?.max ||
                              "Unlimited"}
                          </span>
                        </div>
                        {item.fee && item.fee?.min && (
                          <div className="flex gap-1">
                            <span className="text-muted-500 dark:text-muted-400">
                              {t("Minimum Fee")}
                            </span>
                            <span className="text-muted-800 dark:text-muted-200">
                              {item.fee.min} {selectedCurrency}
                            </span>
                          </div>
                        )}
                        {item.fee && item.fee?.percentage && (
                          <div className="flex gap-1">
                            <span className="text-muted-500 dark:text-muted-400">
                              {t("Percentage Fee")}
                            </span>
                            <span className="text-muted-800 dark:text-muted-200">
                              {item.fee.percentage}%
                            </span>
                          </div>
                        )}
                        {item.fixedFee && (
                          <div className="flex gap-1">
                            <span className="text-muted-500 dark:text-muted-400">
                              {t("Fixed Deposit Fee")}
                            </span>
                            <span className="text-muted-800 dark:text-muted-200">
                              {item.fixedFee}
                            </span>
                          </div>
                        )}
                        {item.percentageFee && (
                          <div className="flex gap-1">
                            <span className="text-muted-500 dark:text-muted-400">
                              {t("Percentage Deposit Fee")}
                            </span>
                            <span className="text-muted-800 dark:text-muted-200">
                              {item.percentageFee}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

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
              disabled={!selectedDepositMethod}
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
export const SelectNetwork = memo(SelectNetworkBase);
