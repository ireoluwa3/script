import { SearchResultsProps } from "./SearchResults.types";
import React from "react";
import { Icon } from "@iconify/react";
import useSearch from "@/hooks/useSearch";
import { MashImage } from "@/components/elements/MashImage";
import { useTranslation } from "next-i18next";

const SearchResultsBase = ({ searchTerm, id }: SearchResultsProps) => {
  const { t } = useTranslation();
  const { data: searchResults } = useSearch(searchTerm);
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  const handleMenuClick = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const renderResultIcon = (result: any) => {
    if (result.photoUrl && !result.icon) {
      return (
        <MashImage
          className={
            result.type === "user" ? "mask mask-blob" : "mask mask-hex"
          }
          height={38}
          width={38}
          src={result.photoUrl as string}
          alt=""
        />
      );
    }

    const iconClass =
      "mask mask-blob flex h-9 w-9 items-center justify-center bg-primary-500/10 text-xs font-bold text-primary-500 dark:bg-primary-500/20";

    if (result.icon && !result.photoUrl) {
      return (
        <div className={iconClass}>
          <Icon icon={result.icon} className="h-4 w-4" />
        </div>
      );
    }

    return (
      <div className={iconClass}>
        <span>{result.title?.charAt(0)}</span>
      </div>
    );
  };

  const renderSubMenu = (result: any, i: number) => (
    <div className="bg-muted-50 dark:bg-muted-900 rounded-b-lg border-b border-x border-muted-200 dark:border-muted-800 ml-4">
      {result.subMenu.map((sub: any, j: number) => (
        <a
          key={j}
          href={sub.href}
          className={`group flex items-center gap-2 p-2 transition-all duration-300 hover:bg-muted-150 dark:hover:bg-muted-850 ${
            j === result.subMenu.length - 1
              ? "rounded-b-lg"
              : "border-b border-muted-200 dark:border-muted-700"
          }`}
        >
          {sub.icon && (
            <div className="mask mask-blob flex h-9 w-9 items-center justify-center bg-primary-500/10 text-xs font-bold text-primary-500 dark:bg-primary-500/20">
              <Icon icon={sub.icon} className="h-4 w-4" />
            </div>
          )}
          <div className="font-sans">
            <span className="block text-sm font-medium leading-tight text-muted-800 dark:text-muted-100">
              {sub.title}
            </span>
          </div>
          <div className="me-2 ms-auto">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Icon
                icon="lucide:arrow-right"
                className="h-3 w-3 -translate-x-1 text-primary-500 transition-transform duration-300 group-hover:translate-x-0"
              />
            </div>
          </div>
        </a>
      ))}
    </div>
  );

  const renderResults = () =>
    searchResults.map((result: any, i: number) => (
      <div key={i}>
        <a
          href={result.href}
          className={`group flex items-center gap-2 p-2 transition-all duration-100 hover:bg-muted-100 dark:hover:bg-muted-850 ${
            activeIndex === i
              ? "bg-muted-100 dark:bg-muted-950 rounded-t-lg rounded-bl-lg border-t border-x border-muted-200 dark:border-muted-700"
              : "rounded-lg"
          }`}
          onClick={(e) => {
            if (result.subMenu) {
              e.preventDefault();
              handleMenuClick(i);
            }
          }}
        >
          {renderResultIcon(result)}
          <div className="font-sans">
            <span className="block text-sm font-medium leading-tight text-muted-800 dark:text-muted-100">
              {result.title}
            </span>
            <span className="block text-xs leading-tight text-muted-400">
              {result.content}
            </span>
          </div>
          <div className="me-2 ms-auto">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full bg-primary-500/10 transition-opacity duration-300 group-hover:opacity-100 ${
                result.subMenu ? "" : "opacity-0"
              }`}
            >
              <Icon
                icon={
                  result.subMenu ? "lucide:chevron-down" : "lucide:arrow-right"
                }
                className={`h-3 w-3 text-primary-500 transition-transform duration-300 ${
                  activeIndex === i ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
        </a>
        {result.subMenu && activeIndex === i && renderSubMenu(result, i)}
      </div>
    ));

  return (
    <div
      id={`${id}-static-results`}
      className={`slimscroll absolute start-0 top-12 z-[5] max-h-[285px] w-full overflow-y-auto rounded-lg border border-muted-200 bg-white p-2 shadow-lg shadow-muted-300/30 transition-all duration-300 dark:border-muted-800 dark:bg-muted-900 dark:shadow-muted-800/30 ${
        searchTerm.length > 0
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-[5px] opacity-0"
      }`}
    >
      {searchResults.length > 0 ? (
        renderResults()
      ) : (
        <div className="flex min-h-[255px] items-center justify-center px-8">
          <div className="text-center font-sans">
            <Icon
              icon="ph:robot-duotone"
              className="mx-auto mb-2 h-12 w-12 text-muted-400"
            />
            <h3 className="font-medium text-muted-800 dark:text-muted-100">
              {t("No Matching Results")}
            </h3>
            <p className="mx-auto max-w-[420px] text-sm text-muted-400">
              {t(
                "Sorry, we couldn't find any matching records. Please try different search terms."
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export const SearchResults = SearchResultsBase;
