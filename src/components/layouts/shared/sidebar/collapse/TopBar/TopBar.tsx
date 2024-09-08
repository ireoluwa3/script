import { TopBarProps } from "./TopBar.types";
import { Icon } from "@iconify/react";
import LogoText from "@/components/vector/LogoText";
import { cn } from "@/utils/cn";

const TopBarBase = ({
  collapse,
  sidebarOpened,
  setIsSidebarOpenedMobile,
  collapseSidebarToggle,
}: TopBarProps) => {
  const containerClasses = cn(
    "flex h-16 min-h-[64px] items-center justify-between border-b px-6",
    {
      "border-primary-700": collapse,
      "border-muted-200 dark:border-muted-800": !collapse,
    }
  );

  const logoTextClasses = cn("max-w-[110px]", {
    "text-white": collapse,
    "text-muted-900 dark:text-white": !collapse,
    "lg:hidden": !sidebarOpened,
  });

  const collapseButtonClasses = cn(
    "mask mask-blob hidden h-10 w-10 items-center justify-center transition-all duration-300 lg:flex",
    {
      "cursor-pointer hover:bg-primary-700": collapse,
      "text-muted-400 hover:bg-muted-100 dark:text-muted-100 dark:hover:bg-muted-800":
        !collapse,
      "rotate-180": !sidebarOpened,
    }
  );

  const collapseIconClasses = cn({
    "h-4 w-4 text-muted-100": collapse,
    "h-5 w-5": !collapse,
  });

  const mobileButtonClasses = cn(
    "flex h-10 w-10 items-center justify-center duration-300 lg:hidden",
    {
      "cursor-pointer transition-transform": collapse,
      "transition-colors": !collapse,
    }
  );

  const mobileIconClasses = cn({
    "h-4 w-4 text-muted-100": collapse,
    "h-5 w-5 text-muted-400": !collapse,
  });

  return (
    <div className={containerClasses}>
      <LogoText className={logoTextClasses} />
      <button
        type="button"
        className={collapseButtonClasses}
        onClick={collapseSidebarToggle}
      >
        <Icon icon="lucide:arrow-left" className={collapseIconClasses} />
      </button>
      <button
        type="button"
        className={mobileButtonClasses}
        onClick={() => setIsSidebarOpenedMobile(false)}
      >
        <Icon icon="lucide:arrow-left" className={mobileIconClasses} />
      </button>
    </div>
  );
};

export const TopBar = TopBarBase;
