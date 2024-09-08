import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import $fetch from "@/utils/api";

interface FuturesMarketState {
  market: any;
  searchQuery: string;
  marketData: any[];
  watchlistData: any[];
  selectedPair: string;
  marketReady: boolean;
  watchlistReady: boolean;
  pairs: string[];
  priceChangeData: Record<string, { price: number; change: number }>;

  setSearchQuery: (query: string) => void;
  setMarketData: (data: any[]) => void;
  setMarket: (symbol: string) => void;
  setWatchlistData: (data: any[]) => void;
  setSelectedPair: (pair: string) => void;
  fetchData: (params?: { currency?: string; pair?: string }) => Promise<void>;
  fetchWatchlist: (markets: any[]) => Promise<void>;
  toggleWatchlist: (symbol: string) => Promise<void>;
  setPriceChangeData: (symbol: string, price: number, change: number) => void;
  getPrecisionBySymbol: (symbol: string) => { price: number; amount: number };
  getFirstAvailablePair: () => string;
}

const useFuturesMarketStore = create<FuturesMarketState>()(
  immer((set, get) => ({
    market: null,
    searchQuery: "",
    marketData: [],
    watchlistData: [],
    selectedPair: "",
    marketReady: false,
    watchlistReady: false,
    pairs: [],
    priceChangeData: {},

    setPriceChangeData: (symbol, price, change) =>
      set((state) => {
        state.priceChangeData[symbol] = { price, change };
      }),

    getPrecisionBySymbol: (symbol) => {
      const { marketData } = get();
      const market = marketData.find((m) => m.symbol === symbol);
      return market ? market.precision : { price: 8, amount: 8 };
    },

    setSearchQuery: (query) =>
      set((state) => {
        state.searchQuery = query;
      }),

    setMarketData: (data) =>
      set((state) => {
        const updatedMarketData = state.marketData.map((item) => {
          const update = data.find((d) => d.symbol === item.symbol);
          return update ? { ...item, ...update } : item;
        });

        const newMarketData = data.filter(
          (item) => !state.marketData.some((m) => m.symbol === item.symbol)
        );

        state.marketData = [...updatedMarketData, ...newMarketData];
        state.pairs = [
          ...new Set([...state.pairs, ...data.map((item) => item.pair)]),
        ];
      }),

    setWatchlistData: (data) =>
      set((state) => {
        state.watchlistData = data;
      }),

    setSelectedPair: (pair) =>
      set((state) => {
        state.selectedPair = pair;
      }),

    fetchData: async (params) => {
      const { fetchWatchlist } = get();
      const { currency, pair } = params || {};
      const { data, error } = await $fetch({
        url: `/api/ext/futures/market`,
        silent: true,
      });
      if (!error) {
        const markets = data.map((item) => ({
          id: item.id,
          symbol: `${item.currency}/${item.pair}`,
          currency: item.currency,
          pair: item.pair,
          precision: item.metadata?.precision,
          limits: item.metadata?.limits,
          leverage: item.metadata?.leverage,
        }));

        set((state) => {
          const updatedMarketData = state.marketData.map((item) => {
            const update = markets.find((m) => m.symbol === item.symbol);
            return update ? { ...item, ...update } : item;
          });

          const newMarketData = markets.filter(
            (item) => !state.marketData.some((m) => m.symbol === item.symbol)
          );

          state.marketData = [...updatedMarketData, ...newMarketData];
          state.pairs = [
            ...new Set([...state.pairs, ...markets.map((item) => item.pair)]),
          ];

          if (currency && pair) {
            const market = markets.find(
              (item) => item.symbol === `${currency}/${pair}`
            );

            state.selectedPair = pair;
            if (market) {
              state.market = market;
            }
          }
        });

        await fetchWatchlist(markets);
        set({ watchlistReady: true });
      }
    },

    getFirstAvailablePair: () => {
      const { marketData } = get();
      const availablePairs = marketData.filter((pair) => !pair.isEco);

      return availablePairs[0]?.symbol?.replace("/", "_");
    },

    setMarket: (symbol) => {
      const { marketData } = get();
      const market = marketData.find((m) => m.symbol === symbol);
      set((state) => {
        state.market = market;
      });
    },

    fetchWatchlist: async (markets) => {
      const { data, error } = await $fetch({
        url: "/api/exchange/watchlist",
        silent: true,
      });
      if (!error) {
        const watchlist = data
          .map((item) => markets.find((m) => m.symbol === item.symbol))
          .filter((item) => item);
        set((state) => {
          state.watchlistData = watchlist;
        });
      }
    },

    toggleWatchlist: async (symbol) => {
      const { fetchWatchlist, marketData } = get();
      const { error } = await $fetch({
        url: "/api/exchange/watchlist",
        method: "POST",
        body: { type: "FUTURES", symbol },
      });
      if (!error) {
        await fetchWatchlist(marketData);
      }
    },
  }))
);

export default useFuturesMarketStore;
