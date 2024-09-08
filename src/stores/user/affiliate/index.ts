import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import $fetch from "@/utils/api";
import { toast } from "sonner";
import { useDashboardStore } from "@/stores/dashboard";

type Node = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  avatar: string;
  level: number;
  rewardsCount: number;
  referredCount: number;
  downlines: Node[];
};

interface AffiliateState {
  nodes: Node[];
  tree: Node | null;
  selectedNode: Node | null;
  referrals: any[];
  selectedReferral: any | null;
  loading: boolean;

  setTree: (tree: Node) => void;
  fetchNodes: () => Promise<void>;
  selectNodeByUserId: (userId: string) => void;
  fetchReferrals: () => Promise<void>;
  updateReferralStatus: (id: string, status: string) => Promise<void>;
  selectReferral: (referral: any) => void;
  selectReferralById: (id: string) => void;
}

const useAffiliateStore = create<AffiliateState>()(
  immer((set, get) => ({
    nodes: [],
    tree: null,
    selectedNode: null,
    referrals: [],
    selectedReferral: null,
    loading: false,

    setTree: (tree: Node) => {
      set({ tree });
    },

    fetchNodes: async () => {
      const { setTree } = get();
      const { profile } = useDashboardStore.getState();
      set({ loading: true });
      try {
        const { data, error } = await $fetch({
          url: "/api/ext/affiliate/referral/node",
          silent: true,
        });
        if (error) {
          throw new Error("Error fetching nodes");
        }
        if (!error && data?.downlines?.length > 0) {
          setTree(data);
        } else {
          if (!profile) return;
          setTree({
            id: profile.id,
            userId: profile.id,
            firstName: profile.firstName,
            lastName: profile.lastName,
            avatar: profile.avatar || "/img/avatars/placeholder.webp",
            level: 0, // Root level
            rewardsCount: 0, // Assuming no rewards initially
            referredCount: 0, // Assuming no referrals initially
            downlines: [], // No downlines initially
          });
        }
      } catch (error) {
        console.error("Error fetching nodes:", error);
        toast.error("Error fetching nodes");
      }
      set({ loading: false });
    },

    selectNodeByUserId: (userId: string) => {
      const node = get().nodes.find((node) => node.userId === userId) || null;
      set({ selectedNode: node });
    },

    fetchReferrals: async () => {
      set({ loading: true });
      try {
        const { data, error } = await $fetch({
          url: "/api/affiliate/referrals/list",
          silent: true,
        });
        if (error) {
          throw new Error("Error fetching referrals");
        }
        set((state) => {
          state.referrals = data;
        });
      } catch (error) {
        console.error("Error fetching referrals:", error);
        toast.error("Error fetching referrals");
      }
      set({ loading: false });
    },

    updateReferralStatus: async (id: string, status: string) => {
      try {
        await $fetch({
          url: `/api/affiliate/referral/${id}/status`,
          method: "POST",
          body: { status },
        });
        set((state) => {
          const referral = state.referrals.find((ref) => ref.id === id);
          if (referral) {
            referral.status = status;
          }
        });
      } catch (error) {
        console.error("Error updating referral status:", error);
        toast.error("Error updating referral status");
      }
    },

    selectReferral: (referral: Referral) => {
      set({ selectedReferral: referral });
    },

    selectReferralById: (id: string) => {
      const referral = get().referrals.find((ref) => ref.id === id) || null;
      set({ selectedReferral: referral });
    },
  }))
);

export default useAffiliateStore;
