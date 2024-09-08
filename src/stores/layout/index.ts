import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export const LAYOUTS = [
  "sidebar-panel",
  "sidebar-panel-float",
  // "sidebar-collapse",
  // "sideblock",
  "top-navigation",
] as const;

export type LayoutType = (typeof LAYOUTS)[number];

const defaultLayout = process.env.NEXT_PUBLIC_DEFAULT_LAYOUT || "sidebar-panel";

type LayoutStore = {
  activeLayout: LayoutType;
  setActiveLayout: (layout: LayoutType) => void;
};

export const useLayoutStore = create<LayoutStore>()(
  immer((set) => ({
    activeLayout: defaultLayout as LayoutType,

    setActiveLayout: (layout: LayoutType) => {
      set((state) => {
        state.activeLayout = layout;
      });

      // Only set in browser context
      if (typeof window !== "undefined") {
        localStorage.setItem("PREFERED_LAYOUT", layout);
      }
    },
  }))
);

// Utility function for client-side initialization
export const restoreLayoutFromStorage = () => {
  if (typeof window !== "undefined") {
    const preferredLayout = localStorage.getItem("PREFERED_LAYOUT");
    if (preferredLayout) {
      const { setActiveLayout } = useLayoutStore.getState();
      setActiveLayout(preferredLayout as LayoutType);
    }
  }
};
