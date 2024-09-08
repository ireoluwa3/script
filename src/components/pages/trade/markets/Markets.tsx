import React, { memo, useState, useEffect } from "react";
import { SearchBar } from "./SearchBar";
import { MarketList } from "./MarketList";
import { MarketTab } from "./MarketTab";
import { useRouter } from "next/router";
import useMarketStore from "@/stores/trade/market";
import useWebSocketStore from "@/stores/trade/ws";
import { debounce } from "lodash";
import { useDashboardStore } from "@/stores/dashboard";
import $fetch from "@/utils/api";

const MarketsBase: React.FC = () => {
  const {
    market,
    searchQuery,
    fetchData,
    setPriceChangeData,
    getPrecisionBySymbol,
  } = useMarketStore();

  const { hasExtension } = useDashboardStore();
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
      debouncedFetchTickers();

      return () => {
        setTickersFetched(false);
      };
    }
  }, [router.isReady, currency, pair]);

  const fetchTickers = async () => {
    const { data, error } = await $fetch({
      url: "/api/exchange/ticker",
      silent: true,
    });

    if (!error) {
      updateItems(data);
    }

    setTickersFetched(true);
  };

  const debouncedFetchTickers = debounce(fetchTickers, 100);

  useEffect(() => {
    if (router.isReady && market) {
      const { isEco } = market;
      const path = isEco ? `/api/ext/ecosystem/market` : `/api/exchange/market`;

      createConnection("tradesConnection", path, {
        onOpen: () => {
          console.log("Trades connection open");
        },
      });

      if (hasExtension("ecosystem")) {
        createConnection("ecoTradesConnection", `/api/ext/ecosystem/market`, {
          onOpen: () => {
            console.log("Eco trades connection open");
          },
        });
      }

      return () => {
        if (!router.query.symbol) {
          removeConnection("tradesConnection");
          if (hasExtension("ecosystem")) {
            removeConnection("ecoTradesConnection");
          }
        }
      };
    }
  }, [router.isReady, market?.symbol]);

  const [tickersConnected, setTickersConnected] = useState(false);
  const [ecoTickersConnected, setEcoTickersConnected] = useState(false);

  useEffect(() => {
    if (tickersFetched) {
      createConnection("tickersConnection", `/api/exchange/ticker`, {
        onOpen: () => {
          subscribe("tickersConnection", "tickers");
        },
      });
      setTickersConnected(true);

      if (hasExtension("ecosystem")) {
        createConnection("ecoTickersConnection", `/api/ext/ecosystem/ticker`, {
          onOpen: () => {
            subscribe("ecoTickersConnection", "tickers");
          },
        });

        setEcoTickersConnected(true);
      }

      return () => {
        unsubscribe("tickersConnection", "tickers");
        if (hasExtension("ecosystem")) {
          unsubscribe("ecoTickersConnection", "tickers");
        }
      };
    }
  }, [tickersFetched]);

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
        "tickersConnection",
        handleTickerMessage,
        messageFilter
      );

      return () => {
        removeMessageHandler("tickersConnection", handleTickerMessage);
      };
    }
  }, [tickersConnected]);

  useEffect(() => {
    if (ecoTickersConnected) {
      addMessageHandler(
        "ecoTickersConnection",
        handleTickerMessage,
        messageFilter
      );

      return () => {
        removeMessageHandler("ecoTickersConnection", handleTickerMessage);
      };
    }
  }, [ecoTickersConnected]);

  return (
    <div className="h-full max-h-[50vh] p-2">
      <SearchBar />
      {searchQuery === "" && <MarketTab />}
      <MarketList />
    </div>
  );
};

export const Markets = memo(MarketsBase);
