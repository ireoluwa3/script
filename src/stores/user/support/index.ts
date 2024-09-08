import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import WebSocketManager from "@/utils/ws";
import $fetch from "@/utils/api";
import { toast } from "sonner";
import { useDashboardStore } from "../../dashboard";

interface TicketState {
  ticket: any | null;
  ws: WebSocketManager | null;
  isSupport: boolean;
  isReplying: boolean;

  setIsSupport: (value: boolean) => void;
  initializeWebSocket: (id: string) => void;
  disconnectWebSocket: () => void;
  fetchTicket: (id: string) => Promise<void>;

  replyToTicket: (message: string, attachment?: string) => Promise<void>;
  handleFileUpload: (file?: File) => Promise<void>;
  resolveTicket: (id: string, status: string) => Promise<void>;
}

const useSupportStore = create<TicketState>()(
  immer((set, get) => ({
    ticket: null,
    ws: null,
    isReplying: false,
    isSupport: false,

    setIsSupport: (value: boolean) => {
      set({ isSupport: value });
    },

    initializeWebSocket: (id: string) => {
      const wsPath = `/api/user/support/ticket`;
      const wsManager = new WebSocketManager(wsPath);

      wsManager.connect();
      wsManager.on("open", () =>
        wsManager.send({ action: "SUBSCRIBE", payload: { id } })
      );
      wsManager.on("message", (msg) => {
        if (msg.method) {
          switch (msg.method) {
            case "update": {
              const { data } = msg;
              set((state) => {
                state.ticket = {
                  ...state.ticket,
                  ...data,
                };
              });
              break;
            }
            case "reply": {
              const { data } = msg;
              const messages = get().ticket.messages || [];
              set((state) => {
                state.ticket = {
                  ...state.ticket,
                  messages: [...(messages || []), data.message],
                  status: data.status,
                  updatedAt: data.updatedAt,
                };
              });
              break;
            }
            default:
              break;
          }
        }
      });

      wsManager.on("close", () =>
        wsManager.send({ action: "UNSUBSCRIBE", payload: { id } })
      );

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

    fetchTicket: async (id: string) => {
      const { isSupport } = get();
      const url = isSupport
        ? `/api/admin/crm/support/ticket/${id}`
        : `/api/user/support/ticket/${id}`;
      try {
        const { data, error } = await $fetch({
          url,
          silent: true,
        });
        if (error) {
          toast.error("Ticket not found");
        } else {
          set((state) => {
            state.ticket = data;
          });
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    },

    replyToTicket: async (message, attachment) => {
      const { isSupport, isReplying, ticket } = get();

      if ((!message.trim() && attachment === "") || isReplying) return;
      set({ isReplying: true });

      const profile = useDashboardStore.getState().profile;
      if (!profile) return;

      await $fetch({
        url: `/api/user/support/ticket/${ticket.id}`,
        method: "POST",
        silent: true,
        body: {
          type: isSupport ? "agent" : "client",
          text: message,
          time: new Date(),
          userId: profile.id,
          attachment: attachment || "",
        },
      });

      set({ isReplying: false });
    },

    handleFileUpload: async (file) => {
      const { replyToTicket, ticket } = get();
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
              dir: `support/tickets/${ticket?.id}`,
              height: uploadHeight,
              width: uploadWidth,
            },
          });

          if (error) {
            console.error("Error uploading file:", error);
            return;
          }

          // Call replyToTicket with the uploaded image URL
          return replyToTicket("", data.url);
        };
        reader.onerror = () => console.error("Error reading file");
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error processing file", error);
      }
    },

    resolveTicket: async (id, status) => {
      const { isSupport } = get();
      const url = isSupport
        ? `/api/admin/crm/support/ticket/${id}/status`
        : `/api/user/support/ticket/${id}/close`;

      await $fetch({
        url: url,
        method: "PUT",
        body: { status },
      });
    },
  }))
);

export default useSupportStore;
