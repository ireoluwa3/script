import { useTranslation } from "next-i18next";
import React, { useState, type FC } from "react";
import useScroll from "@/hooks/useScroll";
import { Icon } from "@iconify/react";
import ThemeSwitcher from "@/components/widgets/ThemeSwitcher";
import { breakpoints } from "@/utils/breakpoints";
import MediaQuery from "react-responsive";
import { useDashboardStore } from "@/stores/dashboard";
import { SearchResults } from "../shared/SearchResults";
import { NotificationsDropdown } from "../shared/NotificationsDropdown";
import { AccountDropdown } from "../shared/AccountDropdown";

interface AppNavbarProps {
  fullwidth?: boolean;
  horizontal?: boolean;
}

const HEIGHT = 36;

const AppNavbar: FC<AppNavbarProps> = ({
  fullwidth = false,
  horizontal = false,
}) => {
  const { t } = useTranslation();
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const scrolled = useScroll(HEIGHT);
  const { setPanelOpen, profile, isFetched } = useDashboardStore();

  return (
    <div
      className={`fixed start-0 top-[56px] z-10 w-full transition-all duration-300`}
    >
      <div
        className={`relative mx-auto w-full px-4 lg:px-10
          ${fullwidth ? "max-w-full" : "mx-auto max-w-7xl"}
          ${horizontal ? "xl:px-10" : "xl:px-0"}
        `}
      >
        <div
          className={`relative z-[1] flex h-[40px] w-full items-center justify-end rounded-2xl border transition-all duration-300 ${
            scrolled
              ? "-mt-12 border-muted-200 bg-white px-2 shadow-lg shadow-muted-300/30 dark:border-muted-800 dark:bg-muted-900 dark:shadow-muted-800/30"
              : "border-transparent dark:border-transparent px-2"
          }`}
        >
          <MediaQuery minWidth={parseInt(breakpoints.md)}>
            <div
              className={`flex-grow-[2] items-center md:max-w-[680px] ${
                isMobileSearchActive ? "hidden" : "flex "
              }`}
            >
              <div className="hidden w-full max-w-[380px]">
                <div className="relative text-base">
                  <input
                    type="text"
                    className="peer relative inline-flex h-10 w-full max-w-full items-center justify-start rounded-lg border border-muted-200 bg-white py-2 pe-3 ps-10 font-sans text-base leading-snug text-muted-600 outline-none outline-0 outline-offset-0 outline-current transition-all duration-300 placeholder:text-muted-300 focus-visible:shadow-lg focus-visible:shadow-muted-300/30 dark:border-muted-800 dark:bg-muted-900 dark:text-muted-300 placeholder:dark:text-muted-700 dark:focus-visible:shadow-muted-800/30"
                    placeholder={t("Search our platform...")}
                    value={searchTerm}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setSearchTerm(event.currentTarget.value);
                    }}
                  />

                  <div className="absolute start-0 top-0 z-[1] flex h-10 w-10 items-center justify-center text-muted-400 transition-colors duration-300 dark:text-muted-500 peer-checked:[&>svg]:text-primary-500 peer-focus:[&>svg]:stroke-primary-500 peer-focus:[&>svg]:text-primary-500 ">
                    <Icon
                      icon="lucide:search"
                      className="text-lg transition-colors duration-300"
                    />
                  </div>

                  <SearchResults searchTerm={searchTerm} id="mobile" />
                </div>
              </div>
            </div>
          </MediaQuery>
          <div
            className={`items-center gap-2 ${
              isMobileSearchActive ? "hidden" : "flex"
            }`}
          >
            <MediaQuery maxWidth={parseInt(breakpoints.md)}>
              <button
                onClick={() => setIsMobileSearchActive(true)}
                className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-all duration-300"
              >
                <Icon
                  icon="lucide:search"
                  className="h-5 w-5 text-muted-400 transition-colors duration-300"
                />
              </button>
            </MediaQuery>

            <div className="group relative text-start">
              <button
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
                  <span className="absolute end-0.5 top-0.5 z-[2] block h-2 w-2 rounded-full bg-primary-500 "></span>
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

          <MediaQuery maxWidth={parseInt(breakpoints.md)}>
            <div
              className={`w-full ${isMobileSearchActive ? "flex" : "hidden"}`}
            >
              <div className="w-full">
                <div className="relative text-base">
                  <input
                    type="text"
                    value={searchTerm}
                    placeholder={t("Search...")}
                    className="peer relative inline-flex h-10 w-full max-w-full items-center justify-start rounded-lg border border-muted-200 bg-white py-2 pe-3 ps-10 text-base leading-tight text-muted-500 outline-none outline-0 outline-offset-0 outline-current transition-all duration-300 placeholder:text-muted-300 focus-visible:shadow-lg focus-visible:shadow-muted-300/30 dark:border-muted-800 dark:bg-muted-900 dark:text-muted-300 placeholder:dark:text-muted-700 dark:focus-visible:shadow-muted-800/30"
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
            </div>
          </MediaQuery>
        </div>
      </div>
    </div>
  );
};

export default AppNavbar;
