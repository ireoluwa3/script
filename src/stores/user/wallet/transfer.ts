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

type TransferStore = {
  step: number;
  loading: boolean;

  walletTypes: WalletType[];
  selectedWalletType: WalletType;
  selectedTargetWalletType: WalletType;

  currencies: Record<string, Currency[]>;
  selectedCurrency: string;
  targetCurrency: string;

  transferAmount: number;
  transfer: any;

  transferType: {
    value: string;
    label: string;
  };
  clientId: string | null;

  setStep: (step: number) => void;
  setLoading: (loading: boolean) => void;
  clearAll: () => void;

  setSelectedWalletType: (walletType: WalletType) => void;
  setSelectedTargetWalletType: (walletType: WalletType) => void;

  fetchCurrencies: () => void;
  setSelectedCurrency: (currency: string) => void;
  setTargetCurrency: (currency: string) => void;

  setTransferAmount: (amount: number) => void;
  handleTransfer: () => void;
  setTransfer: (transfer: any) => void;

  setTransferType: (type: { value: string; label: string }) => void;
  setClientId: (id: string | null) => void;
  initializeWalletTypes: () => void;
};

const endpoint = "/api/finance";

export const useTransferStore = create<TransferStore>()(
  immer((set, get) => ({
    step: 1,
    loading: false,
    walletTypes: [],
    selectedWalletType: { value: "", label: "Select a wallet type" },
    selectedTargetWalletType: { value: "", label: "Select a wallet type" },
    currencies: {
      from: [],
      to: [],
    },
    selectedCurrency: "Select a currency",
    targetCurrency: "Select a currency",

    transferAmount: 0,
    transfer: null,

    transferType: {
      value: "",
      label: "",
    },
    clientId: null,

    initializeWalletTypes: () => {
      const { getSetting, hasExtension } = useDashboardStore.getState();
      const fiatWalletsEnabled = getSetting("fiatWallets") === "true";
      const ecosystemEnabled = hasExtension("ecosystem");
      const futuresEnabled = hasExtension("futures");

      const walletTypes = [{ value: "SPOT", label: "Spot" }];

      if (ecosystemEnabled) {
        walletTypes.push({ value: "ECO", label: "Funding" });
      }

      if (fiatWalletsEnabled) {
        walletTypes.unshift({ value: "FIAT", label: "Fiat" });
      }

      if (futuresEnabled) {
        walletTypes.push({ value: "FUTURES", label: "Futures" });
      }

      set((state) => {
        state.walletTypes = walletTypes;
      });
    },

    setStep: (step) =>
      set((state) => {
        state.step = step;
      }),

    setLoading: (loading) =>
      set((state) => {
        state.loading = loading;
      }),

    clearAll: () =>
      set(() => ({
        step: 1,
        selectedWalletType: { value: "", label: "Select a wallet type" },
        selectedTargetWalletType: {
          value: "",
          label: "Select a wallet type",
        },
        currencies: {
          from: [],
          to: [],
        },
        selectedCurrency: "Select a currency",
        targetCurrency: "Select a currency",
        transferAmount: 0,
        loading: false,
        transfer: null,
        transferType: {
          value: "",
          label: "",
        },
        clientId: null,
      })),

    setSelectedWalletType: (walletType) =>
      set((state) => {
        state.selectedWalletType = walletType;
      }),

    setSelectedTargetWalletType: (walletType) =>
      set((state) => {
        state.selectedTargetWalletType = walletType;
      }),

    fetchCurrencies: async () => {
      const { selectedWalletType, selectedTargetWalletType, transferType } =
        get();
      try {
        const targetWalletType =
          transferType.value === "client"
            ? selectedWalletType
            : selectedTargetWalletType;
        const { data, error } = await $fetch({
          url: `${endpoint}/currency?action=transfer&walletType=${selectedWalletType.value}&targetWalletType=${targetWalletType.value}`,
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
            state.step = 4;
          });
        }
      } catch (error) {
        console.error("Error in fetching currencies:", error);
        toast.error(error);
      }
    },

    setSelectedCurrency: (currency) =>
      set((state) => {
        state.selectedCurrency = currency;
      }),

    setTargetCurrency: (currency) =>
      set((state) => {
        state.targetCurrency = currency;
      }),

    setTransferAmount: (amount) =>
      set((state) => {
        state.transferAmount = amount;
      }),

    setTransfer: (transfer) =>
      set((state) => {
        state.transfer = transfer;
      }),

    setTransferType: (type) =>
      set((state) => {
        state.transferType = type;
      }),

    setClientId: (id) =>
      set((state) => {
        state.clientId = id;
      }),

    handleTransfer: async () => {
      const {
        selectedWalletType,
        selectedTargetWalletType,
        selectedCurrency,
        targetCurrency,
        transferAmount,
        transferType,
        clientId,
        setLoading,
      } = get();
      setLoading(true);

      const url = `${endpoint}/transfer`;

      const toType =
        transferType.value === "client"
          ? selectedWalletType.value
          : selectedTargetWalletType.value;

      const toCurrency =
        transferType.value === "client" ||
        (transferType.value === "wallet" &&
          ["ECO", "FUTURES"].includes(selectedWalletType.value)) ||
        ["ECO", "FUTURES"].includes(selectedTargetWalletType.value)
          ? selectedCurrency
          : targetCurrency;

      const { data, error } = await $fetch({
        url,
        silent: true,
        method: "POST",
        body: {
          fromType: selectedWalletType.value,
          toType,
          fromCurrency: selectedCurrency,
          toCurrency,
          amount: transferAmount,
          transferType: transferType.value,
          clientId: transferType.value === "client" ? clientId : null,
        },
      });

      if (!error) {
        set((state) => {
          state.transfer = data;
          state.step = 6;
        });
      } else {
        toast.error(error || "An unexpected error occurred");
      }
      setLoading(false);
    },
  }))
);
