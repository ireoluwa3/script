import React, { useMemo } from "react";
import { useDataTable } from "@/stores/datatable";
import { Icon } from "@iconify/react";
import { AnimatedTooltip } from "../../tooltips/AnimatedTooltip";
import { useTranslation } from "next-i18next";
const HeadCell = ({
  label,
  sortField,
  tooltip,
  isOperatorOpen,
  setIsOperatorOpen,
  options,
  filterable = true,
}) => {
  const { t } = useTranslation();
  if (!label) {
    throw new Error(t("label prop is required!"));
  }
  const { sort, setSort, filter, filterOperator } = useDataTable(
    (state) => state
  );
  const isSorted = useMemo(
    () => sort.field === sortField,
    [sort.field, sortField]
  );
  const handleSort = (rule) => {
    setSort({ field: sortField, rule });
  };
  const handleKeyPress = (event, rule) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSort(rule);
    }
  };
  const filterLabel = useMemo(() => {
    if (filter[sortField]) {
      return (
        filterOperator[sortField]?.label || (options && t(options[0].label))
      );
    }
    return null;
  }, [filter, filterOperator, options, sortField, t]);
  return (
    <div className="flex items-center justify-between gap-4 font-sans h-[40px]">
      {tooltip && filterable ? (
        <AnimatedTooltip content={t(tooltip)}>
          <span className="text-xs font-medium uppercase text-muted">
            {t(label)}
          </span>
        </AnimatedTooltip>
      ) : (
        <span className="text-xs font-medium uppercase text-muted">
          {t(label)}
        </span>
      )}
      <div className="flex flex-row items-center justify-center gap-2">
        {filterable && setIsOperatorOpen && !isOperatorOpen && (
          <AnimatedTooltip content={t("Filter by")}>
            <span
              className="flex cursor-pointer items-center justify-center gap-1"
              onClick={() => setIsOperatorOpen(!isOperatorOpen)}
            >
              {filter[sortField] && (
                <span className="text-xs font-medium text-muted">
                  (
                  <span className="text-primary-500 dark:text-primary-400">
                    {filterLabel}
                  </span>
                  )
                </span>
              )}
              <Icon
                icon={filter[sortField] ? "mdi:filter" : "mdi:filter-outline"}
                className={`h-4 w-4 ${
                  filter[sortField]
                    ? "text-primary-500 dark:text-primary-400"
                    : "text-muted"
                }`}
              />
            </span>
          </AnimatedTooltip>
        )}
        <div className="flex flex-col">
          <svg
            onClick={() => handleSort("asc")}
            onKeyDown={(event) => handleKeyPress(event, "asc")}
            fill="none"
            role="button"
            tabIndex={0}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className={`h-2.5 w-2.5 cursor-pointer fill-none ${
              sort.rule === "asc" && isSorted
                ? "text-primary-500"
                : "text-muted-400"
            }`}
          >
            <path d="M5 15l7-7 7 7" />
          </svg>
          <svg
            onClick={() => handleSort("desc")}
            onKeyDown={(event) => handleKeyPress(event, "desc")}
            fill="none"
            role="button"
            tabIndex={0}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className={`h-2.5 w-2.5 cursor-pointer fill-none ${
              sort.rule === "desc" && isSorted
                ? "text-primary-500"
                : "text-muted-400"
            }`}
          >
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};
export default HeadCell;
