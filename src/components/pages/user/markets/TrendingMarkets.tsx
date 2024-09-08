import React, { useEffect, useState, useCallback, useMemo } from "react";
import useWebSocketStore from "@/stores/trade/ws";
import { debounce } from "lodash";
import Avatar from "@/components/elements/base/avatar/Avatar";
import LineChart from "./LineChart";
import Link from "next/link";
import { useRouter } from "next/router";
import $fetch from "@/utils/api";
import Marquee from "@/components/elements/base/marquee";

interface MarketItem {
  symbol: string;
  currency: string;
  price: number;
  change: number;
  history: number[];
}

const generateFakeHistory = (initialPrice: number, length: number = 15) => {
  const history: number[] = [];
  let lastPrice = initialPrice;
  for (let i = 0; i < length; i++) {
    const variation = (Math.random() - 0.5) * 0.02;
    const price = lastPrice * (1 + variation);
    history.push(price);
    lastPrice = price;
  }
  return history;
};

const TrendingMarkets: React.FC = () => {
  const {
    createConnection,
    subscribe,
    unsubscribe,
    addMessageHandler,
    removeMessageHandler,
  } = useWebSocketStore();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  const [tickersFetched, setTickersFetched] = useState(false);
  const [marketItems, setMarketItems] = useState<MarketItem[]>([]);
  const maxItemsToShow = 10;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const updateItem = useCallback(
    (existingItem: MarketItem, update: any): MarketItem => {
      const parseToNumber = (value: any) => {
        const parsedValue =
          typeof value === "number" ? value : parseFloat(value);
        return isNaN(parsedValue) ? 0 : parsedValue;
      };

      const newPrice =
        update?.last !== undefined
          ? parseToNumber(update.last)
          : existingItem.price;

      return {
        ...existingItem,
        price: newPrice,
        change:
          update?.change !== undefined
            ? parseToNumber(update.change)
            : existingItem.change,
        history: [...existingItem.history, newPrice].slice(-15),
      };
    },
    []
  );

  const updateItems = useCallback(
    (newData: any) => {
      setMarketItems((prevItems) => {
        const updatedItems = prevItems.map((item) => {
          const update = newData[item.symbol];
          return update ? updateItem(item, update) : updateItem(item, null);
        });

        const newMarkets = Object.keys(newData)
          .filter((key) => !prevItems.find((item) => item.symbol === key))
          .map((key) => ({
            symbol: key,
            currency: key.split("/")[0],
            price: newData[key].last,
            change: newData[key].change,
            history: generateFakeHistory(newData[key].last),
          }));

        return [...updatedItems, ...newMarkets].slice(0, maxItemsToShow);
      });
    },
    [updateItem]
  );

  const debouncedUpdateItems = useCallback(debounce(updateItems, 100), [
    updateItems,
  ]);

  const fetchTickers = useCallback(async () => {
    const { data, error } = await $fetch({
      url: "/api/exchange/ticker",
      silent: true,
    });

    if (error) {
      return;
    }

    if (data) {
      debouncedUpdateItems(data);
    }

    setTickersFetched(true);
  }, [debouncedUpdateItems]);

  const debouncedFetchTickers = useCallback(debounce(fetchTickers, 100), [
    fetchTickers,
  ]);

  useEffect(() => {
    if (router.isReady) {
      debouncedFetchTickers();

      return () => {
        setTickersFetched(false);
      };
    }
  }, [router.isReady, debouncedFetchTickers]);

  useEffect(() => {
    if (tickersFetched) {
      createConnection("tickersConnection", "/api/exchange/ticker", {
        onOpen: () => {
          subscribe("tickersConnection", "tickers");
        },
      });

      return () => {
        unsubscribe("tickersConnection", "tickers");
      };
    }
  }, [tickersFetched, createConnection, subscribe, unsubscribe]);

  const handleTickerMessage = useCallback(
    (message: any) => {
      const { data } = message;
      if (!data) return;
      updateItems(data);
    },
    [updateItems]
  );

  const messageFilter = useCallback(
    (message: any) => message.stream && message.stream === "tickers",
    []
  );

  useEffect(() => {
    if (tickersFetched) {
      addMessageHandler(
        "tickersConnection",
        handleTickerMessage,
        messageFilter
      );

      return () => {
        removeMessageHandler("tickersConnection", handleTickerMessage);
      };
    }
  }, [
    tickersFetched,
    addMessageHandler,
    handleTickerMessage,
    messageFilter,
    removeMessageHandler,
  ]);

  const memoizedMarketItems = useMemo(
    () => marketItems.slice(0, maxItemsToShow),
    [marketItems]
  );

  if (!isMounted) {
    return null;
  }

  if (marketItems.length === 0) {
    return <div>Loading market data...</div>;
  }

  return (
    <div className="relative overflow-hidden whitespace-nowrap">
      <Marquee speed={32} showGradients={true} direction="rtl">
        {memoizedMarketItems.map((item, i) => (
          <Link key={i} href={`/trade/${item.symbol.replace("/", "_")}`}>
            <div
              className="p-4 mx-2 border border-muted-200 dark:border-muted-800 hover:border hover:border-primary-500 dark:hover:border dark:hover:border-primary-400 transition-all duration-300 bg-gradient-to-r from-white to-white dark:from-muted-900 dark:to-muted-1000 dark:bg-gradient-to-r rounded-xl"
              style={{
                width: "300px",
                flexShrink: 0,
                marginRight: "16px",
              }}
            >
              <div className="flex items-center gap-4 pe-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <Avatar
                      size="xxs"
                      src={`/img/crypto/${item.currency
                        .toLowerCase()
                        .replace("1000", "")}.webp`}
                      className="dark:invert"
                    />
                    <span className="text-md text-muted-700 dark:text-muted-200">
                      {item.symbol}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-muted-700 dark:text-muted-200 mb-2">
                    {item.price !== undefined ? item.price.toFixed(2) : "N/A"}
                  </div>
                  <div
                    className={`text-md font-semibold ${
                      item.change >= 0 ? "text-success-500" : "text-danger-500"
                    } mb-4`}
                  >
                    {item.change !== undefined ? item.change.toFixed(2) : "N/A"}
                    %
                  </div>
                </div>
                <div className="w-40 h-20 py-1">
                  <LineChart width={150} height={80} values={item.history} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </Marquee>
    </div>
  );
};

export default TrendingMarkets;
