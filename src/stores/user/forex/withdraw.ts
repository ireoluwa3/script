import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import $fetch from "@/utils/api";
import { toast } from "sonner";

type WalletType = {
  value: string;
  label: string;
};

type Currency = any;

type WithdrawStore = {
  step: number;
  loading: boolean;
  account: any | null;

  walletTypes: WalletType[];
  selectedWalletType: WalletType;

  currencies: Currency[];
  selectedCurrency: string;

  withdrawMethods: any;
  selectedWithdrawMethod: any | null;

  withdrawAmount: number;
  withdraw: any;

  setStep: (step: number) => void;
  clearAll: () => void;
  setLoading: (loading: boolean) => void;

  setSelectedWalletType: (walletType: WalletType) => void;
  setSelectedCurrency: (currency: string) => void;

  setWithdrawMethods: (methods: any[]) => void;
  setSelectedWithdrawMethod: (method: any | null) => void;
  setWithdrawAmount: (amount: number) => void;

  handleWithdraw: (id: string) => void;
  setWithdraw: (withdraw: any) => void;

  fetchCurrencies: () => void;
  fetchWithdrawMethods: () => void;

  fetchAccount: (id: string) => void;
};

const endpoint = "/api/finance";

export const useWithdrawStore = create<WithdrawStore>()(
  immer((set, get) => ({
    step: 1,
    account: null,
    walletTypes: [
      { value: "FIAT", label: "Fiat" },
      { value: "SPOT", label: "Spot" },
    ],
    selectedWalletType: { value: "", label: "Select a wallet type" },
    currencies: [],
    selectedCurrency: "Select a currency",
    withdrawMethods: [],
    selectedWithdrawMethod: null,
    withdrawAmount: 0,
    loading: false,
    withdraw: null,

    setStep: (step) =>
      set((state) => {
        state.step = step;
      }),

    setSelectedWalletType: (walletType) =>
      set((state) => {
        state.selectedWalletType = walletType;
      }),
    setSelectedCurrency: (currency) =>
      set((state) => {
        state.selectedCurrency = currency;
      }),
    setWithdrawMethods: (methods) =>
      set((state) => {
        state.withdrawMethods = methods;
      }),
    setSelectedWithdrawMethod: (method) =>
      set((state) => {
        state.selectedWithdrawMethod = method;
      }),
    setWithdrawAmount: (amount) =>
      set((state) => {
        state.withdrawAmount = amount;
      }),

    setWithdraw: (withdraw) =>
      set((state) => {
        state.withdraw = withdraw;
      }),

    setLoading: (loading) =>
      set((state) => {
        state.loading = loading;
      }),

    handleWithdraw: async (id) => {
      const {
        selectedWalletType,
        withdrawAmount,
        selectedCurrency,
        selectedWithdrawMethod,
        setLoading,
      } = get();
      setLoading(true);

      const url = `/api/ext/forex/account/${id}/withdraw`;

      const { data, error } = await $fetch({
        url,
        silent: true,
        method: "POST",
        body: {
          type: selectedWalletType.value,
          currency: selectedCurrency,
          chain:
            selectedWalletType.value !== "FIAT"
              ? selectedWithdrawMethod?.chain
              : undefined,
          amount: withdrawAmount,
        },
      });

      if (!error) {
        set((state) => {
          state.withdraw = data;
          state.step = 5;
        });
      } else {
        toast.error(error || "An unexpected error occurred");
      }
      setLoading(false);
    },

    fetchCurrencies: async () => {
      const { selectedWalletType } = get();
      try {
        const { data, error } = await $fetch({
          url: `${endpoint}/currency?action=withdraw&walletType=${selectedWalletType.value}`,
          silent: true,
        });

        if (error) {
          toast.error("An error occurred while fetching currencies");
          set((state) => {
            state.step = 1;
          });
        } else {
          set((state) => {
            state.currencies = data;
            state.step = 2;
          });
        }
      } catch (error) {
        console.error("Error in fetching currencies:", error);
        toast.error("An error occurred while fetching currencies");
      }
    },

    fetchWithdrawMethods: async () => {
      const { selectedWalletType, selectedCurrency } = get();
      try {
        const { data, error } = await $fetch({
          url: `${endpoint}/currency/${selectedWalletType.value}/${selectedCurrency}?action=withdraw`,
          silent: true,
        });

        if (!error) {
          set((state) => {
            state.withdrawMethods = data;
            state.step = 3;
          });
        } else {
          toast.error(
            "An error occurred while fetching currency withdraw methods"
          );
          set((state) => {
            state.step = 2;
          });
        }
      } catch (error) {
        console.error("Error in fetching withdraw methods:", error);
        toast.error("An error occurred while fetching withdraw methods");
      }
    },

    fetchAccount: async (id) => {
      const { data, error } = await $fetch({
        url: `/api/ext/forex/account/${id}`,
        silent: true,
      });

      if (!error) {
        set((state) => {
          state.account = data;
        });
      }
    },

    clearAll: () =>
      set(() => ({
        step: 1,
        selectedWalletType: { value: "", label: "Select a wallet type" },
        currencies: [],
        selectedCurrency: "Select a currency",
        withdrawMethods: [],
        selectedWithdrawMethod: null,
        withdrawAmount: 0,
        loading: false,
        withdraw: null,
        stripeListener: false,
        transactionHash: "",
      })),
  }))
);
