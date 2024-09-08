import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import $fetch from "@/utils/api";

type Order = {
  id: string;
  userId: string;
  symbol: string;
  type: string;
  timeInForce: string;
  side: string;
  price: number;
  average: number;
  amount: number;
  filled: number;
  remaining: number;
  cost: number;
  leverage: number;
  fee: number;
  feeCurrency: string;
  status: string;
  stopLossPrice: number;
  takeProfitPrice: number;
  trades: any;
  createdAt: string;
  updatedAt: string;
};

type Position = {
  id: string;
  userId: string;
  symbol: string;
  side: string;
  entryPrice: bigint;
  amount: bigint;
  leverage: number;
  unrealizedPnl: bigint;
  stopLossPrice?: bigint;
  takeProfitPrice?: bigint;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type FuturesOrderStore = {
  currencyBalance: number;
  pairBalance: number;
  ask: number;
  bid: number;
  ordersTab: "OPEN" | "HISTORY" | "OPEN_POSITIONS" | "POSITIONS_HISTORY";
  orders: Order[];
  openOrders: Order[];
  positions: Position[];
  openPositions: Position[];
  loading: boolean;

  fetchWallet: (type: string, currency: string) => void;
  fetchOrders: (currency: string, pair: string) => void;
  fetchPositions: (currency: string, pair: string) => void;
  setAsk: (ask: number) => void;
  setBid: (bid: number) => void;
  placeOrder: (
    currency: string,
    pair: string,
    orderType: "MARKET" | "LIMIT" | "STOP_LIMIT",
    side: "BUY" | "SELL",
    amount: number,
    price?: number,
    leverage?: number,
    stopPrice?: number,
    takeProfitPrice?: number
  ) => void;
  setOrdersTab: (
    tab: "OPEN" | "HISTORY" | "OPEN_POSITIONS" | "POSITIONS_HISTORY"
  ) => void;
  setOrders: (orders: Order[]) => void;
  setOpenOrders: (openOrders: Order[]) => void;
  setPositions: (positions: Position[]) => void;
  setOpenPositions: (openPositions: Position[]) => void;
  handleOrderMessage: (message: any) => void;
  cancelOrder: (
    id: string,
    currency: string,
    pair: string,
    timestamp?: string
  ) => void;
  closePosition: (
    id: string,
    currency: string,
    pair: string,
    side: string
  ) => void;
};

export const useFuturesOrderStore = create<FuturesOrderStore>()(
  immer((set, get) => ({
    currencyBalance: 0,
    pairBalance: 0,
    ask: 0,
    bid: 0,
    ordersTab: "OPEN",
    orders: [],
    openOrders: [],
    positions: [],
    openPositions: [],
    loading: false,

    setOrdersTab: (
      tab: "OPEN" | "HISTORY" | "OPEN_POSITIONS" | "POSITIONS_HISTORY"
    ) => {
      set((state) => {
        state.ordersTab = tab;
      });
    },

    fetchWallet: async (type: string, currency: string) => {
      set((state) => {
        state.loading = true;
      });
      const { data, error } = await $fetch({
        url: `/api/finance/wallet/${type}/${currency}`,
        silent: true,
      });

      if (!error) {
        set((state) => {
          state.pairBalance = data.balance;
        });
      }

      set((state) => {
        state.loading = false;
      });
    },

    fetchOrders: async (currency: string, pair: string) => {
      set((state) => {
        state.loading = true;
      });

      const { ordersTab } = get();
      const { data, error } = await $fetch({
        url: `/api/ext/futures/order?currency=${currency}&pair=${pair}&type=${ordersTab}`,
        silent: true,
      });

      if (!error) {
        set((state) => {
          if (ordersTab === "OPEN") {
            state.openOrders = data;
          } else if (ordersTab === "HISTORY") {
            state.orders = data;
          }
        });
      }

      set((state) => {
        state.loading = false;
      });
    },

    fetchPositions: async (currency: string, pair: string) => {
      set((state) => {
        state.loading = true;
      });

      const { ordersTab } = get();

      const { data, error } = await $fetch({
        url: `/api/ext/futures/position?currency=${currency}&pair=${pair}&type=${ordersTab}`,
        silent: true,
      });

      if (!error) {
        set((state) => {
          if (ordersTab === "OPEN_POSITIONS") {
            state.openPositions = data;
          } else if (ordersTab === "POSITIONS_HISTORY") {
            state.positions = data;
          }
        });
      }

      set((state) => {
        state.loading = false;
      });
    },

    setAsk: (ask: number) => {
      set((state) => {
        state.ask = Number(ask);
      });
    },

    setBid: (bid: number) => {
      set((state) => {
        state.bid = Number(bid);
      });
    },

    placeOrder: async (
      currency: string,
      pair: string,
      orderType: "MARKET" | "LIMIT" | "STOP_LIMIT",
      side: "BUY" | "SELL",
      amount: number,
      price?: number,
      leverage?: number,
      stopLossPrice?: number,
      takeProfitPrice?: number
    ) => {
      set((state) => {
        state.loading = true;
      });

      const { fetchOrders, fetchWallet, ask, bid } = get();

      const orderPrice =
        orderType === "MARKET" ? (side === "BUY" ? ask : bid) : price;

      const { error } = await $fetch({
        url: "/api/ext/futures/order",
        method: "POST",
        body: {
          currency,
          pair,
          amount,
          type: orderType,
          side,
          price: orderPrice,
          leverage,
          stopLossPrice,
          takeProfitPrice,
        },
      });

      if (!error) {
        fetchWallet("FUTURES", pair);
        fetchOrders(currency, pair);
      }

      set((state) => {
        state.loading = false;
      });
    },

    setOrders: (orders: Order[]) => {
      set((state) => {
        state.orders = orders;
      });
    },

    setOpenOrders: (openOrders: Order[]) => {
      set((state) => {
        state.openOrders = openOrders;
      });
    },

    setPositions: (positions: Position[]) => {
      set((state) => {
        state.positions = positions;
      });
    },

    setOpenPositions: (openPositions: Position[]) => {
      set((state) => {
        state.openPositions = openPositions;
      });
    },

    handleOrderMessage: (message: any) => {
      if (!message || !message.data) return;

      const { data } = message;
      if (!data || !Array.isArray(data.data)) return;

      set((state) => {
        const newItems = [...state.openOrders];
        for (const item of data.data) {
          const index = newItems.findIndex((i) => i.id === item.id);
          if (index > -1) {
            newItems[index] = {
              ...newItems[index],
              ...item,
            };
          } else {
            newItems.push(item);
          }
        }
        state.openOrders = newItems;
      });
    },

    cancelOrder: async (
      id: string,
      currency: string,
      pair: string,
      timestamp?: string
    ) => {
      set((state) => {
        state.loading = true;
      });
      const { fetchWallet } = get();

      const { error } = await $fetch({
        url: `/api/ext/futures/order/${id}?timestamp=${timestamp}`,
        method: "DELETE",
      });

      if (!error) {
        set((state) => {
          state.openOrders = state.openOrders.filter(
            (order) => order.id !== id
          );
        });
        fetchWallet("FUTURES", pair);
      }

      set((state) => {
        state.loading = false;
      });
    },

    closePosition: async (
      id: string,
      currency: string,
      pair: string,
      side: string
    ) => {
      set((state) => {
        state.loading = true;
      });

      const { fetchWallet, fetchPositions } = get();

      const { error } = await $fetch({
        url: `/api/ext/futures/position`,
        method: "DELETE",
        body: {
          currency,
          pair,
          side,
        },
      });

      if (!error) {
        set((state) => {
          state.openPositions = state.openPositions.filter(
            (position) => position.id !== id
          );
        });
        fetchWallet("FUTURES", pair);
        fetchPositions(currency, pair);
      }

      set((state) => {
        state.loading = false;
      });
    },
  }))
);
