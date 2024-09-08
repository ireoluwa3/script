import { MenuItemProps } from "./MenuItem.types";
import React, { useRef } from "react";
import { Icon } from "@iconify/react";
import { useMenuContext } from "@/context/MenuContext";
import { cn } from "@/utils/cn";
import { useRouter } from "next/router";
import { useDashboardStore } from "@/stores/dashboard";
import { useTranslation } from "next-i18next";

const MenuItemBase = ({
  href,
  title,
  icon,
  children,
  collapse = false,
  active = false,
  sideblock = false,
  description,
}: MenuItemProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const { activeSidebarMenu, setActive } = useMenuContext();
  const { sidebarOpened, setSidebarOpened, setIsSidebarOpenedMobile } =
    useDashboardStore();

  const menu = `${title.toLowerCase().replace(/ /g, "-")}-menu`;
  const isActive =
    activeSidebarMenu === menu || (href && router.pathname.startsWith(href));

  const subMenuRef = useRef<HTMLDivElement>(null);

  function menuToggle() {
    if (href) {
      setIsSidebarOpenedMobile(false);
      setSidebarOpened(false);
      setActive(menu);
      router.push(href);
    } else {
      setActive(isActive ? "" : menu);
      setSidebarOpened(true);
    }
  }

  // Base classes
  const baseFlexClass = "flex w-full items-center";
  const baseIconClass = "block transition-colors duration-300";
  const baseTextClass = "text-sm transition-colors duration-300";
  const baseChevronClass = "block h-5 w-5 transition-transform duration-300";

  // Active state class determination
  const activeStateClass = () =>
    isActive || active
      ? `${collapse ? "text-white" : "text-primary-500 dark:text-primary-400"}`
      : `${
          collapse
            ? "text-white/70 group-hover/menu-item:text-white dark:group-hover/menu-item:text-muted-200"
            : "text-muted-400 dark:text-muted-400 group-hover/menu-item:text-muted-800 dark:group-hover/menu-item:text-muted-200"
        }`;

  // MenuItem class adjustment based on `collapse`
  const menuItemClass = cn(
    `group/menu-item ${baseFlexClass}`,
    collapse ? "h-[40px] px-5" : "",
    sideblock ? "h-[40px] ps-3 pe-2" : "",
    !collapse && !sideblock ? "min-h-[44px]" : ""
  );

  // IconWrapper class: Only applicable when collapsed
  const iconWrapperClass = collapse
    ? "me-2.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-sm"
    : "";

  const iconClass = cn(
    baseIconClass,
    collapse ? "h-6 w-6" : "me-3 h-5 w-5",
    activeStateClass()
  );

  // Title class with collapse functionality
  const titleClass = cn(
    baseTextClass,
    collapse &&
      "line-clamp-1 flex-grow overflow-hidden whitespace-nowrap text-start",
    activeStateClass()
  );

  // Chevron class with collapse functionality, acting like title class
  const chevronClass = cn(
    baseChevronClass,
    isActive ? "rotate-180" : "",
    collapse
      ? `text-white/70 ${!isActive ? "group-hover/menu-item:text-white" : ""} ${
          sidebarOpened ? "opacity-100" : "opacity-0"
        }`
      : "me-3 ms-auto text-muted-400",
    !collapse && activeStateClass()
  );

  return (
    <li
      className={`${
        isActive || active ? (collapse ? "text-white" : "text-primary-500") : ""
      }`}
    >
      <button className={menuItemClass} onClick={menuToggle}>
        <span className={iconWrapperClass}>
          <Icon icon={icon} className={iconClass} />
        </span>{" "}
        <div className="ml-2 flex flex-col items-start">
          <span className={titleClass}>{t(title)}</span>
          {description && (
            <span className="text-xs text-muted-400 dark:text-muted-500 group-hover/menu-item:text-muted-800 transition-all duration-300 ease-in-out dark:group-hover/menu-item:text-muted-200 leading-none">
              {t(description)}
            </span>
          )}
        </div>
        {collapse &&
          !href && ( // Only show chevron if collapse is true and href is not provided
            <span className={iconWrapperClass}>
              <Icon icon="feather:chevron-down" className={chevronClass} />
            </span>
          )}
        {!collapse &&
          !href && ( // Adjusted logic to not show chevron when href is provided
            <Icon icon="lucide:chevron-down" className={chevronClass} />
          )}
      </button>
      {!href && ( // Conditionally render submenu if href is not provided
        <div
          ref={subMenuRef}
          style={{
            maxHeight: isActive
              ? subMenuRef.current?.scrollHeight + "px"
              : "0px",
          }}
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            collapse ? "bg-primary-900/60" : ""
          }`}
        >
          <ul className={collapse ? "py-3 ps-5" : ""}>{children}</ul>
        </div>
      )}
    </li>
  );
};

export const MenuItem = MenuItemBase;
