import React, { memo, useCallback, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Avatar from "@/components/elements/base/avatar/Avatar";
import Input from "@/components/elements/form/input/Input";
import Select from "@/components/elements/form/select/Select";
import HeadCell from "./HeadCell";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDashboardStore } from "@/stores/dashboard";
import { useTranslation } from "next-i18next";
import useMarketStore from "@/stores/trade/market";
import { debounce } from "lodash";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { formatLargeNumber } from "@/utils/market";
import useWebSocketStore from "@/stores/trade/ws";
import $fetch from "@/utils/api";

const MarketsBase = () => {
  const { t } = useTranslation();
  const {
    marketData,
    fetchData,
    setSearchQuery,
    getPrecisionBySymbol,
    setWithEco,
  } = useMarketStore();

  const {
    createConnection,
    subscribe,
    unsubscribe,
    addMessageHandler,
    removeMessageHandler,
  } = useWebSocketStore();

  const [items, setItems] = useState<any[]>([]);
  const [offset, setOffset] = useState(5);
  const [pages, setPages] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sorted, setSorted] = useState<{
    field: string;
    rule: "asc" | "desc";
  }>({
    field: "",
    rule: "asc",
  });

  const [pagination, setPagination] = useState({
    total: 0,
    lastPage: 0,
    currentPage: 1,
    from: 1,
    to: 10,
  });

  const router = useRouter();
  const { isDark, hasExtension, extensions } = useDashboardStore();
  const debouncedFetchData = debounce(fetchData, 100);
  const [tickersFetched, setTickersFetched] = useState(false);
  const [tickersConnected, setTickersConnected] = useState(false);
  const [ecoTickersConnected, setEcoTickersConnected] = useState(false);

  useEffect(() => {
    setItems(marketData);
    updatePagination(marketData.length, perPage, currentPage);
  }, [marketData, perPage, currentPage]);

  const updatePagination = (
    totalItems: number,
    itemsPerPage: number,
    currentPage: number
  ) => {
    const lastPage = Math.ceil(totalItems / itemsPerPage);
    const from = (currentPage - 1) * itemsPerPage + 1;
    const to = Math.min(currentPage * itemsPerPage, totalItems);

    setPagination({
      total: totalItems,
      lastPage,
      currentPage,
      from,
      to,
    });

    setPages(calculatePages(totalItems, itemsPerPage));
  };

  const calculatePages = (
    totalItems: number,
    itemsPerPage: number
  ): number[] => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  };

  const changePage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= pagination.lastPage) {
        setCurrentPage(page);
        updatePagination(items.length, perPage, page);
      }
    },
    [pagination.lastPage, perPage, items.length]
  );

  const changePerPage = (newPerPage: number) => {
    setPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
    updatePagination(items.length, newPerPage, 1);
  };

  const updateItem = (existingItem, update) => {
    const precision = getPrecisionBySymbol(existingItem.symbol);

    const parseToNumber = (value) => {
      const parsedValue = typeof value === "number" ? value : parseFloat(value);
      return isNaN(parsedValue) ? 0 : parsedValue;
    };

    return {
      ...existingItem,
      price:
        update.last !== undefined
          ? parseToNumber(update.last).toFixed(precision.price)
          : parseToNumber(existingItem.price).toFixed(precision.price),
      change:
        update.change !== undefined
          ? parseToNumber(update.change).toFixed(2)
          : parseToNumber(existingItem.change).toFixed(2),
      baseVolume:
        update.baseVolume !== undefined
          ? formatLargeNumber(update.baseVolume, precision.amount)
          : formatLargeNumber(existingItem.baseVolume, precision.amount),
      quoteVolume:
        update.quoteVolume !== undefined
          ? formatLargeNumber(update.quoteVolume, precision.price)
          : formatLargeNumber(existingItem.quoteVolume, precision.price),
      high: update.high !== undefined ? update.high : existingItem.high,
      low: update.low !== undefined ? update.low : existingItem.low,
      percentage:
        update.percentage !== undefined
          ? update.percentage
          : existingItem.percentage,
    };
  };

  const updateItems = (newData: any) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        const update = newData[item.symbol];
        return update ? updateItem(item, update) : item;
      });

      return updatedItems;
    });
  };

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
    if (router.isReady && extensions) {
      setWithEco(hasExtension("ecosystem"));
      debouncedFetchData();
      debouncedFetchTickers();

      return () => {
        setTickersFetched(false);
      };
    }
  }, [router.isReady, extensions]);

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

  function compareOnKey(key: string, rule: "asc" | "desc") {
    return function (a: any, b: any) {
      if (typeof a[key] === "string" && typeof b[key] === "string") {
        return rule === "asc"
          ? a[key].localeCompare(b[key])
          : b[key].localeCompare(a[key]);
      }
      if (Array.isArray(a[key]) && Array.isArray(b[key])) {
        return rule === "asc"
          ? a[key].length - b[key].length
          : b[key].length - a[key].length;
      }
      return rule === "asc" ? a[key] - b[key] : b[key] - a[key];
    };
  }

  function sort(field: string, rule: "asc" | "desc") {
    const copy = [...items];
    copy.sort(compareOnKey(field, rule));
    setSorted({ field, rule });
  }

  const search = useCallback(
    (query: string) => {
      setSearchQuery(query);
      const filteredData = marketData.filter((item) =>
        item.symbol.toLowerCase().includes(query.toLowerCase())
      );
      setItems(filteredData);
      updatePagination(filteredData.length, perPage, 1);
    },
    [marketData, setSearchQuery, perPage]
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    search(value);
  };

  return (
    <main id="datatable">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="font-sans text-2xl font-light text-muted-700 dark:text-muted-200">
            {t("Markets Overview")}
          </h2>
        </div>
        <div className="flex items-center justify-end gap-3">
          <div className="hidden w-full md:block md:w-auto">
            <Input
              icon="lucide:search"
              color="contrast"
              placeholder={t("Search...")}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col overflow-x-auto lg:overflow-x-visible ltablet:overflow-x-visible">
        <table className="border border-muted-200 bg-white font-sans dark:border-muted-800 dark:bg-muted-950">
          <thead className="border-b border-fade-grey-2 dark:border-muted-800">
            <tr className=" divide-x divide-muted-200 dark:divide-muted-800">
              <th className="w-[30%] p-4">
                <HeadCell
                  label={t("Name")}
                  sortFn={sort}
                  sortField="symbol"
                  sorted={sorted}
                />
              </th>
              <th className="w-[20%] p-4">
                <HeadCell
                  label={t("Price")}
                  sortFn={sort}
                  sortField="price"
                  sorted={sorted}
                />
              </th>
              <th className="w-[20%] p-4">
                <HeadCell
                  label={t("Change")}
                  sortFn={sort}
                  sortField="change"
                  sorted={sorted}
                />
              </th>
              <th className="w-[25%] p-4">
                <HeadCell
                  label={t("24h Volume")}
                  sortFn={sort}
                  sortField="baseVolume"
                  sorted={sorted}
                />
              </th>
              <th className="w-[5%] text-end"></th>
            </tr>
          </thead>

          <tbody>
            {items
              .slice(
                (pagination.currentPage - 1) * perPage,
                pagination.currentPage * perPage
              )
              .map((item, i) => (
                <tr
                  key={i}
                  className={`border-b border-muted-200 transition-colors duration-300 last:border-none 
              hover:bg-muted-200/40 dark:border-muted-800 dark:hover:bg-muted-900/60 cursor-pointer`}
                  onClick={() =>
                    router.push(`/trade/${item.symbol.replace("/", "_")}`)
                  }
                >
                  <td className="px-4 py-3 align-middle">
                    <div className="flex items-center gap-2">
                      <Avatar
                        size="xxs"
                        src={
                          item.icon ||
                          `/img/crypto/${item.currency.toLowerCase()}.webp`
                        }
                        className="dark:invert"
                      />
                      <span className="line-clamp-1 text-md text-muted-700 dark:text-muted-200">
                        {item.symbol}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <span className="line-clamp-1 text-md text-muted-700 dark:text-muted-200">
                      {item.price || (
                        <Skeleton
                          width={40}
                          height={10}
                          baseColor={isDark ? "#27272a" : "#f7fafc"}
                          highlightColor={isDark ? "#3a3a3e" : "#edf2f7"}
                        />
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <span
                      className={`line-clamp-1 text-md text-${
                        item.change >= 0
                          ? item.change === 0
                            ? "muted"
                            : "success"
                          : "danger"
                      }-500`}
                    >
                      {item.change ? (
                        `${item.change}%`
                      ) : (
                        <Skeleton
                          width={40}
                          height={10}
                          baseColor={isDark ? "#27272a" : "#f7fafc"}
                          highlightColor={isDark ? "#3a3a3e" : "#edf2f7"}
                        />
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 align-middle">
                    <div>
                      <span className="line-clamp-1 text-md text-muted-700 dark:text-muted-200">
                        {item.baseVolume || (
                          <Skeleton
                            width={40}
                            height={10}
                            baseColor={isDark ? "#27272a" : "#f7fafc"}
                            highlightColor={isDark ? "#3a3a3e" : "#edf2f7"}
                          />
                        )}{" "}
                        <span className=" text-muted-400 text-xs">
                          ({item.currency})
                        </span>
                      </span>
                      <span className="line-clamp-1 text-md text-muted-700 dark:text-muted-200">
                        {item.quoteVolume || (
                          <Skeleton
                            width={40}
                            height={10}
                            baseColor={isDark ? "#27272a" : "#f7fafc"}
                            highlightColor={isDark ? "#3a3a3e" : "#edf2f7"}
                          />
                        )}{" "}
                        <span className=" text-muted-400 text-xs">
                          ({item.pair})
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-middle text-end">
                    <Link href={`/trade/${item.symbol.replace("/", "_")}`}>
                      <IconButton color="contrast" variant="pastel" size="sm">
                        <Icon icon="akar-icons:arrow-right" width={16} />
                      </IconButton>
                    </Link>
                  </td>
                </tr>
              ))}
            {pagination.total === 0 && (
              <tr>
                <td colSpan={5} className="py-3 text-center">
                  <div className="py-32">
                    <Icon
                      icon="arcticons:samsung-finder"
                      className="mx-auto h-20 w-20 text-muted-400"
                    />
                    <h3 className="mb-2 font-sans text-xl text-muted-700 dark:text-muted-200">
                      {t("Nothing found")}
                    </h3>
                    <p className="mx-auto max-w-[280px] font-sans text-md text-muted-400">
                      {t(
                        "Sorry, looks like we couldn't find any matching records. Try different search terms."
                      )}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="hidden items-center gap-2 rounded-xl border border-muted-200 bg-white py-1 pe-3 ps-1 dark:border-muted-800 dark:bg-muted-950 md:flex">
            <Select
              color="contrast"
              value={perPage.toString()}
              onChange={(e) => changePerPage(+e.target.value)}
              options={["5", "10", "25", "50", "100"]}
            />
            <p className="whitespace-nowrap font-sans text-md text-muted-400">
              {t("Per page")}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end divide-x divide-muted-300 dark:divide-muted-800">
          <div className="flex items-center px-6">
            <button
              type="button"
              onClick={() => changePage(1)}
              className="cursor-pointer text-md text-muted-400 underline-offset-4 hover:text-primary-500 hover:underline"
            >
              <span>{t("First")}</span>
            </button>
            <span className="cursor-pointer px-2 text-md text-muted-400">
              ·
            </span>
            <button
              type="button"
              onClick={() => changePage(pagination.lastPage)}
              className="cursor-pointer text-md text-muted-400 underline-offset-4 hover:text-primary-500 hover:underline"
            >
              <span>{t("Last")}</span>
            </button>
          </div>
          <div className="flex items-center justify-end ps-6">
            <div className="flex items-center gap-1 rounded-full border border-muted-200 bg-white p-1 dark:border-muted-800 dark:bg-muted-950">
              <button
                type="button"
                onClick={() => changePage(currentPage - 1)}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-0 text-muted-500 transition-all duration-300 hover:bg-muted-100 hover:text-muted-600 dark:hover:bg-muted-800 dark:hover:text-muted-100"
              >
                <Icon width={16} height={16} icon="lucide:chevron-left" />
              </button>
              {pages.map((page, i) => (
                <button
                  type="button"
                  key={i}
                  className={`flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-none  p-0 transition-all duration-300 ${
                    currentPage == page
                      ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20"
                      : "bg-transparent text-muted-500 hover:bg-muted-100 hover:text-muted-600 dark:hover:bg-muted-800 dark:hover:text-muted-100"
                  }`}
                  onClick={() => changePage(page)}
                >
                  <span className="text-[.9rem]">{page}</span>
                </button>
              ))}
              <button
                onClick={() => changePage(currentPage + 1)}
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-0 text-muted-500 transition-all duration-300 hover:bg-muted-100 hover:text-muted-600 dark:hover:bg-muted-800 dark:hover:text-muted-100"
              >
                <Icon width={16} height={16} icon="lucide:chevron-right" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
const Markets = memo(MarketsBase);
export default Markets;
