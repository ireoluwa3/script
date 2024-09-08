import { MenuItemsProps } from "./MenuItems.types";
import { MenuContextProvider } from "@/context/MenuContext";
import { MenuItem } from "../sidebar-menu/MenuItem";
import { SubMenuItem } from "../sidebar-menu/SubMenuItem";
import { MenuDivider } from "../sidebar-menu/MenuDivider";
import { useRouter } from "next/router";
import { cn } from "@/utils/cn";
import { useDashboardStore } from "@/stores/dashboard";
import { Icon } from "@iconify/react";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

const MenuItemsBase = ({
  menuId,
  activeMenuKey,
  menuItems = [],
  specialRender,
  collapse = false,
  sideblock = false,
}: MenuItemsProps) => {
  const { activeSidebar, isFetched } = useDashboardStore();
  const router = useRouter();
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || activeSidebar !== activeMenuKey) {
    return null;
  }

  const isMenuChildActive = (items) => {
    return items.some((item) => router.pathname.startsWith(item.href));
  };

  const renderMenuItems = (items) =>
    items.length > 0 ? (
      items.map((item, index) =>
        item.subMenu ? (
          <MenuItem
            key={index}
            title={item.title}
            icon={item.icon}
            collapse={collapse}
            active={isMenuChildActive(item.subMenu)}
            sideblock={sideblock}
            description={item.description}
          >
            {item.subMenu.map((subItem, subIndex) => (
              <SubMenuItem
                key={subIndex}
                title={subItem.title}
                href={subItem.href}
                collapse={collapse}
                sideblock={sideblock}
              />
            ))}
          </MenuItem>
        ) : (
          <MenuItem
            key={index}
            title={item.title}
            icon={item.icon}
            href={item.href}
            collapse={collapse}
            sideblock={sideblock}
            description={item.description}
          />
        )
      )
    ) : (
      <li className="text-muted-500 dark:text-muted-400 text-sm px-4 py-2 h-full flex flex-col items-center justify-center">
        <span className="flex items-center justify-center gap-2">
          <Icon icon="akar-icons:arrow-left" className="w-4 h-4" />
          {t("Select a menu item")}
        </span>
      </li>
    );

  const content = specialRender ? specialRender() : renderMenuItems(menuItems);

  const listClasses = cn(
    "slimscroll h-[calc(100%_-_52px)] animate-[fadeInLeft_.5s] overflow-y-auto px-4 pb-10",
    {
      "m-0 list-none p-0": collapse,
      "py-3": !sideblock,
    }
  );

  if (collapse) {
    return (
      <li className="slimscroll flex-grow overflow-y-auto overflow-x-hidden py-3">
        <nav>
          <ul className={listClasses}>{content}</ul>
        </nav>
      </li>
    );
  }

  return (
    <ul id={menuId} className={listClasses}>
      <MenuContextProvider>
        {isFetched && content}
        {isFetched && menuItems.length > 0 && <MenuDivider />}
      </MenuContextProvider>
    </ul>
  );
};

export const MenuItems = MenuItemsBase;
