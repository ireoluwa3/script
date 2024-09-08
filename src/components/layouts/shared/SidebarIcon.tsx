import React, { type FC, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import type { IconifyIcon } from "@iconify/react";
import { useRouter } from "next/router";
import { useDashboardStore } from "@/stores/dashboard";
import Link from "next/link";
import ToolTip from "@/components/elements/base/tooltips/Tooltip";
import { t } from "i18next";

interface SidebarIconProps {
  icon: string | IconifyIcon;
  name: string;
  href?: string;
  hasSubMenu: boolean;
}

const findActiveMenu = (menu, pathname) => {
  for (const item of menu) {
    if (item.href && pathname.startsWith(item.href)) {
      return item;
    }
    if (item.menu) {
      const found = findActiveMenu(item.menu, pathname);
      if (found) {
        return item;
      }
    }
    if (item.subMenu) {
      const found = findActiveMenu(item.subMenu, pathname);
      if (found) {
        return item;
      }
    }
  }
  return null;
};

const SidebarIcon: FC<SidebarIconProps> = ({
  icon,
  name,
  href,
  hasSubMenu,
}) => {
  const {
    setActiveSidebar,
    setIsPanelOpened,
    setSidebarOpened,
    sidebarOpened,
    activeSidebar,
    filteredMenu,
    setIsSidebarOpenedMobile,
  } = useDashboardStore();

  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const openSidebar = (name: string) => {
    const item = filteredMenu.find((item) => item.title === name);

    if (item && !hasSubMenu) {
      setActiveSidebar(name);
      setSidebarOpened(false);
      setIsSidebarOpenedMobile(false);
      if (href) {
        return router.push(href);
      }
      return;
    }

    const hasItems = (menu) => menu && menu.length > 0;
    if (item && (hasItems(item.menu) || hasItems(item.subMenu))) {
      if (!sidebarOpened) {
        setSidebarOpened(true);
      }
      setActiveSidebar(name);
      setIsPanelOpened(false);
    }
  };

  useEffect(() => {
    if (!filteredMenu.length) return;
    const activeMenu = findActiveMenu(filteredMenu, router.pathname);
    if (activeMenu) {
      setActiveSidebar(activeMenu.title);
    }
  }, [filteredMenu.length, router.pathname]);

  if (!isMounted) {
    return null; // Prevent rendering on the server side
  }

  const iconElement = (
    <div
      className={`side-icon-inner mask mask-blob flex h-[35px] w-[35px] items-center justify-center transition-colors duration-300 ${
        activeSidebar === name ? "bg-primary-500/10 dark:bg-primary-500/20" : ""
      }`}
    >
      <Icon
        icon={icon}
        className={`relative text-2xl text-muted-400 transition-colors duration-300 ${
          activeSidebar === name
            ? "text-primary-500"
            : "group-hover/side-icon:text-muted-500 "
        }`}
      />
    </div>
  );

  return (
    <li
      className={`side-icon group/side-icon relative flex h-[52px] w-full cursor-pointer items-center justify-center ${
        activeSidebar === name ? "is-active" : ""
      }`}
      onClick={() => openSidebar(name)}
    >
      <ToolTip content={t(name)} position="end">
        {hasSubMenu ? (
          iconElement
        ) : (
          <Link href={href || "#"} aria-label={name}>
            {iconElement}
          </Link>
        )}
      </ToolTip>
    </li>
  );
};

export default SidebarIcon;
