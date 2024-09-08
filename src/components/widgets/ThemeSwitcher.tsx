import React, { type FC } from "react";
import { Icon } from "@iconify/react";
import { useDashboardStore } from "@/stores/dashboard";

const switcherStatus = process.env.NEXT_PUBLIC_THEME_SWITCHER !== "false";

interface ThemeSwitcherProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const ThemeSwitcher: FC<ThemeSwitcherProps> = ({ className: classes = "" }) => {
  const { toggleTheme, isDark } = useDashboardStore();

  if (!switcherStatus) return null;

  return (
    <label
      className={`mask mask-blob relative block overflow-hidden ${classes}`}
    >
      <input
        type="checkbox"
        onClick={() => toggleTheme()}
        className="peer absolute start-0 top-0 z-[2] h-full w-full cursor-pointer opacity-0"
        checked={isDark}
        onChange={() => {}}
        aria-label="Toggle theme"
      />
      <span className="relative block h-9 w-9 bg-white text-lg dark:bg-muted-800 peer-checked:[&>.moon-icon]:opacity-100 peer-checked:[&>.moon-icon]:[transform:translate(-45%,-50%)] peer-checked:[&>.sun-icon]:opacity-0 peer-checked:[&>.sun-icon]:[transform:translate(-45%,-150%)]">
        <Icon
          icon="lucide:sun"
          className="sun-icon pointer-events-none absolute start-1/2 top-1/2 block -translate-x-[48%] -translate-y-[50%] text-yellow-400 opacity-100 transition-all duration-300 [&>*]:fill-yellow-400"
        />
        <Icon
          icon="material-symbols:dark-mode"
          className="moon-icon pointer-events-none absolute start-1/2 top-1/2 block text-yellow opacity-0 transition-all duration-300 [&>*]:fill-yellow-400"
        />
      </span>
    </label>
  );
};

export default ThemeSwitcher;
