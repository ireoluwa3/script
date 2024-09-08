import React, { useState } from "react";
import useScroll from "@/hooks/useScroll";
import { Icon } from "@iconify/react";
import ThemeSwitcher from "@/components/widgets/ThemeSwitcher";
import { NotificationsDropdown } from "../../NotificationsDropdown";
import { AccountDropdown } from "../../AccountDropdown";
import { SearchResults } from "../../SearchResults";
import { useDashboardStore } from "@/stores/dashboard";
import { useTranslation } from "next-i18next";
import { cn } from "@/utils/cn";
import { AppNavbarProps } from "./AppNavbar.types";

const HEIGHT = 60;

const AppNavbarBase = ({
  fullwidth = false,
  horizontal = false,
  nopush = false,
  sideblock = false,
  collapse = false,
}: AppNavbarProps) => {
  const { t } = useTranslation();
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const scrolled = useScroll(HEIGHT);
  const {
    sidebarOpened,
    setPanelOpen,
    setIsSidebarOpenedMobile,
    setSidebarOpened,
    isSidebarOpenedMobile,
    profile,
    isFetched,
    announcements,
  } = useDashboardStore();

  function showSidebar() {
    setIsSidebarOpenedMobile(true);
    setSidebarOpened(true);
  }

  const containerClasses = cn(
    "fixed start-0 top-0 z-10 w-full transition-all duration-300",
    {
      "lg:ms-[64px] lg:w-[calc(100%-64px)]": collapse && !sideblock,
      "lg:ms-20 lg:w-[calc(100%-64px)]": !collapse && !sideblock,
      active: scrolled && sideblock,
      "z-10": scrolled && !sideblock,
      "lg:ms-[280px] lg:w-[calc(100%-280px)] xl:px-10":
        sideblock && sidebarOpened,
      "translate-x-[250px]": sidebarOpened && !nopush && !sideblock,
    }
  );

  const innerContainerClasses = cn("relative mx-auto w-full px-4 lg:px-10", {
    "max-w-full": fullwidth,
    "max-w-7xl": !fullwidth,
    "xl:px-10": horizontal,
    "xl:px-0": !horizontal,
  });

  const navbarClasses = cn(
    "relative z-[1] flex h-[60px] w-full items-center justify-between rounded-2xl transition-all duration-300",
    {
      border: !sideblock || (sideblock && scrolled),
      "mt-4 border-muted-200 bg-white px-4 shadow-lg shadow-muted-300/30 dark:border-muted-800 dark:bg-muted-950 dark:shadow-muted-800/30":
        scrolled,
      "border-transparent": !scrolled && !sideblock,
    }
  );

  const searchContainerClasses = cn(
    "flex-grow-[2] items-center md:max-w-[680px]",
    {
      hidden: isMobileSearchActive,
      flex: !isMobileSearchActive,
    }
  );

  const sidebarButtonClasses = cn(
    "relative me-4 inline-block h-[1em] w-[1em] cursor-pointer text-[1.28rem]",
    {
      "is-open": !sideblock && sidebarOpened,
      "before:absolute before:start-[0.125em] before:top-1/2 before:-mt-[0.225em] before:hidden before:h-[0.05em] before:w-[.35em] before:bg-muted-400 before:content-[''] after:absolute after:start-[0.125em] after:top-1/2 after:mt-[0.225em] after:hidden after:h-[0.05em] after:w-[.75em] after:bg-muted-400 after:content-[''] [&>*]:pointer-events-none":
        true,
    }
  );

  const searchInputClasses = cn(
    "peer relative inline-flex h-10 w-full max-w-full items-center justify-start rounded-lg border border-muted-200 bg-white py-2 pe-3 ps-10 font-sans text-base leading-snug text-muted-600 outline-none outline-0 outline-offset-0 outline-current transition-all duration-300 placeholder:text-muted-300 focus-visible:shadow-lg focus-visible:shadow-muted-300/30 dark:border-muted-800 dark:bg-muted-950 dark:text-muted-300 dark:placeholder:text-muted-700 dark:focus-visible:shadow-muted-800/30",
    {
      "psaceholder:text-muted-300": !sideblock,
    }
  );

  const searchIconClasses =
    "absolute start-0 top-0 z-[1] flex h-10 w-10 items-center justify-center text-muted-400 transition-colors duration-300 dark:text-muted-500 peer-checked:[&>svg]:text-primary-500 peer-focus:[&>svg]:stroke-primary-500 peer-focus:[&>svg]:text-primary-500";

  const mobileSearchContainerClasses = cn("w-full", {
    "flex md:hidden": isMobileSearchActive,
    hidden: !isMobileSearchActive,
  });

  return (
    <div className={containerClasses}>
      <div className={innerContainerClasses}>
        <div className={navbarClasses}>
          <div className={searchContainerClasses}>
            <div
              className={cn(
                sideblock
                  ? `h-10 items-center justify-center ps-2 ${
                      sidebarOpened ? "lg:hidden" : "flex"
                    }`
                  : "flex lg:hidden ps-2"
              )}
            >
              <button
                type="button"
                name="sidebarToggle"
                onClick={
                  sideblock
                    ? showSidebar
                    : () => setIsSidebarOpenedMobile(!isSidebarOpenedMobile)
                }
                className={sidebarButtonClasses}
                aria-label="Toggle Sidebar"
              >
                <span className="absolute start-[0.125em] top-1/2 mt-[.025em] block h-[0.05em] w-[.75em] bg-muted-400 transition-all duration-[250ms] ease-in-out before:absolute before:start-0 before:top-0 before:block before:h-[.05em] before:w-[.75em] before:-translate-y-[.25em] before:bg-muted-400 before:content-[''] after:absolute after:start-0 after:top-0 after:block after:h-[.05em] after:w-[.75em] after:translate-y-[.25em] after:bg-muted-400 after:content-['']"></span>
              </button>
            </div>

            <div className="w-full max-w-[380px] hidden md:block">
              <div className="relative text-base">
                <input
                  type="text"
                  className={searchInputClasses}
                  placeholder={t("Search our platform...")}
                  value={searchTerm}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setSearchTerm(event.currentTarget.value);
                  }}
                />

                <div className={searchIconClasses}>
                  <Icon
                    icon="lucide:search"
                    className="text-lg transition-colors duration-300"
                  />
                </div>

                <SearchResults searchTerm={searchTerm} id="mobile" />
              </div>
            </div>
          </div>
          <div
            className={cn("items-center gap-2", {
              hidden: isMobileSearchActive,
              flex: !isMobileSearchActive,
            })}
          >
            <button
              type="button"
              name="mobileSearch"
              aria-label="Search"
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
                type="button"
                name="locales"
                aria-label="Locales"
                className="mask mask-blob flex h-10 w-10 cursor-pointer items-center justify-center transition-all duration-300 text-muted-400 hover:text-primary-500 hover:bg-primary-500/10 dark:hover:bg-primary-500/20 rotate-0"
                onClick={() => setPanelOpen("locales", true)}
              >
                <Icon
                  icon="iconoir:language"
                  className="h-4 w-4 text-muted-500 transition-colors duration-300 group-hover:text-primary-500"
                />
              </button>
            </div>

            {isFetched && profile && (
              <>
                <div className="group relative text-start">
                  {announcements && announcements.length > 0 && (
                    <span className="absolute end-0.5 top-0.5 z-[2] block h-2 w-2 rounded-full bg-primary-500 "></span>
                  )}
                  <button
                    type="button"
                    aria-label="Announcements"
                    name="announcements"
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

          <div className={mobileSearchContainerClasses}>
            <div className="w-full">
              <div className="relative text-base">
                <input
                  type="text"
                  value={searchTerm}
                  placeholder={`${t("Search")}...`}
                  className="peer relative inline-flex h-10 w-full max-w-full items-center justify-start rounded-lg border border-muted-200 bg-white py-2 pe-3 ps-10 text-base leading-tight text-muted-500 outline-none outline-0 outline-offset-0 outline-current transition-all duration-300 placeholder:text-muted-300 focus-visible:shadow-lg focus-visible:shadow-muted-300/30 dark:border-muted-800 dark:bg-muted-950 dark:text-muted-300 placeholder:dark:text-muted-700 dark:focus-visible:shadow-muted-800/30"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setSearchTerm(event.currentTarget.value);
                  }}
                  aria-label="Search"
                />

                <div className="absolute start-0 top-0 z-[1] flex h-10 w-10 items-center justify-center transition-colors duration-300">
                  <Icon
                    icon="lucide:search"
                    className="h-4 w-4 text-muted-400 transition-colors duration-300"
                  />
                </div>

                <button
                  type="button"
                  aria-label="Close Search"
                  name="closeMobileSearch"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export const AppNavbar = AppNavbarBase;
