import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import Link from "next/link";
import LogoText from "@/components/vector/LogoText";
import ThemeSwitcher from "@/components/widgets/ThemeSwitcher";
import { Icon } from "@iconify/react";
import { useDashboardStore } from "@/stores/dashboard";
import { AnimatedTooltip } from "@/components/elements/base/tooltips/AnimatedTooltip";
import { Menu } from "./Menu";
import { SearchResults } from "../shared/SearchResults";
import { NotificationsDropdown } from "../shared/NotificationsDropdown";
import { AccountDropdown } from "../shared/AccountDropdown";
import { locales } from "../shared/Locales/Locales";
import { LocaleLogo } from "../shared/Locales/LocaleLogo";

const TopNavbar = ({ trading, transparent }) => {
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { t, i18n } = useTranslation();

  const {
    profile,
    isSidebarOpenedMobile,
    setIsSidebarOpenedMobile,
    isAdmin,
    activeMenuType,
    toggleMenuType,
    isFetched,
    announcements,
  } = useDashboardStore();
  const { setPanelOpen } = useDashboardStore();
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Bicrypto";

  return (
    <nav
      className={`relative z-[11] ${
        !transparent &&
        "border-b border-muted-200 bg-white dark:border-muted-900 dark:bg-muted-900"
      }`}
      role="navigation"
      aria-label="main navigation"
    >
      <div
        className={`${
          transparent &&
          "fixed border-b border-muted-200 bg-white dark:border-muted-900 dark:bg-muted-900"
        } flex flex-col lg:flex-row min-h-[2.6rem] items-stretch justify-center w-full`}
      >
        <div className="flex justify-between items-center px-3">
          <Link
            className="relative flex flex-shrink-0 flex-grow-0 items-center rounded-[.52rem] px-3 py-2 no-underline transition-all duration-300"
            href="/"
          >
            <LogoText
              className={`max-w-[100px] w-[100px] text-muted-900 dark:text-white`}
            />
          </Link>

          <div className="flex items-center justify-center">
            {isSidebarOpenedMobile && isAdmin && isFetched && profile && (
              <div className="flex items-center justify-center lg:hidden">
                <AnimatedTooltip
                  content={activeMenuType === "admin" ? "Admin" : "User"}
                  position="bottom"
                >
                  <Icon
                    icon={"ph:user-switch"}
                    onClick={toggleMenuType}
                    className={`h-5 w-5 ${
                      activeMenuType === "admin"
                        ? "text-primary-500"
                        : "text-muted-400"
                    } transition-colors duration-300 cursor-pointer`}
                  />
                </AnimatedTooltip>
              </div>
            )}
            <div>
              <button
                type="button"
                className="relative ms-auto block h-[2.6rem] w-[2.6rem] cursor-pointer appearance-none border-none bg-none text-muted-400 lg:hidden"
                aria-label="menu"
                aria-expanded="false"
                onClick={() => {
                  setIsSidebarOpenedMobile(!isSidebarOpenedMobile);
                  setIsMobileSearchActive(false);
                }}
              >
                <span
                  aria-hidden="true"
                  className={`absolute start-[calc(50%-8px)] top-[calc(50%-6px)] block h-px w-4 origin-center bg-current transition-all duration-[86ms] ease-out ${
                    isSidebarOpenedMobile
                      ? "tranmuted-y-[5px] rotate-45"
                      : "scale-[1.1] "
                  }`}
                ></span>
                <span
                  aria-hidden="true"
                  className={`absolute start-[calc(50%-8px)] top-[calc(50%-1px)] block h-px w-4 origin-center scale-[1.1] bg-current transition-all duration-[86ms] ease-out ${
                    isSidebarOpenedMobile ? "opacity-0" : ""
                  }`}
                ></span>
                <span
                  aria-hidden="true"
                  className={`absolute start-[calc(50%-8px)] top-[calc(50%+4px)] block h-px w-4 origin-center scale-[1.1] bg-current transition-all duration-[86ms] ease-out  ${
                    isSidebarOpenedMobile
                      ? "-tranmuted-y-[5px] -rotate-45"
                      : "scale-[1.1] "
                  }`}
                ></span>
              </button>
            </div>
          </div>
        </div>

        <div
          className={`w-full items-center justify-center ${
            isMobileSearchActive ? "hidden" : "flex"
          }`}
        >
          <Menu />
        </div>
        {!trading && (
          <div
            className={`ms-0 lg:ms-10 lg:me-3 w-full items-center justify-center ${
              isMobileSearchActive ? "hidden lg:flex" : "hidden"
            }`}
          >
            <div className="relative text-base w-full">
              <input
                type="text"
                value={searchTerm}
                placeholder={`${t("Search")} ${siteName} ${t("components")}`}
                className="peer relative inline-flex h-10 w-full max-w-full items-center justify-start rounded-lg border border-muted-200 bg-white py-2 pe-3 ps-10 text-base leading-tight text-muted-500 outline-none outline-0 outline-offset-0 outline-current transition-all duration-300 placeholder:text-muted-300 focus-visible:shadow-lg focus-visible:shadow-muted-300/30 dark:border-muted-800 dark:bg-muted-950 dark:text-muted-300 placeholder:dark:text-muted-700 dark:focus-visible:shadow-muted-800/30"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setSearchTerm(event.currentTarget.value);
                }}
              />

              <div className="absolute start-0 top-0 z-[1] flex h-10 w-10 items-center justify-center transition-colors duration-300">
                <Icon
                  icon="lucide:search"
                  className="h-4 w-4 text-muted-400 transition-colors duration-300"
                />
              </div>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setIsMobileSearchActive(false);
                }}
                className="absolute end-0 top-0 z-[1] flex h-10 w-10 items-center justify-center transition-colors duration-300"
              >
                <Icon
                  icon="lucide:x"
                  className="h-4 w-4 text-muted-400 transition-colors duration-300"
                />
              </button>

              <SearchResults searchTerm={searchTerm} id="mobile" />
            </div>
          </div>
        )}

        <div className={`items-center gap-2 ms-auto me-3 hidden lg:flex`}>
          {isFetched && profile && isAdmin && (
            <AnimatedTooltip
              content={activeMenuType === "admin" ? "Admin" : "User"}
              position="bottom"
            >
              <Icon
                icon={"ph:user-switch"}
                onClick={toggleMenuType}
                className={`h-5 w-5 ${
                  activeMenuType === "admin"
                    ? "text-primary-500"
                    : "text-muted-400"
                } transition-colors duration-300 cursor-pointer`}
              />
            </AnimatedTooltip>
          )}
          <button
            onClick={() => setIsMobileSearchActive(true)}
            className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-all duration-300  md:hidden"
          >
            <Icon
              icon="lucide:search"
              className="h-5 w-5 text-muted-400 transition-colors duration-300"
            />
          </button>

          <div className="group relative text-start">
            <button
              className="mask mask-blob flex h-10 w-10 cursor-pointer items-center justify-center transition-all duration-300 text-muted-400 hover:text-primary-500 hover:bg-primary-500/10 dark:hover:bg-primary-500/20 rotate-0"
              onClick={() => setPanelOpen("locales", true)}
            >
              <LocaleLogo />
            </button>
          </div>

          {isFetched && profile && (
            <>
              <div className="group relative text-start">
                {announcements && announcements.length > 0 && (
                  <span className="absolute end-0.5 top-0.5 z-[2] block h-2 w-2 rounded-full bg-primary-500 "></span>
                )}
                <button
                  className="mask mask-blob flex h-10 w-10 cursor-pointer items-center justify-center transition-all duration-300 text-muted-400 hover:text-primary-500 hover:bg-primary-500/10 dark:hover:bg-primary-500/20 rotate-0"
                  onClick={() => setPanelOpen("announcements", true)}
                >
                  <Icon
                    icon="ph:megaphone"
                    className="h-4 w-4 text-muted-500 transition-colors duration-300 group-hover:text-primary-500"
                  />
                </button>
              </div>

              <NotificationsDropdown />
            </>
          )}

          <ThemeSwitcher />

          <AccountDropdown />
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
