import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import $fetch from "@/utils/api";

type Order = {
  id: string;
  userId: string;
  referenceId: string;
  status: "OPEN" | "CLOSED" | "CANCELED" | "EXPIRED" | "REJECTED";
  currency: string;
  pair: string;
  type: "MARKET" | "LIMIT";
  timeInForce: string;
  side: "BUY" | "SELL";
  price: number;
  average: number;
  amount: number;
  filled: number;
  remaining: number;
  cost: number;
  trades: any;
  fee: number;
  feeCurrency: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};

type OrderStore = {
  currencyBalance: number;
  pairBalance: number;
  ask: number;
  bid: number;
  ordersTab: "OPEN" | "HISTORY" | "AI";
  orders: Order[];
  openOrders: Order[];
  loading: boolean;
  aiInvestments: any[];
  aiPlans: any[];

  setAiPlans: (plans: any[]) => void;
  setAiInvestments: (investments: any[]) => void;
  fetchAiInvestments: () => void;
  fetchWallets: (isEco: boolean, currency: string, pair: string) => void;
  fetchWallet: (type: string, currency: string) => void;
  fetchOrders: (type: boolean, currency: string, pair: string) => void;
  setAsk: (ask: number) => void;
  setBid: (bid: number) => void;
  placeOrder: (
    isEco: boolean,
    currency: string,
    pair: string,
    orderType: "MARKET" | "LIMIT" | "STOP_LIMIT",
    side: "BUY" | "SELL",
    amount: number,
    price?: number
  ) => void;
  setOrdersTab: (tab: "OPEN" | "HISTORY" | "AI") => void;
  setOrders: (orders: Order[]) => void;
  setOpenOrders: (openOrders: Order[]) => void;
  handleOrderMessage: (message: any) => void;
  cancelOrder: (
    id: string,
    isEco: boolean,
    currency: string,
    pair: string,
    timestamp?: string
  ) => void;
  placeAiInvestmentOrder: (
    planId: string,
    durationId: string,
    market: any,
    amount: number
  ) => void;
  cancelAiInvestmentOrder: (
    id: string,
    isEco: boolean,
    currency: string,
    pair: string
  ) => void;
};

export const useOrderStore = create<OrderStore>()(
  immer((set, get) => ({
    currencyBalance: 0,
    pairBalance: 0,
    ask: 0,
    bid: 0,
    ordersTab: "OPEN",
    orders: [],
    openOrders: [],
    loading: false,

    setOrdersTab: (tab: "OPEN" | "HISTORY" | "AI") => {
      set((state) => {
        state.ordersTab = tab;
      });
    },

    fetchWallets: async (isEco: boolean, currency: string, pair: string) => {
      set((state) => {
        state.loading = true;
      });
      const { data, error } = await $fetch({
        url: "/api/finance/wallet/symbol",
        silent: true,
        params: { type: isEco ? "ECO" : "SPOT", currency, pair },
      });

      if (!error) {
        set((state) => {
          state.currencyBalance = data.CURRENCY;
          state.pairBalance = data.PAIR;
        });
      }

      set((state) => {
        state.loading = false;
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
          if (type === "currency") {
            state.currencyBalance = data;
          } else if (type === "pair") {
            state.pairBalance = data;
          }
        });
      }

      set((state) => {
        state.loading = false;
      });
    },

    fetchOrders: async (isEco: boolean, currency: string, pair: string) => {
      set((state) => {
        state.loading = true;
      });

      const { ordersTab } = get();

      const url = isEco ? `/api/ext/ecosystem/order` : `/api/exchange/order`;
      const { data, error } = await $fetch({
        url: `${url}?currency=${currency}&pair=${pair}&type=${ordersTab}`,
        silent: true,
      });

      if (!error) {
        set((state) => {
          state[ordersTab === "OPEN" ? "openOrders" : "orders"] = data;
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
      isEco: boolean,
      currency: string,
      pair: string,
      orderType: "MARKET" | "LIMIT" | "STOP_LIMIT",
      side: "BUY" | "SELL",
      amount: number,
      price?: number
    ) => {
      set((state) => {
        state.loading = true;
      });

      const { fetchOrders, fetchWallets } = get();
      const url = isEco ? "/api/ext/ecosystem/order" : "/api/exchange/order";
      const { error } = await $fetch({
        url,
        method: "POST",
        body: {
          currency,
          pair,
          amount,
          type: orderType,
          side,
          price:
            orderType === "MARKET"
              ? side === "BUY"
                ? get().ask
                : get().bid
              : Number(price),
        },
      });

      if (!error) {
        fetchWallets(isEco, currency, pair);
        fetchOrders(isEco, currency, pair);
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
      isEco: boolean,
      currency: string,
      pair: string,
      timestamp?: string
    ) => {
      set((state) => {
        state.loading = true;
      });
      const { fetchWallets } = get();

      const url = isEco
        ? `/api/ext/ecosystem/order/${id}?timestamp=${timestamp}`
        : `/api/exchange/order/${id}`;
      const { error } = await $fetch({
        url,
        method: "DELETE",
      });

      if (!error) {
        set((state) => {
          state.openOrders = state.openOrders.filter(
            (order) => order.id !== id
          );
        });
        fetchWallets(isEco, currency, pair);
      }

      set((state) => {
        state.loading = false;
      });
    },

    aiInvestments: [],
    aiPlans: [],

    setAiPlans: (plans: any[]) => {
      set((state) => {
        state.aiPlans = plans;
      });
    },

    setAiInvestments: (investments: any[]) => {
      set((state) => {
        state.aiInvestments = investments;
      });
    },

    fetchAiInvestments: async () => {
      const { data, error } = await $fetch({
        url: "/api/ext/ai/investment/log",
        silent: true,
      });

      if (!error) {
        set((state) => {
          state.aiInvestments = data;
        });
      }
    },

    placeAiInvestmentOrder: async (
      planId: string,
      durationId: string,
      market: any,
      amount: number
    ) => {
      set((state) => {
        state.loading = true;
      });

      const { fetchWallets, fetchAiInvestments } = get();
      const { error } = await $fetch({
        url: "/api/ext/ai/investment/log",
        method: "POST",
        body: {
          planId,
          durationId,
          amount,
          currency: market.currency,
          pair: market.pair,
          type: market.isEco ? "ECO" : "SPOT",
        },
      });

      if (!error) {
        await fetchWallets(market.isEco, market.currency, market.pair);
        await fetchAiInvestments();
      }

      set((state) => {
        state.loading = false;
      });
    },

    cancelAiInvestmentOrder: async (
      id: string,
      isEco: boolean,
      currency: string,
      pair: string
    ) => {
      set((state) => {
        state.loading = true;
      });

      const { fetchWallets } = get();
      const { error } = await $fetch({
        url: `/api/ext/ai/investment/log/${id}`,
        method: "DELETE",
      });

      if (!error) {
        await fetchWallets(isEco, currency, pair);
        set((state) => {
          state.aiInvestments = state.aiInvestments.filter(
            (investment) => investment.id !== id
          );
        });
      }

      set((state) => {
        state.loading = false;
      });
    },
  }))
);
