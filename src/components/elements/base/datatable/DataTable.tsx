"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { NoItemsFound } from "@/components/elements/base/datatable/NoItemsFound";
import { Row } from "@/components/elements/base/datatable/Row";
import { LoadingRow } from "@/components/elements/base/datatable/LoadingRow";
import { Head } from "./Head";
import { FormModal } from "./FormModal";
import Pagination from "../pagination/Pagination";
import Select from "../../form/select/Select";
import { BulkSelectionMessage } from "./BulkSelectionMessage";
import { AnimatePresence, motion } from "framer-motion";
import { useDataTable } from "@/stores/datatable";
import { ConfirmationModal } from "./ConfirmationModal";
import { NavActions } from "./NavActions";
import { View } from "./View";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import { useRouter } from "next/router";
import { capitalize } from "lodash";
import IconBox from "../iconbox/IconBox";
import { AnimatedTooltip } from "../tooltips/AnimatedTooltip";
import IconButton from "../button-icon/IconButton";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
const DataTableBase = ({
  title,
  endpoint,
  columnConfig = [],
  postTitle = "Manage",
  hasBreadcrumb = true,
  hasRotatingBackButton = true,
  hasStructure = true,
  isCrud = true,
  isParanoid = true,
  canView = true,
  canCreate = true,
  canImport = false,
  canEdit = true,
  canDelete = true,
  hasAnalytics = false,
  hasTitle = true,
  onlySingleActiveStatus = false,
  fixedPagination = false,
  paginationLocation = "floating",
  size = "sm",
  shape = "rounded-lg",
  navActionsSlot,
  navActionsConfig,
  dropdownActionsSlot,
  dropdownActionsConfig,
  formSize,
  viewPath,
  editPath,
  blank,
  navSlot,
}: DataTableProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const currentPath = useRef(router.asPath.split("?")[0]);
  const [isHovered, setIsHovered] = useState(false);
  const {
    items,
    selectedItems,
    isLoading,
    pagination,
    setDataTableProps,
    setPagination,
    actionConfigs,
    activeModal,
    modalAction,
    viewItem,
    showDeletedAction,
    setFilters,
    fetchData,
    clearFilters,
    clearDataTableProps,
    setParams,
  } = useDataTable((state) => state);
  const allowedKeys = useMemo(() => {
    return columnConfig.reduce((acc, column) => {
      acc.push(column.sortName || column.field);
      return acc;
    }, [] as string[]);
  }, [columnConfig]);
  const filterParams = useMemo(() => {
    const params = {};
    Object.keys(router.query).forEach((key) => {
      if (allowedKeys.includes(key)) {
        params[key] = router.query[key];
      }
    });
    return params;
  }, [router.query, allowedKeys]);
  const otherParams = useMemo(() => {
    const params = {};
    Object.keys(router.query).forEach((key) => {
      if (!allowedKeys.includes(key)) {
        params[key] = router.query[key];
      }
    });
    return params;
  }, [router.query, allowedKeys]);
  useEffect(() => {
    setDataTableProps({
      title,
      endpoint,
      hasStructure,
      isCrud,
      isParanoid,
      canView,
      canCreate,
      canImport,
      canEdit,
      canDelete,
      columnConfig,
      formSize,
      navActionsConfig: navActionsConfig as NavActionsConfig[],
      dropdownActionsConfig: dropdownActionsConfig as DropdownActionsConfig[],
      onlySingleActiveStatus,
    });
  }, []);
  useEffect(() => {
    if (router.isReady) {
      // Apply the filtered parameters as filters
      if (Object.keys(filterParams).length > 0) {
        setFilters(filterParams);
      }
      // Handle other parameters not included in the columnConfig
      if (Object.keys(otherParams).length > 0) {
        setParams(otherParams);
      }
      fetchData();
    }
  }, [router.isReady]);
  useEffect(() => {
    const handleRouteChangeStart = (url) => {
      const newPathname = new URL(url, window.location.href).pathname;
      if (newPathname !== currentPath.current) {
        setParams({});
        clearDataTableProps();
        clearFilters();
      }
    };
    const handleRouteChangeComplete = (url) => {
      currentPath.current = new URL(url, window.location.href).pathname;
    };
    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, []);
  const breadcrumbItems = hasBreadcrumb
    ? currentPath.current
        .split("/")
        .filter((item) => item !== "")
        .map((item) => ({
          title: capitalize(item.replace(/-/g, " ").replace(/#/g, "")),
        }))
    : [];
  const tableRef = useRef<HTMLTableElement>(null);
  const [tableWidth, setTableWidth] = useState<number | null>(null);
  const [dynamicColumnWidths, setDynamicColumnWidths] = useState<
    { width: number; minWidth: string }[]
  >([]);

  const measureTableWidth = useCallback(() => {
    if (tableRef.current) {
      const multiSelectWidth = canDelete ? 41.6 : 0;
      const actionsWidth =
        !!actionConfigs.dropdownActionsConfig || !!dropdownActionsSlot ? 64 : 0;
      const switchColumns = columnConfig.filter(
        (col) => col.type === "switch"
      ).length;
      const switchWidth = switchColumns * 64;
      const selectColumns = columnConfig.filter(
        (col) => col.type === "select"
      ).length;
      const selectWidth = selectColumns * 128;
      const dynamicColumns = columnConfig.filter(
        (col) => ["switch", "select"].includes(col.type) === false
      ).length;
      const totalFixedWidth =
        multiSelectWidth + actionsWidth + switchWidth + selectWidth;

      // Calculate dynamic widths considering the text width
      let dynamicColumnWidth: number | "auto" = "auto";
      if (tableWidth && dynamicColumns > 0) {
        const availableWidth = Number(tableWidth) - totalFixedWidth;
        dynamicColumnWidth = availableWidth / dynamicColumns;
      }

      // Measure text width
      const textWidths = columnConfig.map((col) => {
        const textElement = document.createElement("span");
        textElement.style.visibility = "hidden";
        textElement.style.whiteSpace = "nowrap";
        textElement.innerText = col.label || "";
        document.body.appendChild(textElement);
        const textWidth = textElement.offsetWidth;
        document.body.removeChild(textElement);
        return textWidth;
      });

      // Set the column widths considering the text width
      const adjustedColumnWidths = columnConfig.map((col, index) => {
        const minWidth = ["switch", "select"].includes(col.type)
          ? "80px"
          : "auto";
        const width =
          dynamicColumnWidth !== "auto"
            ? Math.max(dynamicColumnWidth, textWidths[index])
            : textWidths[index];
        return { width, minWidth };
      });

      setDynamicColumnWidths(adjustedColumnWidths);
      setTableWidth(tableRef.current.offsetWidth);
    }
  }, [
    canDelete,
    actionConfigs.dropdownActionsConfig,
    dropdownActionsSlot,
    columnConfig,
    tableWidth,
  ]);

  useEffect(() => {
    measureTableWidth();
  }, [measureTableWidth]);

  useEffect(() => {
    measureTableWidth();
  }, [measureTableWidth]);

  useEffect(() => {
    measureTableWidth();
  }, [measureTableWidth]);

  const basePathWithoutQuery = router.asPath.split("?")[0];
  const analysisPath = `${basePathWithoutQuery}/analysis`.replace("//", "/");
  const hasActions =
    !!actionConfigs.dropdownActionsConfig ||
    !!dropdownActionsSlot ||
    (isCrud && (canDelete || canEdit || canView));
  return (
    <div id="datatable" className="relative h-full">
      <AnimatePresence>
        {selectedItems.length > 0 && canDelete && isCrud && (
          <BulkSelectionMessage key="bulk-selection-message" />
        )}
      </AnimatePresence>
      {hasTitle && (
        <div
          className={`mb-2 ${
            hasBreadcrumb && "min-h-16"
          } py-2 gap-5 flex items-start justify-center md:justify-between w-full rounded-lg flex-col md:flex-row`}
        >
          <div className="flex items-center gap-4">
            {hasRotatingBackButton && (
              <IconBox
                icon={
                  isHovered
                    ? "heroicons-solid:chevron-left"
                    : "material-symbols-light:app-badging-outline"
                }
                color="muted"
                variant={"pastel"}
                shape={"rounded"}
                size={"md"}
                rotating={!isHovered}
                onMouseOver={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="cursor-pointer duration-300 hover:bg-black/10 hover:text-black dark:hover:bg-white/20 hover:shadow-inner"
                onClick={() => router.back()}
              />
            )}
            <h2 className="font-sans text-lg font-light uppercase tracking-wide text-muted-700 dark:text-muted-300">
              {t(postTitle)} {t(title)}
              {hasBreadcrumb && (
                <Breadcrumb separator="slash" items={breadcrumbItems} />
              )}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {navSlot}
            <NavActions navActionsSlot={navActionsSlot} />
            {hasAnalytics && (
              <AnimatedTooltip content={t("Analytics")}>
                <Link href={analysisPath}>
                  <IconButton
                    variant="pastel"
                    aria-label={t("Analytics")}
                    color="primary"
                    size={"lg"}
                  >
                    <Icon
                      icon="solar:chart-2-bold-duotone"
                      className="h-6 w-6"
                    />
                  </IconButton>
                </Link>
              </AnimatedTooltip>
            )}
          </div>
        </div>
      )}

      <div
        className={`flex w-full flex-col overflow-x-auto lg:overflow-x-visible ltablet:overflow-x-visible ${
          shape !== "straight" &&
          `border border-muted-200 dark:border-muted-800 ${shape}`
        }`}
      >
        <table
          ref={tableRef}
          className={`border border-muted-200 bg-white font-sans dark:border-muted-800 dark:bg-muted-900 ${
            shape !== "straight" && "table-rounded"
          }`}
        >
          <thead className="border-b border-fade-grey-2 dark:border-muted-800">
            <Head
              columnConfig={columnConfig}
              hasActions={hasActions}
              canDelete={isCrud && canDelete}
              dynamicColumnWidths={dynamicColumnWidths}
            />
          </thead>
          <tbody className={`text-${size}`}>
            {isLoading ? (
              <LoadingRow
                columnConfig={columnConfig}
                canDelete={canDelete}
                isCrud={isCrud}
                hasActions={hasActions}
              />
            ) : items?.length > 0 ? (
              items.map((item, index) => (
                <Row
                  key={index}
                  item={item}
                  columnConfig={columnConfig}
                  dropdownActionsSlot={dropdownActionsSlot}
                  canDelete={isCrud && canDelete}
                  isParanoid={isParanoid}
                  hasActions={hasActions}
                  viewPath={viewPath}
                  editPath={editPath}
                  blank={blank}
                />
              ))
            ) : (
              <NoItemsFound
                cols={
                  columnConfig.length +
                  (canDelete ? 1 : 0) +
                  (hasActions ? 1 : 0)
                }
              />
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedItems.length === 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={
              paginationLocation === "floating"
                ? "w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] fixed bottom-10 left-[5%] sm:left-[10%] md:left-[15%] lg:left-[20%] flex gap-4 items-start"
                : `${
                    fixedPagination && "absolute bottom-0"
                  } w-full flex gap-4 items-start ${
                    shape !== "straight" && "pt-5"
                  }`
            }
          >
            {showDeletedAction && (
              <div
                className={`"min-64 w-64 justify-between p-2 ${
                  shape !== "straight" && shape
                } bg-muted-50 dark:bg-muted-950 border border-muted-200 dark:border-muted-800`}
              >
                <NavActions navAction={showDeletedAction} />
              </div>
            )}
            <div
              className={`w-full flex flex-col md:flex-row md:items-center justify-between gap-4 p-2 ${
                shape !== "straight" &&
                `border border-muted-200 dark:border-muted-800 ${shape}`
              } bg-muted-50 ${
                paginationLocation === "floating"
                  ? "dark:bg-muted-950"
                  : "dark:bg-muted-900"
              }`}
            >
              <div className="w-full md:w-auto md:max-w-[164px]">
                <Select
                  color="contrast"
                  name="pageSize"
                  value={pagination.perPage}
                  aria-label={t("Items per page")}
                  options={[
                    {
                      value: "5",
                      label: `5 ${t("per page")}`,
                    },
                    {
                      value: "10",
                      label: `10 ${t("per page")}`,
                    },
                    {
                      value: "15",
                      label: `15 ${t("per page")}`,
                    },
                    {
                      value: "20",
                      label: `20 ${t("per page")}`,
                    },
                  ]}
                  onChange={(e) =>
                    setPagination({
                      perPage: parseInt(e.target.value),
                      currentPage: 1,
                    })
                  }
                />
              </div>
              <Pagination
                buttonSize={"md"}
                currentPage={pagination.currentPage}
                totalCount={pagination.totalItems}
                pageSize={pagination.perPage}
                onPageChange={(page) =>
                  pagination.currentPage !== page &&
                  setPagination({ currentPage: page })
                }
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isCrud && modalAction?.modalType === "confirmation" && (
        <ConfirmationModal />
      )}
      {isCrud && activeModal === "FormModal" && <FormModal />}
      {isCrud && viewItem && <View title={title} />}
    </div>
  );
};
export const DataTable = DataTableBase;
