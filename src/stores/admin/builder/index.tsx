import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import $fetch from "@/utils/api";

interface ComponentData {
  theme: string;
  name: string;
}

interface BuilderState {
  loading?: boolean;
  sidebar: string;
  setSidebar: (sidebar: string) => void;

  saveEditorState: (content: any) => void;
}

const useBuilderStore = create<BuilderState>()(
  immer((set, get) => ({
    loading: true,
    sidebar: "",

    setSidebar: (sidebar) =>
      set((state) => {
        state.sidebar = sidebar;
      }),

    saveEditorState: async (content) => {
      await $fetch({
        url: "/api/admin/content/editor",
        method: "POST",
        body: { content, path: "/" },
      });
    },
  }))
);

export default useBuilderStore;
