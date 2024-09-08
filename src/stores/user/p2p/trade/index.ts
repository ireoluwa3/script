import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import WebSocketManager from "@/utils/ws";
import $fetch from "@/utils/api";
import { toast } from "sonner";
import { useDashboardStore } from "../../../dashboard";

type Trade = {
  id: string;
  userId: string;
  sellerId: string;
  offerId: string;
  amount: number;
  status: string;
  txHash: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
  };
  seller: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
  };
  offer: {
    id: string;
    status: string;
    currency: string;
    paymentMethod: {
      id: string;
      userId: string;
      name: string;
      instructions: string;
      currency: string;
      chain: string;
      walletType: string;
      image: string;
      status: boolean;
      createdAt: string;
      updatedAt: string;
      deletedAt: string;
    };
    p2pReviews: {
      id: string;
      rating: number;
      comment: string;
      createdAt: string;
      reviewer: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        avatar: string;
      };
    }[];
  };
  p2pDisputes: {
    id: string;
    status: string;
    reason: string;
    resolution: string;
    raisedBy: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      avatar: string;
    };
  }[];
};

interface TradeState {
  trade: Trade | null;
  ws: WebSocketManager | null;
  isSeller: boolean;
  isSupport: boolean;
  isReplying: boolean;

  reviewRating: number;
  hoverRating: number;
  comment: string;

  setIsSeller: (value: boolean) => void;
  setIsSupport: (value: boolean) => void;
  initializeWebSocket: (userId: string, id: string) => void;
  disconnectWebSocket: () => void;
  fetchTrade: (id: string) => Promise<void>;

  replyToTrade: (message: string, attachment?: string) => Promise<void>;
  handleFileUpload: (file?: File) => Promise<void>;

  cancelTrade: () => Promise<void>;
  markAsPaidTrade: (txHash: string) => Promise<void>;
  disputeTrade: (reason: string) => Promise<void>;
  cancelDisputeTrade: () => Promise<void>;
  releaseTrade: () => Promise<void>;
  refundTrade: () => Promise<void>;

  adminCancelTrade: () => Promise<void>;
  adminResolveDispute: (resolution: string) => Promise<void>;
  adminCloseDispute: () => Promise<void>;
  adminCompleteTrade: () => Promise<void>;

  submitReview: () => Promise<void>;
  setReviewRating: (value: number) => void;
  setHoverRating: (value: number) => void;
  setComment: (value: string) => void;
}

const useP2PStore = create<TradeState>()(
  immer((set, get) => ({
    trade: null,
    ws: null,
    isReplying: false,
    isSeller: false,
    isSupport: false,

    reviewRating: 0,
    hoverRating: 0,
    comment: "",
    setReviewRating: (value: number) => {
      set({ reviewRating: value });
    },
    setHoverRating: (value: number) => {
      set({ hoverRating: value });
    },
    setComment: (value: string) => {
      set({ comment: value });
    },

    setIsSeller: (value: boolean) => {
      set({ isSeller: value });
    },

    setIsSupport: (value: boolean) => {
      set({ isSupport: value });
    },

    initializeWebSocket: (userId: string, id: string) => {
      const wsPath = `/api/ext/p2p/trade?userId=${userId}`;
      const wsManager = new WebSocketManager(wsPath);

      wsManager.on("open", () => {
        console.log("WebSocket connection opened.");
        wsManager.send({
          action: "SUBSCRIBE",
          payload: { id },
        });
      });

      wsManager.on("message", (msg) => {
        const { trade } = get();
        if (!trade) return;
        console.log(msg.method);

        if (msg.method && trade) {
          switch (msg.method) {
            case "update": {
              const { data } = msg;
              set((state) => {
                state.trade = {
                  ...state.trade,
                  ...data,
                };
              });
              break;
            }
            case "reply": {
              const { data } = msg;
              const messages = trade.messages || [];
              set((state) => {
                state.trade = {
                  ...trade,
                  messages: [...messages, data.message],
                  updatedAt: data.updatedAt,
                } as any;
              });
              break;
            }
            default:
              break;
          }
        }
      });

      wsManager.on("close", () => {
        console.log("WebSocket connection closed");
        wsManager.send({
          action: "UNSUBSCRIBE",
          payload: { id },
        });
        wsManager.reconnect();
      });

      wsManager.on("error", (error) => {
        console.error("WebSocket error:", error);
      });

      wsManager.connect();

      set((state) => {
        state.ws = wsManager;
      });
    },

    disconnectWebSocket: () => {
      const { ws } = get();
      if (ws) {
        ws.disconnect();
        set({ ws: null });
      }
    },

    fetchTrade: async (id: string) => {
      const url = `/api/ext/p2p/trade/${id}`;
      try {
        const { data, error } = await $fetch({
          url,
          silent: true,
        });
        if (error) {
          toast.error("Trade not found");
        } else {
          set((state) => {
            state.trade = data;
          });
        }
      } catch (error) {
        console.error("Error fetching trades:", error);
      }
    },

    replyToTrade: async (message, attachment) => {
      const { isSeller, ws, isReplying } = get();

      if ((!message.trim() && attachment === "") || isReplying) return;
      set({ isReplying: true });

      const profile = useDashboardStore.getState().profile;
      if (!profile) return;

      const type = isSeller ? "seller" : "buyer";

      const messageData: ChatMessage = {
        type,
        text: message,
        time: new Date(),
        userId: profile.id,
        attachment: attachment || "",
      };

      ws?.send({
        payload: {
          id: get().trade?.id,
          message: messageData,
        },
      });

      set({ isReplying: false });
    },

    handleFileUpload: async (file) => {
      const { replyToTrade, trade } = get();
      if (!file) return;

      // Helper function to determine the dimensions
      const getImageDimensions = (file) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            resolve({ width: img.width, height: img.height });
          };
          img.onerror = reject;
          img.src = URL.createObjectURL(file);
        });
      };

      try {
        // Get image dimensions
        const dimensions: { width: number; height: number } =
          (await getImageDimensions(file)) as any;
        let uploadHeight = 1024;
        let uploadWidth = 728;

        // Check if original size is smaller than the target size
        if (
          dimensions.width < uploadWidth &&
          dimensions.height < uploadHeight
        ) {
          uploadHeight = dimensions.height;
          uploadWidth = dimensions.width;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
          const base64File = e.target?.result;
          const { data, error } = await $fetch({
            url: "/api/upload",
            method: "POST",
            silent: true,
            body: {
              file: base64File,
              dir: `p2p/trade/${trade?.id}`,
              height: uploadHeight,
              width: uploadWidth,
            },
          });

          if (error) {
            console.error("Error uploading file:", error);
            return;
          }

          // Call replyToTrade with the uploaded image URL
          return replyToTrade("", data.url);
        };
        reader.onerror = () => console.error("Error reading file");
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error processing file", error);
      }
    },

    cancelTrade: async () => {
      const { trade } = get();
      if (!trade) return;
      await $fetch({
        url: `/api/ext/p2p/trade/${trade.id}/cancel`,
        method: "POST",
      });
    },

    markAsPaidTrade: async (txHash: string) => {
      const { trade } = get();
      if (!trade) return;
      await $fetch({
        url: `/api/ext/p2p/trade/${trade.id}/status`,
        method: "POST",
        body: { txHash },
      });
    },

    disputeTrade: async (reason: string) => {
      const { trade } = get();
      if (!trade) return;
      await $fetch({
        url: `/api/ext/p2p/trade/${trade.id}/dispute`,
        method: "POST",

        body: { reason },
      });
    },

    cancelDisputeTrade: async () => {
      const { trade } = get();
      if (!trade) return;
      await $fetch({
        url: `/api/ext/p2p/trade/${trade.id}/dispute/cancel`,
        method: "POST",
      });
    },

    releaseTrade: async () => {
      const { trade } = get();
      if (!trade) return;
      await $fetch({
        url: `/api/ext/p2p/trade/${trade.id}/release`,
        method: "POST",
      });
    },

    refundTrade: async () => {
      const { trade } = get();
      if (!trade) return;
      await $fetch({
        url: `/api/ext/p2p/trade/${trade.id}/refund`,
        method: "POST",
      });
    },

    adminResolveDispute: async (resolution: string) => {
      const { trade } = get();
      if (!trade) return;
      await $fetch({
        url: `/api/admin/ext/p2p/dispute/${trade.id}/resolve`,
        method: "POST",
        body: { resolution },
      });
    },

    adminCloseDispute: async () => {
      const { trade } = get();
      if (!trade) return;
      await $fetch({
        url: `/api/admin/ext/p2p/dispute/${trade.id}/close`,
        method: "POST",
      });
    },

    adminCompleteTrade: async () => {
      const { trade } = get();
      if (!trade) return;
      await $fetch({
        url: `/api/admin/ext/p2p/trade/${trade.id}/release`,
        method: "POST",
      });
    },

    adminCancelTrade: async () => {
      const { trade } = get();
      if (!trade) return;
      await $fetch({
        url: `/api/admin/ext/p2p/trade/${trade.id}/cancel`,
        method: "POST",
      });
    },

    submitReview: async () => {
      const { trade, reviewRating, comment } = get();
      if (!trade) return;
      const { error } = await $fetch({
        url: `/api/ext/p2p/offer/${trade.offer.id}/review`,
        method: "POST",
        body: {
          rating: reviewRating,
          comment,
        },
      });

      if (!error) {
        get().fetchTrade(trade.id);
      }
    },
  }))
);

export default useP2PStore;
