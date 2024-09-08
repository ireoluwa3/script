import React, { FC, useEffect, useState } from "react";
import { MashImage } from "@/components/elements/MashImage";
import Link from "next/link";
import Logo from "@/components/vector/Logo";
import SidebarIcon from "@/components/layouts/shared/SidebarIcon";
import { useDashboardStore } from "@/stores/dashboard";
import { Icon } from "@iconify/react";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { AnimatedTooltip } from "@/components/elements/base/tooltips/AnimatedTooltip";
import { useTranslation } from "next-i18next";

interface IconSidebarProps {
  float?: boolean;
}

const IconSidebar: FC<IconSidebarProps> = ({ float = false }) => {
  const {
    isSidebarOpenedMobile,
    sidebarOpened,
    isProfileOpen,
    filteredMenu,
    profile,
    isAdmin,
    activeMenuType,
    toggleMenuType,
    isFetched,
  } = useDashboardStore();
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Prevent rendering on the server side
  }

  return (
    <nav
      className={`fixed start-0 top-0 z-[12] ${
        float ? "" : "h-full"
      } w-20 overflow-visible border border-muted-200 bg-white transition-all duration-300 dark:border-muted-800 dark:bg-muted-950 lg:translate-x-0 ${
        isSidebarOpenedMobile ? "translate-x-0" : "-translate-x-full"
      } ${
        float
          ? sidebarOpened
            ? "h-full"
            : "h-full lg:m-3 lg:h-[calc(100%-1.5rem)] lg:rounded-2xl"
          : ""
      }`}
    >
      <div className="relative h-full">
        <ul className={`${float ? (sidebarOpened ? "" : "my-2") : ""}`}>
          <li className="relative mb-2 flex h-20 w-full items-center justify-center">
            <Link
              href="/"
              className="relative flex h-10 w-10 mt-2 items-center justify-center text-sm no-underline transition-all duration-100 ease-linear"
              aria-label="Home"
            >
              <Logo
                className={`${
                  float ? "mt-[-5px]" : "-mt-[5px]"
                } h-7 w-7 text-primary-500 transition-opacity duration-300 hover:opacity-80`}
              />
            </Link>
          </li>

          {filteredMenu.map(({ title, icon, href, menu, subMenu }) => (
            <SidebarIcon
              key={title}
              icon={icon}
              name={title}
              href={href}
              hasSubMenu={!!menu || !!subMenu}
            />
          ))}
        </ul>

        {isFetched && profile && (
          <>
            <ul
              className={`absolute bottom-0 start-0 ${
                float ? "my-3" : ""
              } w-full`}
            >
              {isAdmin && (
                <li className="relative flex h-16 w-full items-center justify-center">
                  <span onClick={toggleMenuType} className="relative z-[4]">
                    <AnimatedTooltip
                      content={
                        activeMenuType === "admin" ? t("Admin") : t("User")
                      }
                      position="top"
                    >
                      <IconButton
                        variant={"pastel"}
                        color={activeMenuType === "admin" ? "primary" : "muted"}
                        aria-label="Switch User Type"
                      >
                        <Icon icon={"ph:user-switch"} />
                      </IconButton>
                    </AnimatedTooltip>
                  </span>
                </li>
              )}
              <li className="relative flex h-16 w-full items-center justify-center">
                <Link
                  href="/user/profile"
                  className="relative z-[4]"
                  aria-label="Profile"
                >
                  <MashImage
                    className={`mx-auto h-10 w-10 transition-transform ${
                      float
                        ? "rounded-full duration-300"
                        : "mask mask-blob duration-[400ms]"
                    } ${isProfileOpen ? "scale-0" : ""}`}
                    src={profile?.avatar || "/img/avatars/placeholder.webp"}
                    height={350}
                    width={350}
                    alt="profile"
                  />

                  <span
                    className={`absolute ${
                      float
                        ? "end-[-0.04rem] top-[-0.04rem] h-3 w-3 rounded-[100px] duration-[400ms]"
                        : "-end-[.04rem] -top-[.04rem] h-[.64rem] w-[.64rem] rounded-full duration-300"
                    } scale-100 border border-white bg-primary-500 transition-transform  dark:border-muted-950  ${
                      isProfileOpen ? "scale-0" : ""
                    }`}
                  ></span>
                </Link>
              </li>
            </ul>
          </>
        )}
      </div>
    </nav>
  );
};

export default IconSidebar;
