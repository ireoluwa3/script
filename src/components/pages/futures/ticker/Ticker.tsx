import React, { useState, useEffect, memo } from "react";
import { formatLargeNumber } from "@/utils/market";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useDashboardStore } from "@/stores/dashboard";
import useFuturesMarketStore from "@/stores/futures/market";
import useWebSocketStore from "@/stores/trade/ws";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const TickerBase = () => {
  const { t } = useTranslation();
  const { isDark } = useDashboardStore();
  const { market } = useFuturesMarketStore();
  const {
    subscribe,
    unsubscribe,
    addMessageHandler,
    removeMessageHandler,
    futuresTradesConnection,
  } = useWebSocketStore();
  const router = useRouter();
  const getPrecision = (type: string) => Number(market?.precision?.[type] || 8);

  const [ticker, setTicker] = useState<Ticker>();
  const [clientIsDark, setClientIsDark] = useState(false);

  useEffect(() => {
    setClientIsDark(isDark);
  }, [isDark]);

  useEffect(() => {
    if (router.isReady && market && futuresTradesConnection?.isConnected) {
      const handleBinanceTickerMessage = (message: any) => {
        if (message.stream !== "ticker") return;
        const { data } = message;
        if (!data) return;

        const { info, ...tickerData } = data;
        setTicker(tickerData);
      };

      const handleKucoinTickerMessage = (message: any) => {
        if (message.stream !== "ticker") return;
        const { data } = message;
        if (!data || data.symbol !== market.symbol) return;

        const tickerData = {
          symbol: data.symbol,
          timestamp: data.timestamp,
          datetime: data.datetime,
          bid: data.bid,
          bidVolume: data.bidVolume,
          ask: data.ask,
          askVolume: data.askVolume,
          close: data.close,
          last: data.last,
        };

        setTicker(tickerData);
      };

      const resetTicker = () => {
        setTicker(undefined);
      };

      const messageFilter = (message: any) => message.stream === "ticker";
      let handler;
      switch (process.env.NEXT_PUBLIC_EXCHANGE) {
        case "bin":
          handler = handleBinanceTickerMessage;
          break;
        case "kuc":
          handler = handleKucoinTickerMessage;
          break;
        default:
          handler = handleBinanceTickerMessage;
          break;
      }

      addMessageHandler("futuresTradesConnection", handler, messageFilter);
      subscribe("futuresTradesConnection", "ticker", {
        symbol: market?.symbol,
      });

      return () => {
        unsubscribe("futuresTradesConnection", "ticker", {
          symbol: market?.symbol,
        });
        removeMessageHandler("futuresTradesConnection", handler);
        resetTicker();
      };
    }
  }, [router.isReady, market, futuresTradesConnection?.isConnected]);

  return (
    <div className="flex gap-5 p-2 text-muted-800 dark:text-muted-200 items-center justify-center h-full">
      <div className="pe-5 border-r border-muted-300 dark:border-muted-700 hidden md:block">
        {ticker?.symbol || (
          <Skeleton
            width={80}
            height={16}
            baseColor={clientIsDark ? "#27272a" : "#f7fafc"}
            highlightColor={clientIsDark ? "#3a3a3e" : "#edf2f7"}
          />
        )}
      </div>
      <div className="flex w-full h-full">
        <div className="w-1/3 flex flex-col md:flex-row items-center h-full gap-1">
          <div className="w-full md:w-1/2 text-sm md:text-lg">
            <span className="block md:hidden">
              {ticker?.symbol || (
                <Skeleton
                  width={60}
                  height={12}
                  baseColor={clientIsDark ? "#27272a" : "#f7fafc"}
                  highlightColor={clientIsDark ? "#3a3a3e" : "#edf2f7"}
                />
              )}
            </span>
            <span>
              {ticker?.last?.toFixed(5) || (
                <Skeleton
                  width={40}
                  height={10}
                  baseColor={clientIsDark ? "#27272a" : "#f7fafc"}
                  highlightColor={clientIsDark ? "#3a3a3e" : "#edf2f7"}
                />
              )}
            </span>
          </div>
          {process.env.NEXT_PUBLIC_EXCHANGE === "bin" && (
            <div className="w-full md:w-1/2 text-xs md:text-sm">
              <span className="text-muted-600 dark:text-muted-400">
                {t("24h change")}
              </span>
              <div className="text-md flex gap-1 items-center">
                <span
                  className={
                    ticker && ticker?.percentage && ticker.percentage >= 0
                      ? ticker?.percentage === 0
                        ? ""
                        : "text-success-500"
                      : "text-danger-500"
                  }
                >
                  {ticker?.change !== undefined ? (
                    ticker.change.toFixed(2)
                  ) : (
                    <Skeleton
                      width={40}
                      height={10}
                      baseColor={clientIsDark ? "#27272a" : "#f7fafc"}
                      highlightColor={clientIsDark ? "#3a3a3e" : "#edf2f7"}
                    />
                  )}
                </span>
                <span
                  className={`text-xs ${
                    ticker && ticker?.percentage && ticker.percentage >= 0
                      ? ticker?.percentage === 0
                        ? ""
                        : "text-success-500"
                      : "text-danger-500"
                  }`}
                >
                  {ticker?.percentage !== undefined ? (
                    `${ticker.percentage.toFixed(2)}%`
                  ) : (
                    <Skeleton
                      width={30}
                      height={8}
                      baseColor={clientIsDark ? "#27272a" : "#f7fafc"}
                      highlightColor={clientIsDark ? "#3a3a3e" : "#edf2f7"}
                    />
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="w-1/3 flex flex-col md:flex-row text-xs md:text-sm h-full items-center justify-between">
          <div className="w-full md:w-1/2">
            <span className="text-muted-600 dark:text-muted-400">
              {t("24h high")}
            </span>
            <div>
              {ticker?.high?.toFixed(5) || (
                <Skeleton
                  width={40}
                  height={10}
                  baseColor={clientIsDark ? "#27272a" : "#f7fafc"}
                  highlightColor={clientIsDark ? "#3a3a3e" : "#edf2f7"}
                />
              )}
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <span className="text-muted-600 dark:text-muted-400">
              {t("24h low")}
            </span>
            <div>
              {ticker?.low?.toFixed(5) || (
                <Skeleton
                  width={40}
                  height={10}
                  baseColor={clientIsDark ? "#27272a" : "#f7fafc"}
                  highlightColor={clientIsDark ? "#3a3a3e" : "#edf2f7"}
                />
              )}
            </div>
          </div>
        </div>
        <div className="w-1/3 flex flex-col md:flex-row text-xs md:text-sm h-full items-center justify-between">
          <div className="w-full md:w-1/2">
            <span className="text-muted-600 dark:text-muted-400">
              {t("24h volume")} ({market?.currency})
            </span>
            <div>
              {formatLargeNumber(
                ticker?.baseVolume || 0,
                getPrecision("amount")
              ) || (
                <Skeleton
                  width={40}
                  height={10}
                  baseColor={clientIsDark ? "#27272a" : "#f7fafc"}
                  highlightColor={clientIsDark ? "#3a3a3e" : "#edf2f7"}
                />
              )}
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <span className="text-muted-600 dark:text-muted-400">
              {t("24h volume")} ({market?.pair})
            </span>
            <div>
              {formatLargeNumber(
                ticker?.quoteVolume || 0,
                getPrecision("price")
              ) || (
                <Skeleton
                  width={40}
                  height={10}
                  baseColor={clientIsDark ? "#27272a" : "#f7fafc"}
                  highlightColor={clientIsDark ? "#3a3a3e" : "#edf2f7"}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Ticker = memo(TickerBase);
