import React, { memo, useCallback, useMemo, useState } from "react";
import { HeadProps } from "./Head.types";
import HeadCell from "./HeadCell";
import Input from "@/components/elements/form/input/Input";
import ToggleSwitch from "@/components/elements/form/toggle-switch/ToggleSwitch";
import { Icon } from "@iconify/react";
import Checkbox from "@/components/elements/form/checkbox/Checkbox";
import { useDataTable } from "@/stores/datatable";
import { AnimatedTooltip } from "../../tooltips/AnimatedTooltip";
import useEditState from "@/hooks/useEditState";
import { numberFilterOptions, stringFilterOptions } from "@/utils/datatable";
import ListBox from "@/components/elements/form/listbox/Listbox";
import { useTranslation } from "next-i18next";
const getFilterKey = (columnConfig, field) => {
  return columnConfig.find((col) => col.field === field)?.sortName || field;
};
const HeadBase = ({
  columnConfig,
  hasActions,
  canDelete,
  dynamicColumnWidths,
}: HeadProps) => {
  const { t } = useTranslation();
  const {
    filter,
    setFilter,
    selectAllItems,
    clearSelection,
    isAllSelected,
    filterOperator,
    isLoading,
  } = useDataTable((state) => ({
    ...state,
    isAllSelected:
      state.selectedItems.length === state.items.length &&
      state.items.length > 0,
  }));
  const { editState, enableEdit, handleEditChange, saveEdit, handleKeyPress } =
    useEditState(columnConfig, setFilter);
  const [isOperatorOpen, setIsOperatorOpen] = useState({});
  const renderEditInput = (column, value, onChange, onBlur, onKeyPress) => {
    switch (column.type) {
      case "text":
      case "tag":
      case "tags":
        return (
          <Input
            type="text"
            size="sm"
            icon="mdi:magnify"
            value={value ?? ""}
            onChange={onChange}
            onBlur={onBlur}
            onKeyPress={onKeyPress}
            autoFocus
            noPadding
          />
        );
      case "rating":
      case "number":
        return (
          <Input
            type="number"
            size="sm"
            icon="mdi:magnify"
            value={value ?? ""}
            onChange={onChange}
            onBlur={onBlur}
            onKeyPress={onKeyPress}
            autoFocus
            noPadding
          />
        );
      case "switch":
        return (
          <div className="flex items-center">
            <ToggleSwitch
              checked={value === "true"}
              onChange={onChange}
              color="success"
            />
            <AnimatedTooltip content={t("Clear filter")}>
              <Icon
                onClick={() => saveEdit(editState.field, undefined, true)}
                icon="ph:x"
                className="cursor-pointer text-red-500 dark:text-red-400 dark:hover:text-red-500 hover:text-red-600"
              />
            </AnimatedTooltip>
          </div>
        );
      case "select":
        return (
          <ListBox
            options={[{ value: "", label: t("All") }, ...column.options]}
            selected={
              column.options.find((option) => option.value === value) || {
                label: "",
                value: "",
              }
            }
            setSelected={(e) => {
              onChange({ target: { value: e.value } });
            }}
            onClose={onBlur}
            size="sm"
            loading={isLoading}
          />
        );
      default:
        return null;
    }
  };
  const handleFilterTypeChange = useCallback(
    (sortField, value) => {
      setFilter(sortField, filter[sortField], value);
    },
    [filter, setFilter]
  );

  const widthStyles = useMemo(() => {
    return columnConfig.reduce((acc, column, index) => {
      const isSwitch = column.type === "switch";
      const isSelect = column.type === "select";
      const width = dynamicColumnWidths[index]?.width || "auto";
      acc[column.field] = {
        width: typeof width === "number" ? `${width}px` : width,
        maxWidth: typeof width === "number" ? `${width}px` : width,
        minWidth: isSwitch || isSelect ? "80px" : "auto",
      };
      return acc;
    }, {} as Record<string, { width: string | number; maxWidth: string | number; minWidth: string }>);
  }, [columnConfig, dynamicColumnWidths]);

  const renderCellContent = useCallback(
    (column, currentFilterValue, isEditingThisField, filterKey) => {
      const { field, label, sortable, filterable, sortName, tooltip } = column;

      return isEditingThisField ? (
        renderEditInput(
          column,
          editState.value,
          handleEditChange,
          () => saveEdit(filterKey, editState.value),
          handleKeyPress
        )
      ) : isOperatorOpen[sortName || field] ? (
        <div className="flex items-center justify-between gap-4">
          <ListBox
            options={
              ["number", "rating"].includes(column.type)
                ? numberFilterOptions
                : stringFilterOptions
            }
            selected={
              filterOperator[sortName || field] || {
                label: t("Select Operator"),
                value: "",
              }
            }
            setSelected={(e) => {
              handleFilterTypeChange(sortName || field, e);
              setIsOperatorOpen({
                ...isOperatorOpen,
                [sortName || field]: false,
              });
            }}
            onClose={() =>
              setIsOperatorOpen({
                ...isOperatorOpen,
                [sortName || field]: false,
              })
            }
            size="sm"
            loading={isLoading}
          />
        </div>
      ) : sortable ? (
        <HeadCell
          label={currentFilterValue ? `(${t(currentFilterValue)})` : t(label)}
          sortField={sortName || field}
          tooltip={`${t("Double click to filter by")} ${t(tooltip || field)}`}
          isOperatorOpen={isOperatorOpen[sortName || field]}
          setIsOperatorOpen={(value) =>
            setIsOperatorOpen({
              ...isOperatorOpen,
              [sortName || field]: value,
            })
          }
          options={
            ["number", "rating"].includes(column.type)
              ? numberFilterOptions
              : stringFilterOptions
          }
          filterable={filterable}
        />
      ) : (
        <div className="flex items-center justify-between gap-4 font-sans">
          {filterable ? (
            <AnimatedTooltip
              content={`${t("Double-click to filter by")} ${t(label)}`}
            >
              <span className="text-xs font-medium uppercase text-muted cursor-help">
                {currentFilterValue
                  ? `${t(label)} (${t(currentFilterValue)})`
                  : t(label)}
              </span>
            </AnimatedTooltip>
          ) : (
            <span className="text-xs py-3 font-medium uppercase text-muted">
              {currentFilterValue
                ? `${t(label)} (${t(currentFilterValue)})`
                : t(label)}
            </span>
          )}
        </div>
      );
    },
    [
      editState.value,
      filterOperator,
      handleEditChange,
      handleFilterTypeChange,
      handleKeyPress,
      isLoading,
      isOperatorOpen,
      renderEditInput,
      saveEdit,
      t,
    ]
  );
  return (
    <tr className="divide-x divide-muted-200 dark:divide-muted-800">
      {canDelete && (
        <th className="w-[41.6px] min-w-[41.6px]">
          <div className="pt-2">
            <Checkbox
              className="cursor-pointer"
              color="primary"
              checked={isAllSelected}
              aria-label={t("Select all items")}
              onChange={(e) => {
                if (e.target.checked) {
                  selectAllItems();
                } else {
                  clearSelection();
                }
              }}
            />
          </div>
        </th>
      )}
      {columnConfig.map((column) => {
        const { field } = column;
        const filterKey = getFilterKey(columnConfig, field);
        const currentFilterValue = filter[filterKey];
        const isEditingThisField =
          editState.isEditing && editState.field === filterKey;

        return (
          <th
            key={field}
            style={widthStyles[field]}
            className={`${!hasActions && ""} px-4`}
            onDoubleClick={() =>
              enableEdit(field, currentFilterValue, column.type)
            }
          >
            {renderCellContent(
              column,
              currentFilterValue,
              isEditingThisField,
              filterKey
            )}
          </th>
        );
      })}

      {hasActions && (
        <th className="w-20 min-w-20">
          <div className="flex items-center justify-center gap-4 font-sans">
            <span className="text-xs font-medium uppercase  text-muted">
              {t("Actions")}
            </span>
          </div>
        </th>
      )}
    </tr>
  );
};
export const Head = memo(HeadBase);
