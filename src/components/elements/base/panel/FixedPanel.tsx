import React, { useEffect } from "react";
import { Icon } from "@iconify/react";
import { useDashboardStore } from "@/stores/dashboard";

const FixedPanel = ({ title, name, children }) => {
  const { panels, setPanelOpen } = useDashboardStore();
  const isPanelOpened = panels[name] || false;

  useEffect(() => {
    if (isPanelOpened) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isPanelOpened]);

  return (
    <div
      className={`fixed end-0 top-0 z-[11] h-full w-[340px] border bg-white shadow-lg shadow-muted-300/30 transition-all duration-300 dark:border-muted-800 dark:bg-muted-900 dark:shadow-muted-800/30 ${
        isPanelOpened ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex h-20 items-center justify-between px-6 text-base">
        <h2 className="font-sans text-sm font-light uppercase leading-tight tracking-wide text-muted-800 dark:text-muted-100">
          {title}
        </h2>
        <button
          aria-label="Close panel"
          onClick={() => setPanelOpen(name, false)}
          className="mask mask-blob flex h-10 w-10 cursor-pointer items-center justify-center text-xl text-muted-400 transition-colors duration-300 hover:bg-muted-200 dark:text-muted-100 dark:hover:bg-muted-800"
        >
          <Icon icon="lucide:arrow-right" />
        </button>
      </div>
      <div className="mb-16 p-6 pt-0 h-full">{children}</div>
    </div>
  );
};

export default FixedPanel;
