import React, { memo, useState, useEffect } from "react";
import { MarketTab } from "./MarketTab";
import { useRouter } from "next/router";
import useMarketStore from "@/stores/trade/market";
import { debounce } from "lodash";
import ThemeSwitcher from "@/components/widgets/ThemeSwitcher";
import { AccountDropdown } from "@/components/layouts/shared/AccountDropdown";
import Link from "next/link";
import LogoText from "@/components/vector/LogoText";
import { useBinaryOrderStore } from "@/stores/binary/order";
import Card from "@/components/elements/base/card/Card";
import { useTranslation } from "next-i18next";
import ButtonLink from "@/components/elements/base/button-link/ButtonLink";
import { SearchBar } from "../../trade/markets/SearchBar";
import { MarketList } from "../../trade/markets/MarketList";
import Dropdown from "@/components/elements/base/dropdown/Dropdown";
import { Icon } from "@iconify/react";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { useDashboardStore } from "@/stores/dashboard";
import useWebSocketStore from "@/stores/trade/ws";
import Button from "@/components/elements/base/button/Button";
import $fetch from "@/utils/api";

const BinaryNavBase: React.FC = () => {
  const { t } = useTranslation();
  const { profile } = useDashboardStore();
  const { market, fetchData, setPriceChangeData, getPrecisionBySymbol } =
    useMarketStore();
  const [marketReady, setMarketReady] = useState(false);
  const {
    createConnection,
    removeConnection,
    addMessageHandler,
    removeMessageHandler,
    subscribe,
    unsubscribe,
    isConnectionOpen,
  } = useWebSocketStore();
  const router = useRouter();
  const [currency, setCurrency] = useState<string | null>(null);
  const [pair, setPair] = useState<string | null>(null);
  const [tickersFetched, setTickersFetched] = useState(false);

  const getPrecision = (type) => Number(market?.precision?.[type] || 8);
  const { wallet, fetchWallet, getPracticeBalance, setPracticeBalance } =
    useBinaryOrderStore();
  const isPractice = router.query.practice === "true";

  const debouncedFetchWallet = debounce(fetchWallet, 100);

  useEffect(() => {
    if (!isPractice && market && pair) {
      debouncedFetchWallet(pair);
    }
  }, [pair, market]);

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
    if (router.isReady && currency && pair) {
      debouncedFetchData({ currency, pair });
      debouncedFetchTickers();

      return () => {
        setTickersFetched(false);
      };
    }
  }, [router.isReady, currency, pair]);

  useEffect(() => {
    if (router.isReady && market) {
      const path = `/api/exchange/market`;
      createConnection("tradesConnection", path);
      return () => {
        if (!router.query.symbol) {
          removeConnection("tradesConnection");
        }
      };
    }
  }, [router.isReady, market?.symbol]);

  const [tickersConnected, setTickersConnected] = useState(false);

  useEffect(() => {
    if (tickersFetched) {
      createConnection("tickersConnection", "/api/exchange/ticker", {
        onOpen: () => {
          subscribe("tickersConnection", "tickers");
        },
      });

      setTickersConnected(true);

      return () => {
        unsubscribe("tickersConnection", "tickers");
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

  const balance = isPractice
    ? getPracticeBalance(market?.currency, market?.pair)
    : wallet?.balance;

  const handleResetBalance = () => {
    if (isPractice && market?.currency && market?.pair) {
      setPracticeBalance(market.currency, market.pair, 10000);
    }
  };

  return (
    <div className="h-full max-h-[120px] p-2 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Link
          className="relative hidden sm:flex flex-shrink-0 flex-grow-0 items-center rounded-[.52rem] px-3 py-2 no-underline transition-all duration-300"
          href="/"
        >
          <LogoText
            className={`max-w-[100px] text-muted-900 dark:text-white`}
          />
        </Link>
        <Link href={"/user"}>
          <IconButton shape="rounded" color="muted">
            <Icon icon="line-md:chevron-left" className="h-5 w-5" />
          </IconButton>
        </Link>
        <Dropdown
          title={t("Markets")}
          indicator={false}
          toggleButton={
            <>
              {currency}/{pair}
            </>
          }
          toggleClassNames="border-muted-200 dark:border-transparent shadow-lg shadow-muted-300/30 dark:shadow-muted-800/30 dark:hover:bg-muted-900 border dark:hover:border-muted-800 rounded-full"
          width={300}
          shape="straight"
          toggleShape="rounded"
        >
          <div className="w-full h-full min-h-[40vh] min-w-[300px]">
            <div className="flex w-full h-[40vh] gap-2">
              <div className="bg-muted-200 dark:bg-muted-800 h-full mt-1 max-h-[40vh] overflow-y-auto slimscroll">
                <MarketTab />
              </div>
              <div className="w-full h-full flex flex-col pe-2">
                <SearchBar />
                <div className="max-h-[40vh] overflow-y-auto slimscroll">
                  <MarketList type="binary" />
                </div>
              </div>
            </div>
          </div>
        </Dropdown>
        {/* <Ticker /> */}
      </div>
      <div className="flex items-center gap-2">
        <Card
          className={`p-[7px] ms-2 px-3 text-sm sm:text-lg flex gap-2 ${
            isPractice ? "text-warning-500" : "text-success-500"
          }`}
          shape={"rounded"}
        >
          {balance?.toFixed(getPrecision("price")) || 0}
          <span className="hidden sm:block">{pair}</span>
        </Card>
        {!isPractice && (
          <ButtonLink
            href={
              profile?.id
                ? "/user/wallet/deposit"
                : "/login?return=/user/wallet/deposit"
            }
            color="success"
            size="md"
            shape={"rounded"}
          >
            {t("Deposit")}
          </ButtonLink>
        )}
        {isPractice && balance === 0 && (
          <Button
            onClick={handleResetBalance}
            color="primary"
            size="md"
            shape={"rounded"}
          >
            {t("Reload")}
          </Button>
        )}
        <div>
          <ThemeSwitcher />
        </div>

        <div className="hidden sm:flex">
          <AccountDropdown />
        </div>
      </div>
    </div>
  );
};
export const BinaryNav = memo(BinaryNavBase);
