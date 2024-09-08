import React, { type FC } from "react";
import { Icon } from "@iconify/react";
import { usePagination, DOTS } from "@/hooks/usePagination";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { useTranslation } from "next-i18next";
interface PaginationProps {
  onPageChange: (page: number) => void;
  totalCount: number;
  siblingCount?: number;
  currentPage: number;
  pageSize: number;
  buttonSize?: "sm" | "md" | "lg";
  buttonShape?: "straight" | "rounded" | "smooth" | "curved" | "full";
}
const Pagination: FC<PaginationProps> = ({
  onPageChange,
  totalCount,
  siblingCount = 0,
  currentPage,
  pageSize,
  buttonSize = "md",
  buttonShape = "smooth",
}) => {
  const { t } = useTranslation();
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });
  // If there are less than 2 times in pagination range we shall not render the component
  if (
    currentPage === 0 ||
    (paginationRange !== undefined && paginationRange.length < 2)
  ) {
    return (
      <div className="flex justify-center gap-1 text-sm font-medium px-4 text-gray-500 dark:text-gray-400">
        <span>
          {t("Showing all records")} ({totalCount})
        </span>
      </div>
    );
  }
  const onNext = () => {
    onPageChange(currentPage + 1);
  };
  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };
  const lastPage =
    paginationRange !== undefined
      ? paginationRange[paginationRange.length - 1]
      : 0;
  return (
    <ul className="flex justify-center gap-1 text-sm font-medium">
      {/* Left navigation arrow */}
      <li>
        <IconButton
          type="button"
          className="rtl:rotate-180"
          size={buttonSize}
          shape={buttonShape}
          disabled={currentPage === 1}
          onClick={onPrevious}
        >
          <span className="sr-only">{t("Prev Page")}</span>
          <Icon icon="lucide:arrow-left" className="h-4 w-4 scale-95" />
        </IconButton>
      </li>
      {paginationRange?.map((pageNumber: any, index) => {
        // If the pageItem is a DOT, render the DOTS unicode character
        if (pageNumber === DOTS) {
          return (
            <li key={index} className="pagination-item dots">
              <IconButton type="button" size={buttonSize} shape={buttonShape}>
                <Icon icon="lucide:more-horizontal" className="h-4 w-4" />
              </IconButton>
            </li>
          );
        }
        // Render our Page Pills
        return (
          <li key={index}>
            <IconButton
              type="button"
              size={buttonSize}
              shape={buttonShape}
              color={pageNumber === currentPage ? "primary" : "default"}
              onClick={() => onPageChange(pageNumber)}
            >
              <span>{pageNumber}</span>
            </IconButton>
          </li>
        );
      })}
      {/*  Right Navigation arrow */}
      <li>
        <IconButton
          type="button"
          className="rtl:rotate-180"
          size={buttonSize}
          shape={buttonShape}
          disabled={currentPage === lastPage}
          onClick={onNext}
        >
          <span className="sr-only">{t("Prev Page")}</span>
          <Icon icon="lucide:arrow-right" className="h-4 w-4 scale-95" />
        </IconButton>
      </li>
    </ul>
  );
};
export default Pagination;
