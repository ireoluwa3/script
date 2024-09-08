import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import $fetch from "@/utils/api";
import { toast } from "sonner";

type WalletType = {
  value: string;
  label: string;
};

type Currency = any;

type DepositStore = {
  step: number;
  loading: boolean;

  walletTypes: WalletType[];
  selectedWalletType: WalletType;

  currencies: Currency[];
  selectedCurrency: string;

  depositMethods: any;
  selectedDepositMethod: any | null;

  depositAmount: number;
  deposit: any;

  setStep: (step: number) => void;
  clearAll: () => void;
  setLoading: (loading: boolean) => void;

  setSelectedWalletType: (walletType: WalletType) => void;
  setSelectedCurrency: (currency: string) => void;

  setDepositMethods: (methods: any[]) => void;
  setSelectedDepositMethod: (method: any | null) => void;
  setDepositAmount: (amount: number) => void;

  handleDeposit: (id: string) => void;
  setDeposit: (deposit: any) => void;

  fetchCurrencies: () => void;
  fetchDepositMethods: () => void;
};

const endpoint = "/api/finance";

export const useDepositStore = create<DepositStore>()(
  immer((set, get) => ({
    step: 1,
    walletTypes: [
      { value: "FIAT", label: "Fiat" },
      { value: "SPOT", label: "Spot" },
    ],
    selectedWalletType: { value: "", label: "Select a wallet type" },
    currencies: [],
    selectedCurrency: "Select a currency",
    depositMethods: [],
    selectedDepositMethod: null,
    depositAmount: 0,
    loading: false,
    deposit: null,

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
    setDepositMethods: (methods) =>
      set((state) => {
        state.depositMethods = methods;
      }),
    setSelectedDepositMethod: (method) =>
      set((state) => {
        state.selectedDepositMethod = method;
      }),
    setDepositAmount: (amount) =>
      set((state) => {
        state.depositAmount = amount;
      }),

    setDeposit: (deposit) =>
      set((state) => {
        state.deposit = deposit;
      }),

    setLoading: (loading) =>
      set((state) => {
        state.loading = loading;
      }),

    handleDeposit: async (id) => {
      const {
        selectedWalletType,
        depositAmount,
        selectedCurrency,
        selectedDepositMethod,
        setLoading,
      } = get();
      setLoading(true);

      const url = `/api/ext/forex/account/${id}/deposit`;

      const { data, error } = await $fetch({
        url,
        silent: true,
        method: "POST",
        body: {
          type: selectedWalletType.value,
          currency: selectedCurrency,
          chain:
            selectedWalletType.value !== "FIAT"
              ? selectedDepositMethod?.chain
              : undefined,
          amount: depositAmount,
        },
      });

      if (!error) {
        set((state) => {
          state.deposit = data;
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

    fetchDepositMethods: async () => {
      const { selectedWalletType, selectedCurrency } = get();
      try {
        const { data, error } = await $fetch({
          url: `${endpoint}/currency/${selectedWalletType.value}/${selectedCurrency}?action=withdraw`,
          silent: true,
        });

        if (!error) {
          set((state) => {
            state.depositMethods = data;
            state.step = 3;
          });
        } else {
          toast.error(
            "An error occurred while fetching currency deposit methods"
          );
          set((state) => {
            state.step = 2;
          });
        }
      } catch (error) {
        console.error("Error in fetching deposit methods:", error);
        toast.error("An error occurred while fetching deposit methods");
      }
    },

    clearAll: () =>
      set(() => ({
        step: 1,
        selectedWalletType: { value: "", label: "Select a wallet type" },
        currencies: [],
        selectedCurrency: "Select a currency",
        depositMethods: [],
        selectedDepositMethod: null,
        depositAmount: 0,
        loading: false,
        deposit: null,
        stripeListener: false,
        transactionHash: "",
      })),
  }))
);
