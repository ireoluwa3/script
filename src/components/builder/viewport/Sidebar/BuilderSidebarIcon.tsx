import React, { type FC } from "react";
import { Icon } from "@iconify/react";
import type { IconifyIcon } from "@iconify/react";
import useBuilderStore from "@/stores/admin/builder";
import DarkToolTip from "@/components/elements/base/tooltips/DarkTooltip";

interface SidebarIconProps {
  icon: string | IconifyIcon;
  name: string;
}

const BuilderSidebarIcon: FC<SidebarIconProps> = ({ icon, name }) => {
  const { sidebar, setSidebar } = useBuilderStore();

  return (
    <li
      className={`side-icon group/side-icon relative flex h-[52px] w-full cursor-pointer items-center justify-center ${
        sidebar === name ? "is-active" : ""
      }`}
      onClick={() => (sidebar === name ? setSidebar("") : setSidebar(name))}
    >
      <DarkToolTip content={name} position="end">
        <div
          className={`side-icon-inner mask mask-blob flex h-[35px] w-[35px] items-center justify-center transition-colors duration-300 ${
            sidebar === name
              ? "bg-primary-500/10 dark:bg-primary-500/20"
              : "bg-muted-200 dark:bg-muted-800"
          }`}
        >
          <Icon
            icon={icon}
            className={`relative h-7 w-7 text-muted-600 dark:text-muted-400 transition-colors duration-300 ${
              sidebar === name
                ? "text-primary-500"
                : "group-hover/side-icon:text-muted-500 dark:group-hover/side-icon:text-muted-300"
            }`}
          />
        </div>
      </DarkToolTip>
    </li>
  );
};

export default BuilderSidebarIcon;
