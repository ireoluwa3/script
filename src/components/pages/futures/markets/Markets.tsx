import React, { memo, useState, useEffect } from "react";
import { useRouter } from "next/router";
import useFuturesMarketStore from "@/stores/futures/market";
import useWebSocketStore from "@/stores/trade/ws";
import { debounce } from "lodash";
import { SearchBar } from "./SearchBar";
import { MarketTab } from "./MarketTab";
import { MarketList } from "./MarketList";
import $fetch from "@/utils/api";

const MarketsBase: React.FC = () => {
  const {
    market,
    searchQuery,
    fetchData,
    setPriceChangeData,
    getPrecisionBySymbol,
  } = useFuturesMarketStore();

  const [currency, setCurrency] = useState<string | null>(null);
  const [pair, setPair] = useState<string | null>(null);
  const router = useRouter();
  const [tickersFetched, setTickersFetched] = useState(false);

  const {
    createConnection,
    removeConnection,
    addMessageHandler,
    removeMessageHandler,
    subscribe,
    unsubscribe,
  } = useWebSocketStore();

  useEffect(() => {
    if (router.query.symbol) {
      const [newCurrency, newPair] =
        typeof router.query.symbol === "string"
          ? router.query.symbol.split("_")
          : [];
      setCurrency(newCurrency);
      setPair(newPair);
    }
  }, [router.query.symbol]);

  const updateItems = (message) => {
    Object.keys(message).forEach((symbol) => {
      const update = message[symbol];
      if (update.last !== undefined && update.change !== undefined) {
        const precision = getPrecisionBySymbol(symbol);
        setPriceChangeData(
          symbol,
          update.last.toFixed(precision.price),
          update.change.toFixed(2)
        );
      }
    });
  };

  const debouncedFetchData = debounce(fetchData, 100);

  useEffect(() => {
    if (router.isReady && currency && pair) {
      debouncedFetchData({ currency, pair });

      return () => {
        setTickersFetched(false);
      };
    }
  }, [router.isReady, currency, pair]);

  useEffect(() => {
    if (router.isReady && market) {
      const path = `/api/ext/futures/market`;

      createConnection("futuresTradesConnection", path, {
        onOpen: () => {
          console.log("Trades connection open");
        },
      });

      setTickersFetched(true);

      return () => {
        if (!router.query.symbol) {
          removeConnection("futuresTradesConnection");
        }
      };
    }
  }, [router.isReady, market?.symbol]);

  const [tickersConnected, setTickersConnected] = useState(false);

  useEffect(() => {
    if (router.isReady && tickersFetched) {
      createConnection("futuresTickersConnection", `/api/ext/futures/ticker`, {
        onOpen: () => {
          subscribe("futuresTickersConnection", "tickers");
        },
      });

      setTickersConnected(true);

      return () => {
        unsubscribe("futuresTickersConnection", "tickers");
      };
    }
  }, [router.isReady, tickersFetched]);

  const handleTickerMessage = (message) => {
    const { data } = message;
    if (!data) return;
    updateItems(data);
  };

  const messageFilter = (message) =>
    message.stream && message.stream === "tickers";

  useEffect(() => {
    if (tickersConnected) {
      addMessageHandler(
        "futuresTickersConnection",
        handleTickerMessage,
        messageFilter
      );

      return () => {
        removeMessageHandler("futuresTickersConnection", handleTickerMessage);
      };
    }
  }, [tickersConnected]);

  return (
    <div className="h-full max-h-[50vh] p-2">
      <SearchBar />
      {searchQuery === "" && <MarketTab />}
      <MarketList />
    </div>
  );
};

export const Markets = memo(MarketsBase);
