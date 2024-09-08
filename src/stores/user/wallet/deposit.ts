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

type DepositStore = {
  step: number;
  walletTypes: WalletType[];
  selectedWalletType: WalletType;
  currencies: Currency[];
  selectedCurrency: string;
  depositMethods: any;
  selectedDepositMethod: any | null;
  depositAddress: any;
  depositAmount: number;
  loading: boolean;
  deposit: any;
  stripeListener: boolean;
  transactionHash: string;
  transactionSent: boolean;
  contractType: string | null;

  setStep: (step: number) => void;
  setSelectedWalletType: (walletType: WalletType) => void;
  setSelectedCurrency: (currency: string) => void;
  setDepositMethods: (methods: any[]) => void;
  setSelectedDepositMethod: (
    method: any | null,
    contractType: string | null
  ) => void;
  setDepositAmount: (amount: number) => void;
  stripeDeposit: () => void;
  paypalDeposit: () => void;
  handleFiatDeposit: (values) => void;
  fetchCurrencies: () => void;
  fetchDepositAddress: () => void;
  fetchDepositMethods: () => void;
  setDeposit: (deposit: any) => void;
  clearAll: () => void;
  stopStripeListener: () => void;
  verifySession: (sessionId: string) => void;
  setTransactionHash: (hash: string) => void;
  sendTransactionHash: () => void;
  unlockAddress: (address: string) => void;
  setLoading: (loading: boolean) => void;
  initializeWalletTypes: () => void;
};

const endpoint = "/api/finance";

export const useDepositStore = create<DepositStore>()(
  immer((set, get) => ({
    step: 1,
    walletTypes: [],
    selectedWalletType: { value: "", label: "Select a wallet type" },
    currencies: [],
    selectedCurrency: "Select a currency",
    depositMethods: [],
    selectedDepositMethod: null,
    depositAddress: "",
    depositAmount: 0,
    loading: false,
    deposit: null,
    stripeListener: false,
    transactionHash: "",
    transactionSent: false,
    contractType: null,

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
    unlockAddress: async (address) => {
      await $fetch({
        url: `/api/ext/ecosystem/deposit/unlock?address=${address}`,
        silent: true,
      });
    },
    setSelectedDepositMethod: async (method, newContractType) => {
      set((state) => {
        state.selectedDepositMethod = method;
        state.contractType = newContractType;
      });
    },
    setDepositAmount: (amount) =>
      set((state) => {
        state.depositAmount = amount;
      }),

    setDeposit: (deposit) =>
      set((state) => {
        state.deposit = deposit;
      }),

    setTransactionHash: (hash) =>
      set((state) => {
        state.transactionHash = hash;
      }),

    setLoading: (loading) =>
      set((state) => {
        state.loading = loading;
      }),

    stripeDeposit: async () => {
      set((state) => {
        state.loading = true;
        state.stripeListener = true;
      });

      const { depositAmount, selectedCurrency, verifySession } = get();
      const { data, error } = await $fetch({
        url: `${endpoint}/deposit/fiat/stripe`,
        method: "POST",
        silent: true,
        body: {
          amount: depositAmount,
          currency: selectedCurrency,
        },
      });

      set((state) => {
        state.loading = false;
      });

      if (!error && data.url) {
        const stripePopup = window.open(
          data.url,
          "stripePopup",
          "width=500,height=700"
        );
        if (!stripePopup) {
          toast.error("Popup blocked or failed to open.");
          set((state) => {
            state.stripeListener = false;
          });
          return;
        }

        // Define the message handler function
        const messageHandler = (event) => {
          if (event.origin === window.location.origin) {
            if (event.data.sessionId) {
              verifySession(event.data.sessionId);
            } else if (event.data.status === "canceled") {
              set((state) => {
                state.stripeListener = false;
              });
              toast.error("Payment was canceled by the user");
            }
          }
        };

        window.addEventListener("message", messageHandler);

        // Check if the popup window is closed
        const checkPopup = setInterval(() => {
          if (!stripePopup || stripePopup.closed) {
            clearInterval(checkPopup);
            window.removeEventListener("message", messageHandler);
            set((state) => {
              state.stripeListener = false;
            });
          }
        }, 500);
      } else {
        set((state) => {
          state.stripeListener = false;
        });
        toast.error(error || "An unexpected error occurred");
      }
    },

    stopStripeListener: () => {
      set((state) => {
        state.stripeListener = false;
      });
    },

    verifySession: async (sessionId) => {
      try {
        const { data, error } = await $fetch({
          url: `/api/finance/deposit/fiat/stripe/verify`,
          method: "POST",
          silent: true,
          params: { sessionId },
        });

        if (!error) {
          useDepositStore.getState().setDeposit(data);
          useDepositStore.getState().setStep(5);
        } else {
          toast.error(
            error || "An unexpected error occurred during payment verification"
          );
        }
      } catch (error) {
        console.error("Error in fetching payment status:", error);
        toast.error(
          "Error in communication with payment verification endpoint"
        );
      }
    },

    paypalDeposit: async () => {
      const { depositAmount, selectedCurrency } = get();
      const { error } = await $fetch({
        url: `${endpoint}/deposit/fiat/paypal`,
        method: "POST",
        silent: true,
        body: {
          amount: depositAmount,
          currency: selectedCurrency,
        },
      });

      if (!error) {
        set((state) => {
          state.step = 5;
        });
      } else {
        toast.error(error || "An unexpected error occurred");
      }
    },

    handleFiatDeposit: async (values) => {
      const { selectedDepositMethod, depositAmount, selectedCurrency } = get();
      if (
        !selectedDepositMethod ||
        !depositAmount ||
        !selectedCurrency ||
        depositAmount <= 0 ||
        depositAmount < selectedDepositMethod.minAmount
      ) {
        toast.error("Invalid deposit amount");
        return;
      }
      if (selectedDepositMethod?.alias === "stripe") {
        return get().stripeDeposit();
      } else if (selectedDepositMethod?.alias === "paypal") {
        return get().paypalDeposit();
      }

      try {
        const { data, error } = await $fetch({
          url: `${endpoint}/deposit/fiat`,
          method: "POST",
          silent: true,
          body: {
            amount: depositAmount,
            currency: selectedCurrency,
            methodId: selectedDepositMethod?.id,
            customFields: values,
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
      } catch (error) {
        console.error("Error in fiat deposit:", error);
        toast.error("An error occurred while processing deposit");
      }
    },

    fetchCurrencies: async () => {
      const { selectedWalletType } = get();
      try {
        const { data, error } = await $fetch({
          url: `${endpoint}/currency?action=deposit&walletType=${selectedWalletType.value}`,
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

    fetchDepositMethods: async () => {
      const { selectedWalletType, selectedCurrency } = get();
      try {
        const { data, error } = await $fetch({
          url: `${endpoint}/currency/${selectedWalletType.value}/${selectedCurrency}?action=deposit`,
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

    fetchDepositAddress: async () => {
      const {
        selectedWalletType,
        selectedCurrency,
        selectedDepositMethod,
        contractType,
      } = get();
      const url =
        selectedWalletType.value === "ECO"
          ? `/api/ext/ecosystem/wallet/${selectedCurrency}${
              contractType === "NO_PERMIT"
                ? `?contractType=${contractType}&chain=${selectedDepositMethod}`
                : ""
            }`
          : `${endpoint}/currency/${selectedWalletType.value}/${selectedCurrency}/${selectedDepositMethod}`;

      try {
        const { data, error } = await $fetch({
          url,
          silent: true,
        });

        if (!error) {
          if (
            selectedWalletType.value === "ECO" &&
            data.address &&
            selectedDepositMethod
          ) {
            if (contractType === "NO_PERMIT") {
              set((state) => {
                state.depositAddress = data;
              });
            } else {
              set((state) => {
                state.depositAddress = JSON.parse(data.address)[
                  selectedDepositMethod
                ];
              });
            }
          } else if (selectedWalletType.value === "SPOT" && data) {
            set((state) => {
              state.depositAddress = data;
            });
          }
        } else {
          toast.error(
            error || "An error occurred while fetching deposit address"
          );
          set((state) => {
            state.step = 3;
          });
        }
      } catch (error) {
        console.error("Error in fetching deposit address:", error);
        toast.error("An error occurred while fetching deposit address");
      }
    },

    sendTransactionHash: async () => {
      const { transactionHash, selectedCurrency, selectedDepositMethod } =
        get();
      try {
        const { data, error } = await $fetch({
          url: `${endpoint}/deposit/spot`,
          method: "POST",
          silent: true,
          body: {
            currency: selectedCurrency,
            chain: selectedDepositMethod,
            trx: transactionHash,
          },
        });

        if (!error) {
          set((state) => {
            state.deposit = data;
            state.transactionSent = true;
            state.loading = true; // Set loading true when sending the transaction
          });
        } else {
          toast.error(error || "An unexpected error occurred");
          set((state) => {
            state.loading = false;
          });
        }
      } catch (error) {
        console.error("Error in sending transaction hash:", error);
        toast.error("An error occurred while sending transaction hash");
        set((state) => {
          state.loading = false;
        });
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
        depositAddress: "",
        depositAmount: 0,
        loading: false,
        deposit: null,
        stripeListener: false,
        transactionHash: "",
      })),
  }))
);
