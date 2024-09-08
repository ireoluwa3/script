import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import $fetch from "@/utils/api";

type Order = {
  id: string;
  userId: string;
  symbol: string;
  price: number;
  amount: number;
  profit: number;
  side: "RISE" | "FALL";
  type: "RISE_FALL";
  status: "WIN" | "LOSS" | "DRAW" | "PENDING";
  isDemo: boolean;
  closedAt: string;
  closePrice: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

type OrderStore = {
  wallet: any;
  ask: number;
  bid: number;
  ordersTab: "OPEN" | "HISTORY";
  orders: Order[];
  openOrders: Order[];
  loading: boolean;
  orderInProcess: boolean;
  practiceBalances: Record<string, number>;

  fetchWallet: (currency: string) => void;
  fetchOrders: (currency: string, pair: string, isDemo?: boolean) => void;
  setAsk: (ask: number) => void;
  setBid: (bid: number) => void;
  removeOrder: (orderId: string) => void;
  setOrderInProcess: (status: boolean) => void;

  placeOrder: (
    currency: string,
    pair: string,
    side: "RISE" | "FALL",
    amount: number,
    closedAt: string,
    isDemo?: boolean,
    type?: "RISE_FALL"
  ) => void;
  setOrdersTab: (tab: "OPEN" | "HISTORY") => void;
  setOrders: (orders: Order[]) => void;
  setOpenOrders: (openOrders: Order[]) => void;

  cancelOrder: (
    id: string,
    pair: string,
    isDemo?: boolean,
    amount?: number
  ) => void;

  setPracticeBalance: (currency: string, pair: string, balance: number) => void;
  updatePracticeBalance: (
    currency: string,
    pair: string,
    amount: number,
    type?: "add" | "subtract"
  ) => void;
  getPracticeBalance: (currency: string, pair: string) => number;
};

export const useBinaryOrderStore = create<OrderStore>()(
  immer((set, get) => ({
    wallet: null,
    ask: 0,
    bid: 0,
    ordersTab: "OPEN",
    orders: [],
    openOrders: [],
    loading: false,
    orderInProcess: false,
    practiceBalances: {},

    setOrderInProcess: (status: boolean) => {
      set((state) => {
        state.orderInProcess = status;
      });
    },

    setOrdersTab: (tab: "OPEN" | "HISTORY") => {
      set((state) => {
        state.ordersTab = tab;
      });
    },

    fetchWallet: async (currency: string) => {
      set((state) => {
        state.loading = true;
      });
      const { data, error } = await $fetch({
        url: `/api/finance/wallet/SPOT/${currency}`,
        silent: true,
      });

      if (!error) {
        set((state) => {
          state.wallet = data;
        });
      }

      set((state) => {
        state.loading = false;
      });
    },

    fetchOrders: async (
      currency: string,
      pair: string,
      isDemo: boolean = false
    ) => {
      set((state) => {
        state.loading = true;
      });

      const { ordersTab } = get();

      const url = `/api/exchange/binary/order`;
      const { data, error } = await $fetch({
        url: `${url}?currency=${currency}&pair=${pair}&type=${ordersTab}&isDemo=${isDemo}`,
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
      currency: string,
      pair: string,
      side: "RISE" | "FALL",
      amount: number,
      closedAt: string,
      isDemo: boolean = false,
      type: "RISE_FALL" = "RISE_FALL"
    ) => {
      set((state) => {
        state.loading = true;
        state.orderInProcess = true;
      });

      const { fetchWallet, setPracticeBalance, getPracticeBalance } = get();
      const url = "/api/exchange/binary/order";
      const { data, error } = await $fetch({
        url,
        method: "POST",
        body: {
          currency,
          pair,
          amount,
          side,
          closedAt,
          isDemo,
          type,
        },
      });

      if (!error) {
        if (isDemo) {
          const newBalance = getPracticeBalance(currency, pair) - amount;
          setPracticeBalance(currency, pair, newBalance); // Deduct the amount from practice balance
        } else {
          fetchWallet(pair);
        }

        // Push the new order to openOrders
        set((state) => {
          state.openOrders.push(data.order);
        });
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

    cancelOrder: async (
      id: string,
      pair: string,
      isDemo: boolean,
      amount: number
    ) => {
      set((state) => {
        state.loading = true;
      });
      const { fetchWallet, setPracticeBalance } = get();

      const url = `/api/exchange/binary/order/${id}`;
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

        if (isDemo) {
          setPracticeBalance(
            pair.split("/")[0],
            pair.split("/")[1],
            get().getPracticeBalance(pair.split("/")[0], pair.split("/")[1]) +
              amount
          ); // Return the amount to practice balance
        } else {
          fetchWallet(pair);
        }
      }

      set((state) => {
        state.loading = false;
        state.orderInProcess = false;
      });
    },

    removeOrder: (orderId: string) => {
      set((state) => {
        state.openOrders = state.openOrders.filter(
          (order) => order.id !== orderId
        );
        state.orderInProcess = false;
      });
    },

    setPracticeBalance: (currency: string, pair: string, balance: number) => {
      set((state) => {
        state.practiceBalances[`${currency}/${pair}`] = balance;
        localStorage.setItem(
          "practiceBalances",
          JSON.stringify(state.practiceBalances)
        );
      });
    },

    updatePracticeBalance: (
      currency: string,
      pair: string,
      amount: number,
      type = "subtract"
    ) => {
      set((state) => {
        const key = `${currency}/${pair}`;
        const newBalance =
          type === "add"
            ? (state.practiceBalances[key] || 10000) + amount
            : (state.practiceBalances[key] || 10000) - amount;
        state.practiceBalances[key] = newBalance;
        localStorage.setItem(
          "practiceBalances",
          JSON.stringify(state.practiceBalances)
        );
      });
    },

    getPracticeBalance: (currency: string, pair: string) => {
      const key = `${currency}/${pair}`;
      const savedBalances = localStorage.getItem("practiceBalances");
      if (savedBalances) {
        const balances = JSON.parse(savedBalances);
        return balances[key] !== undefined ? balances[key] : 10000;
      }
      return 10000;
    },
  }))
);
