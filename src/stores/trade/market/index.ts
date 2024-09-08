import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import $fetch from "@/utils/api";

interface MarketState {
  market: any;
  searchQuery: string;
  marketData: any[];
  watchlistData: any[];
  selectedPair: string;
  marketReady: boolean;
  watchlistReady: boolean;
  pairs: string[];
  priceChangeData: Record<string, { price: number; change: number }>;
  withEco: boolean;

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
  setWithEco: (status: boolean) => void;
  getFirstAvailablePair: () => string;
}

const useMarketStore = create<MarketState>()(
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
    withEco: true,

    setWithEco: (status) =>
      set((state) => {
        state.withEco = status;
      }),

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
      const { fetchWatchlist, withEco } = get();
      const { currency, pair } = params || {};
      const { data, error } = await $fetch({
        url: `/api/exchange/market?eco=${withEco}`,
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
          isEco: item.isEco,
          icon: item.icon,
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
      // Modify this to include your logic for selecting an available pair
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
      const { withEco } = get();
      const { data, error } = await $fetch({
        url: "/api/exchange/watchlist",
        silent: true,
      });
      if (!error) {
        const watchlist = data
          .map((item) => markets.find((m) => m.symbol === item.symbol))
          .filter((item) => item && (withEco ? true : !item.isEco));
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
        body: { type: "TRADE", symbol },
      });
      if (!error) {
        await fetchWatchlist(marketData);
      }
    },
  }))
);

export default useMarketStore;
