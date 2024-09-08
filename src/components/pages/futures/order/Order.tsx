import { memo, useEffect, useState } from "react";
import { OrderProps } from "./Order.types";
import { OrderInput } from "./OrderInput";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverDescription,
  PopoverHeading,
  PopoverClose,
} from "@/components/elements/addons/popover/Popover";
import { CompactOrderInput } from "./CompactOrderInput";
import { useFuturesOrderStore } from "@/stores/futures/order";
import { debounce } from "lodash";
import useFuturesMarketStore from "@/stores/futures/market";
import { useTranslation } from "next-i18next";

const OrderBase = ({}: OrderProps) => {
  const { t } = useTranslation();
  const { fetchWallet } = useFuturesOrderStore();
  const { market } = useFuturesMarketStore();
  const [subTab, setSubTab] = useState("MARKET");
  const debouncedFetchWallet = debounce(fetchWallet, 100);

  useEffect(() => {
    if (market) {
      debouncedFetchWallet("FUTURES", market.pair);
    }
  }, [market]);

  return (
    <div className="w-full flex flex-col h-full">
      <div className="border-b border-muted-200 dark:border-muted-800 md:overflow-x-auto overflow-y-hidden">
        <div className="flex gap-2 min-h-[36px]">
          <Popover placement="top">
            <PopoverTrigger>
              <button
                type="button"
                className={`shrink-0 border-b-2 px-6 py-2 text-sm transition-colors duration-300
                        ${
                          subTab === "MARKET"
                            ? "border-warning-500 text-warning-500 dark:text-warning-400"
                            : "border-transparent text-muted-400 hover:text-muted-500 dark:text-muted-600 dark:hover:text-muted-500"
                        }
                      `}
                onClick={() => setSubTab("MARKET")}
              >
                <span>{t("Market")}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="relative z-50 flex w-72 gap-2 rounded-lg border border-muted-200 bg-white p-4 shadow-xl shadow-muted-300/30 dark:border-muted-700 dark:bg-muted-800 dark:shadow-muted-800/20">
              <div className="pe-3">
                <PopoverHeading className="mb-1 font-sans text-sm font-medium text-muted-800 dark:text-muted-100">
                  {t("Market Order")}
                </PopoverHeading>
                <PopoverDescription className="font-sans text-xs leading-tight text-muted-500 dark:text-muted-400">
                  {t(
                    "A market order is an instruction to buy or sell a futures contract immediately (at the market\u2019s current price), while a limit order is an instruction to wait until the price hits a specific or better price before being executed."
                  )}
                </PopoverDescription>
              </div>
              <PopoverClose className="absolute end-4 top-4 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-muted-400 transition-colors duration-300 hover:bg-muted-100 hover:text-muted-800 dark:hover:bg-muted-700 dark:hover:text-muted-100" />
            </PopoverContent>
          </Popover>
          <Popover placement="top">
            <PopoverTrigger>
              <button
                type="button"
                className={`shrink-0 border-b-2 px-6 py-2 text-sm transition-colors duration-300
                        ${
                          subTab === "LIMIT"
                            ? "border-warning-500 text-warning-500 dark:text-warning-400"
                            : "border-transparent text-muted-400 hover:text-muted-500 dark:text-muted-600 dark:hover:text-muted-500"
                        }
                      `}
                onClick={() => setSubTab("LIMIT")}
              >
                <span>{t("Limit")}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="relative z-50 flex w-72 gap-2 rounded-lg border border-muted-200 bg-white p-4 shadow-xl shadow-muted-300/30 dark:border-muted-700 dark:bg-muted-800 dark:shadow-muted-800/20">
              <div className="pe-3">
                <PopoverHeading className="mb-1 font-sans text-sm font-medium text-muted-800 dark:text-muted-100">
                  {t("Limit Order")}
                </PopoverHeading>
                <PopoverDescription className="font-sans text-xs leading-tight text-muted-500 dark:text-muted-400">
                  {t(
                    "A limit order is an order you place on the order book with a specific limit price. It will only be executed if the market price reaches your limit price (or better). You may use limit orders to buy a futures contract at a lower price or sell at a higher price than the current market price."
                  )}
                </PopoverDescription>
              </div>
              <PopoverClose className="absolute end-4 top-4 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-muted-400 transition-colors duration-300 hover:bg-muted-100 hover:text-muted-800 dark:hover:bg-muted-700 dark:hover:text-muted-100" />
            </PopoverContent>
          </Popover>
          <Popover placement="top">
            <PopoverTrigger>
              <button
                type="button"
                className={`shrink-0 border-b-2 px-6 py-2 text-sm transition-colors duration-300
                        ${
                          subTab === "STOPLIMIT"
                            ? "border-warning-500 text-warning-500 dark:text-warning-400"
                            : "border-transparent text-muted-400 hover:text-muted-500 dark:text-muted-600 dark:hover:text-muted-500"
                        }
                      `}
                onClick={() => setSubTab("STOPLIMIT")}
              >
                <span>{t("Stop Limit")}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="relative z-50 flex w-72 gap-2 rounded-lg border border-muted-200 bg-white p-4 shadow-xl shadow-muted-300/30 dark:border-muted-700 dark:bg-muted-800 dark:shadow-muted-800/20">
              <div className="pe-3">
                <PopoverHeading className="mb-1 font-sans text-sm font-medium text-muted-800 dark:text-muted-100">
                  {t("Stop Limit Order")}
                </PopoverHeading>
                <PopoverDescription className="font-sans text-xs leading-tight text-muted-500 dark:text-muted-400">
                  {t(
                    "A stop limit order combines the features of a stop order and a limit order. It allows you to set a stop price at which the order converts to a limit order and executes at the limit price or better. Use it to manage risk by setting stop prices for taking profit or limiting losses."
                  )}
                </PopoverDescription>
              </div>
              <PopoverClose className="absolute end-4 top-4 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-muted-400 transition-colors duration-300 hover:bg-muted-100 hover:text-muted-800 dark:hover:bg-muted-700 dark:hover:text-muted-100" />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="w-full flex p-4 flex-col h-full">
        <div className="h-full w-full">
          <div className="flex-col sm:flex-row gap-5 md:gap-10 w-full h-full hidden sm:flex">
            <OrderInput type={subTab} side={"BUY"} />
            <OrderInput type={subTab} side={"SELL"} />
          </div>
          <div className="flex flex-col gap-4 w-full h-full pt-4 sm:hidden">
            <CompactOrderInput type={subTab} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const Order = memo(OrderBase);
