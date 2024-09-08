import React, { memo, useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react";
import Input from "@/components/elements/form/input/Input";
import Select from "@/components/elements/form/select/Select";
import Pagination from "@/components/elements/base/pagination/Pagination";
import HeadCell from "@/components/pages/user/markets/HeadCell";
import { motion, AnimatePresence } from "framer-motion";
import IconButton from "../button-icon/IconButton";
import { AnimatedTooltip } from "../tooltips/AnimatedTooltip";
import { useTranslation } from "next-i18next";
type PaginationType = {
  totalItems: number;
  totalPages: number;
  perPage: number;
  currentPage: number;
  from: number;
  to: number;
};
type ObjectTableBaseProps = {
  title?: string;
  items: any[];
  setItems?: (items: any[]) => void;
  shape?: "straight" | "rounded";
  navSlot?: React.ReactNode;
  columnConfig: ColumnConfigType[];
  filterField?: string;
  size?: "xs" | "sm" | "md" | "lg";
  border?: boolean;
  initialPerPage?: number;
};
const ObjectTableBase: React.FC<ObjectTableBaseProps> = ({
  title = "",
  items,
  setItems,
  shape = "rounded-md",
  navSlot,
  columnConfig,
  filterField,
  size = "md",
  border = true,
  initialPerPage = 5,
}) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sorted, setSorted] = useState<{
    field: string;
    rule: "asc" | "desc";
  }>({ field: "", rule: "asc" });
  const [pagination, setPagination] = useState<PaginationType>({
    totalItems: 0,
    totalPages: 0,
    perPage: initialPerPage,
    currentPage: 1,
    from: 1,
    to: initialPerPage,
  });
  const startIndex = (currentPage - 1) * pagination.perPage;
  const endIndex = startIndex + pagination.perPage;
  const filteredItems =
    (items &&
      items.length > 0 &&
      items.filter((item) => {
        const filterLower = filter.toLowerCase();
        return columnConfig.some((col) => {
          const value = item[col.field]?.toString().toLowerCase() || "";
          return value.includes(filterLower);
        });
      })) ||
    [];

  const pageItems = filteredItems.slice(startIndex, endIndex) || [];

  const changePage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= pagination.totalPages) {
        setCurrentPage(page);
        const newFrom = (page - 1) * pagination.perPage + 1;
        const newTo = page * pagination.perPage;
        setPagination((p) => ({
          ...p,
          currentPage: page,
          from: newFrom,
          to: newTo,
        }));
      }
    },
    [pagination.totalPages, pagination.perPage]
  );
  const sort = (field: string, rule: "asc" | "desc") => {
    const copy = [...items];
    copy.sort((a, b) => {
      if (typeof a[field] === "string" && typeof b[field] === "string") {
        return rule === "asc"
          ? a[field].localeCompare(b[field])
          : b[field].localeCompare(a[field]);
      }
      if (Array.isArray(a[field]) && Array.isArray(b[field])) {
        return rule === "asc"
          ? a[field].length - b[field].length
          : b[field].length - a[field].length;
      }
      return rule === "asc" ? a[field] - b[field] : b[field] - a[field];
    });
    setItems?.(copy);
    setSorted({ field, rule });
  };
  useEffect(() => {
    setPagination((p) => ({
      ...p,
      totalItems: filteredItems.length,
      totalPages: Math.ceil(filteredItems.length / p.perPage),
    }));
  }, [items, filter, pagination.perPage, filteredItems.length]);
  useEffect(() => {
    const newFrom = (currentPage - 1) * pagination.perPage + 1;
    const newTo = currentPage * pagination.perPage;
    setPagination((p) => ({
      ...p,
      from: newFrom,
      to: newTo,
    }));
  }, [currentPage, pagination.perPage]);
  return (
    <div className="relative h-full">
      <div
        className={`flex items-center justify-between ${
          shape === "straight" && "px-4"
        } ${(title || navSlot || filterField) && "py-3"}`}
      >
        {title && (
          <h2 className="text-lg text-muted-800 dark:text-muted-200">
            {title}
          </h2>
        )}
        {(navSlot || filterField) && (
          <div className="flex items-center gap-4">
            {filterField && (
              <Input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                icon="lucide:search"
                color="contrast"
                placeholder={`Search ${title}`}
                className="max-w-xs"
              />
            )}
            {navSlot}
          </div>
        )}
      </div>

      <div
        className={`flex w-full flex-col overflow-x-auto lg:overflow-x-visible ltablet:overflow-x-visible ${
          shape !== "straight" && `rounded-lg`
        }`}
      >
        <table
          className={`bg-white font-sans dark:bg-muted-900 mb-16 ${
            shape !== "straight" && "table-rounded"
          } ${border && "border border-muted-200 dark:border-muted-800 "}`}
        >
          <thead className="border-b border-fade-grey-2 dark:border-muted-800">
            <tr className="divide-x divide-muted-200 dark:divide-muted-800">
              {columnConfig.map((col) => (
                <th key={col.field} className="p-4">
                  <HeadCell
                    label={col.label}
                    sortFn={sort}
                    sortField={col.field}
                    sorted={sorted}
                    sortable={col.sortable}
                  />
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {pageItems.map((item, i) => (
              <tr
                key={i}
                className={`text-${size} text-muted-800 dark:text-muted-200
                 border-b border-muted-200 transition-colors duration-300 last:border-none hover:bg-muted-200/40 dark:border-muted-800 dark:hover:bg-muted-950/60`}
              >
                {columnConfig.map((col) => (
                  <td key={col.field} className="px-4 py-3 align-middle">
                    {col.type === "actions"
                      ? col.actions?.map((action, index) => {
                          return !action.condition ||
                            !action.condition(item) ? (
                            <AnimatedTooltip
                              key={index}
                              content={action.tooltip}
                            >
                              <IconButton
                                key={index}
                                variant="pastel"
                                color={action.color}
                                onClick={() => action.onClick(item)}
                                loading={action.loading}
                                size={action.size}
                                disabled={action.disabled}
                              >
                                <Icon icon={action.icon} className="h-5 w-5" />
                              </IconButton>
                            </AnimatedTooltip>
                          ) : null;
                        })
                      : col.getValue
                      ? col.getValue(item)
                      : item[col.field]}
                  </td>
                ))}
              </tr>
            ))}
            {!pagination.totalItems && (
              <tr>
                <td colSpan={columnConfig.length} className="py-3 text-center">
                  <div className="py-32">
                    <Icon
                      icon="arcticons:samsung-finder"
                      className="mx-auto h-20 w-20 text-muted-400"
                    />
                    <h3 className="mb-2 font-sans text-xl text-muted-700 dark:text-muted-200">
                      {t("Nothing found")}
                    </h3>
                    <p className="mx-auto max-w-[280px] font-sans text-md text-muted-400">
                      {t(
                        "Sorry, looks like we couldn't find any matching records. Try different search terms."
                      )}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <AnimatePresence>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`absolute w-full flex gap-4 items-start ${
            shape === "straight" ? "bottom-0" : "-bottom-5"
          }`}
        >
          <div
            className={`w-full flex flex-col md:flex-row md:items-center justify-between gap-4 p-2 ${
              shape !== "straight" &&
              `border border-muted-200 dark:border-muted-800 rounded-lg`
            } bg-muted-50 dark:bg-muted-900`}
          >
            <div className="w-full md:w-auto md:max-w-[164px]">
              <Select
                color="contrast"
                name="pageSize"
                value={pagination.perPage}
                options={[
                  {
                    value: "5",
                    label: "5 per page",
                  },
                  {
                    value: "10",
                    label: "10 per page",
                  },
                  {
                    value: "15",
                    label: "15 per page",
                  },
                  {
                    value: "20",
                    label: "20 per page",
                  },
                ]}
                onChange={(e) =>
                  setPagination({
                    ...pagination,
                    perPage: parseInt(e.target.value, 10),
                  })
                }
              />
            </div>
            <Pagination
              buttonSize={"md"}
              currentPage={pagination.currentPage}
              totalCount={pagination.totalItems}
              pageSize={pagination.perPage}
              onPageChange={(page) => changePage(page)}
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
export const ObjectTable = memo(ObjectTableBase);
