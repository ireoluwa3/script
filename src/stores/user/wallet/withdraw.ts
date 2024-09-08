import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import $fetch from "@/utils/api";
import { toast } from "sonner";
import { useDashboardStore } from "@/stores/dashboard";

type WalletType = {
  value: string;
  label: string;
};

type Currency = any;

type WithdrawStore = {
  step: number;
  walletTypes: WalletType[];
  selectedWalletType: WalletType;
  currencies: Currency[];
  selectedCurrency: string;
  withdrawMethods: any;
  withdrawAddress: string;
  selectedWithdrawMethod: any | null;
  withdrawAmount: number;
  loading: boolean;
  withdraw: any;

  setStep: (step: number) => void;
  setWithdrawAddress: (address: string) => void;
  setSelectedWalletType: (walletType: WalletType) => void;
  setSelectedCurrency: (currency: string) => void;
  setWithdrawMethods: (methods: any[]) => void;
  setSelectedWithdrawMethod: (method: any | null) => void;
  setWithdrawAmount: (amount: number) => void;
  handleFiatWithdraw: (values) => void;
  handleWithdraw: () => void;
  fetchCurrencies: () => void;
  fetchWithdrawMethods: () => void;
  setWithdraw: (withdraw: any) => void;
  clearAll: () => void;
  setLoading: (loading: boolean) => void;
  initializeWalletTypes: () => void;
};

const endpoint = "/api/finance";

export const useWithdrawStore = create<WithdrawStore>()(
  immer((set, get) => ({
    step: 1,
    walletTypes: [],
    selectedWalletType: { value: "", label: "Select a wallet type" },
    currencies: [],
    selectedCurrency: "Select a currency",
    withdrawMethods: [],
    selectedWithdrawMethod: null,
    withdrawAddress: "",
    withdrawAmount: 0,
    loading: false,
    withdraw: null,

    initializeWalletTypes: () => {
      const { getSetting, hasExtension } = useDashboardStore.getState();
      const fiatWalletsEnabled = getSetting("fiatWallets") === "true";
      const ecosystemEnabled = hasExtension("ecosystem");

      const walletTypes = [{ value: "SPOT", label: "Spot" }];

      if (ecosystemEnabled) {
        walletTypes.push({ value: "ECO", label: "Funding" });
      }

      if (fiatWalletsEnabled) {
        walletTypes.unshift({ value: "FIAT", label: "Fiat" });
      }

      set((state) => {
        state.walletTypes = walletTypes;
      });
    },

    setStep: (step) =>
      set((state) => {
        state.step = step;
      }),

    setWithdrawAddress: (address) =>
      set((state) => {
        state.withdrawAddress = address;
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

    handleFiatWithdraw: async (values) => {
      const { selectedWithdrawMethod, withdrawAmount, selectedCurrency } =
        get();

      try {
        const { data, error } = await $fetch({
          url: `${endpoint}/withdraw/fiat`,
          method: "POST",
          silent: true,
          body: {
            amount: withdrawAmount,
            currency: selectedCurrency,
            methodId: selectedWithdrawMethod?.id,
            customFields: values,
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
      } catch (error) {
        console.error("Error in fiat withdraw:", error);
        toast.error("An error occurred while processing withdraw");
      }
    },

    handleWithdraw: async () => {
      const {
        selectedWalletType,
        withdrawAmount,
        selectedCurrency,
        selectedWithdrawMethod,
        withdrawAddress,
        setLoading,
      } = get();
      setLoading(true);

      const url =
        selectedWalletType.value === "ECO"
          ? `/api/ext/ecosystem/withdraw`
          : `${endpoint}/withdraw/${selectedWalletType.value}`;

      const { data, error } = await $fetch({
        url,
        silent: true,
        method: "POST",
        body: {
          currency: selectedCurrency,
          chain: selectedWithdrawMethod?.chain,
          amount: withdrawAmount,
          toAddress: withdrawAddress,
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
          toast.error(error);
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
        toast.error(error);
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

    clearAll: () =>
      set(() => ({
        step: 1,
        selectedWalletType: { value: "", label: "Select a wallet type" },
        currencies: [],
        selectedCurrency: "Select a currency",
        withdrawMethods: [],
        selectedWithdrawMethod: null,
        withdrawAddress: "",
        withdrawAmount: 0,
        loading: false,
        withdraw: null,
        stripeListener: false,
        transactionHash: "",
      })),
  }))
);
