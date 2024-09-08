import { useDashboardStore } from "@/stores/dashboard";
import React from "react";

const AppOverlay = () => {
  const { setIsSidebarOpenedMobile, isSidebarOpenedMobile } =
    useDashboardStore();

  return (
    <div
      className={`inset-O fixed w-full h-full z-[10] bg-muted-900 transition-opacity duration-300 ${
        isSidebarOpenedMobile
          ? "pointer-events-auto opacity-60 dark:opacity-50 lg:opacity-0 lg:pointer-events-none lg:hidden"
          : "pointer-events-none !opacity-0"
      }`}
      onClick={() => setIsSidebarOpenedMobile(!isSidebarOpenedMobile)}
    ></div>
  );
};

export default AppOverlay;
