import React from "react";
import { RowProps } from "./Row.types";
import { Switch } from "@/components/elements/base/datatable/Switch";
import { motion } from "framer-motion";
import ActionItem from "../../dropdown-action/ActionItem";
import DropdownAction from "../../dropdown-action/DropdownAction";
import Checkbox from "@/components/elements/form/checkbox/Checkbox";
import { useDataTable } from "@/stores/datatable";
import { getAdjustedActionsForItem, getNestedValue } from "@/utils/datatable";
import { useRouter } from "next/router";
import Tag from "../../tag/Tag";
import { MashImage } from "@/components/elements/MashImage";
import Link from "next/link";
import Rating from "@/components/elements/structures/Rating";
import { useTranslation } from "next-i18next";
import IconButton from "../../button-icon/IconButton";
import { Icon } from "@iconify/react";

const getPathValue = (item, path) => {
  let updatedPath = path;
  let match;
  // Use a loop to replace all instances of `[key]`
  while ((match = updatedPath.match(/\[(.*?)\]/))) {
    const pathKey = match[1];
    const pathValue = getNestedValue(item, pathKey);
    if (pathValue === undefined) {
      console.error(
        `Path key "${pathKey}" not found in item in ${updatedPath}`
      );
      return path;
    }
    updatedPath = updatedPath.replace(`[${pathKey}]`, pathValue);
  }
  return updatedPath;
};

const clampText = (text, maxLength) => {
  if (!maxLength || !text) return text;
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Utility to clean up path
const cleanPath = (path) => {
  return path.replace(/\/+/g, "/");
};

const RowBase = ({
  item,
  columnConfig,
  dropdownActionsSlot,
  isParanoid,
  canDelete,
  hasActions,
  viewPath,
  editPath,
  blank,
}: RowProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    selectedItems,
    toggleItemSelection,
    updateItemStatus,
    actionConfigs,
    handleAction,
  } = useDataTable((state) => state);

  const dropdownActionsConfig = getAdjustedActionsForItem(
    isParanoid,
    actionConfigs?.dropdownActionsConfig,
    item
  );

  const renderCombinedActions = () => {
    const allActionItems = dropdownActionsConfig
      ?.map((action, index) => {
        if (!action || !item) return null;
        let link = action.link;
        if (viewPath && action.name === "View") {
          link = cleanPath(getPathValue(item, viewPath));
          return {
            ...action,
            link,
            onClick: () => router.push(link as string),
          };
        }

        if (editPath && action.name === "Edit") {
          link = cleanPath(getPathValue(item, editPath));
          if (!link) return null;
          return {
            ...action,
            link,
            onClick: () => router.push(link as string),
          };
        }

        return {
          ...action,
          link: link ? cleanPath(link.replace(":id", item.id)) : undefined,
          onClick: () =>
            link
              ? router.push(cleanPath(link.replace(":id", item.id)) as string)
              : handleAction(action, item),
        };
      })
      .filter(Boolean) as Array<{
      onClick: () => void | Promise<boolean>;
      name: string;
      label?: string;
      icon: string;
      type: "link" | "modal" | "panel";
      modalType?: "form" | "confirmation";
      side?: "top" | "bottom" | "left" | "right";
      link?: string;
    }>; // Ensure correct type after filtering

    const customActions = dropdownActionsSlot
      ? dropdownActionsSlot(item)
      : null;

    if (allActionItems.length === 1) {
      const singleAction = allActionItems[0]!;
      return (
        <td className="px-4 py-3 align-middle">
          <div className="flex w-full justify-end">
            <IconButton
              name={singleAction.name || ""}
              aria-label={singleAction.name || ""}
              className="flex items-center justify-center p-2"
              color="primary"
              variant="outlined"
              onClick={singleAction.onClick}
            >
              <Icon icon={singleAction.icon} className="w-4 h-4" />
            </IconButton>
          </div>
        </td>
      );
    }

    return (
      <td className="px-4 py-3 align-middle">
        <div className="flex w-full justify-end">
          <DropdownAction orientation="end" canRotate aria-label={t("Actions")}>
            <div className="py-2">
              {customActions}
              {allActionItems.map((action, index) => (
                <ActionItem
                  key={action.name + index}
                  icon={action.icon}
                  text={action.name}
                  subtext={action.label || ""}
                  href={action.link}
                  onClick={action.onClick}
                  aria-label={action.name}
                />
              ))}
            </div>
          </DropdownAction>
        </div>
      </td>
    );
  };

  const isSelected = selectedItems.includes(item.id);

  return (
    <motion.tr
      initial={{ opacity: 0, x: -2 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 2 }}
      transition={{ duration: 0.5 }}
      className="border-b border-muted-200 transition-colors duration-300 last:border-none hover:bg-muted-200/40 dark:border-muted-800 dark:hover:bg-muted-950/60"
    >
      {canDelete && (
        <td className="pt-2 text-center">
          <Checkbox
            className="cursor-pointer"
            color="primary"
            checked={isSelected}
            aria-label={t("Select item")}
            onChange={() => toggleItemSelection(item.id)}
          />
        </td>
      )}
      {columnConfig.map(
        (
          {
            field,
            sublabel,
            type,
            active = true,
            disabled = false,
            api,
            hasImage,
            imageKey,
            placeholder,
            options,
            getValue,
            getSubValue,
            getImage,
            className,
            precision,
            color,
            path,
            subpath,
            maxLength,
            imageWidth,
            imageHeight,
          },
          index
        ) => {
          if (typeof active === "string") active = active === "true";
          if (typeof disabled === "string") disabled = disabled === "false";
          let value = item[field];
          if (type === "number" && precision) {
            value = item[field]?.toFixed(precision);
          }
          let content;
          switch (type) {
            case "switch":
              content = (
                <Switch
                  key={field}
                  initialState={item.status === active}
                  endpoint={api?.replace(":id", item.id) || ""}
                  active={active}
                  disabled={disabled}
                  onUpdate={(newStatus) => updateItemStatus(item.id, newStatus)}
                />
              );
              break;
            case "select":
              content = (
                <Tag
                  key={field}
                  variant="pastel"
                  shape="smooth"
                  color={
                    options?.find((opt) => opt.value === value)?.color ||
                    "warning"
                  }
                >
                  {options?.find((opt) => opt.value === value)?.label ||
                    "Pending"}
                </Tag>
              );
              break;
            case "datetime":
              if (!value) return <td key={field}></td>;
              content = (
                <span
                  key={field}
                  className="line-clamp-1 text-muted-800 dark:text-muted-100"
                >
                  {new Date(value).toLocaleString()}
                </span>
              );
              break;
            case "rating":
              if (!value) return <td key={field}></td>;
              content = (
                <Rating
                  key={field}
                  rating={getValue ? getValue(item) : value}
                />
              );
              break;
            case "tag":
              if (!value || value.length === 0) return <td key={field}></td>;
              content = (
                <Link key={field} href={cleanPath(getPathValue(item, path))}>
                  <Tag variant="pastel" shape="smooth" color={color || "muted"}>
                    {getValue ? getValue(item) : value}
                  </Tag>
                </Link>
              );
              break;
            case "tags":
              if (!value || value.length === 0) return <td key={field}></td>;
              content = (
                <div key={field} className="flex flex-wrap gap-1">
                  {value.slice(0, 2).map((tag, idx) => (
                    <Tag
                      key={tag.name + idx}
                      variant="pastel"
                      shape="smooth"
                      color={color || "muted"}
                    >
                      {tag.name}
                    </Tag>
                  ))}
                  {value.length > 2 && (
                    <Tag
                      key="more"
                      variant="pastel"
                      shape="smooth"
                      color={color || "muted"}
                    >
                      +{value.length - 2} {t("more")}
                    </Tag>
                  )}
                </div>
              );
              break;
            case "image":
              const imageLink = getImage ? getImage(item) : value;
              content = (
                <MashImage
                  key={field}
                  src={imageLink || placeholder}
                  alt={value || "image"}
                  width={imageWidth || item.width || 32}
                  height={imageHeight || item.height || 32}
                  className={`${!item[field] ? "dark:invert" : ""} ${
                    className || "rounded-md"
                  }`}
                />
              );
              break;
            default:
              const truncatedText = clampText(
                getValue ? getValue(item) : value,
                maxLength
              );
              const labelContent = (
                <span
                  key={field}
                  className={`text-muted-900 dark:text-muted-100 line-clamp-${maxLength}`}
                >
                  {truncatedText}
                </span>
              );
              const sublabelContent = sublabel && (
                <span
                  key={field + "-sublabel"}
                  className="text-muted-500 dark:text-muted-400"
                >
                  {getSubValue ? getSubValue(item) : item[sublabel]}
                </span>
              );
              const imageContent = hasImage && imageKey && (
                <MashImage
                  key={field + "-image"}
                  src={
                    getImage
                      ? getImage(item)
                      : getNestedValue(item, imageKey) || placeholder
                  }
                  alt={value || "image"}
                  width={imageWidth || item.width || 32}
                  height={imageHeight || item.height || 32}
                  className={`${!item[imageKey] ? "dark:invert" : ""} ${
                    className || "rounded-md"
                  }`}
                />
              );
              content = (
                <div key={field} className="flex items-center gap-2">
                  {path && hasImage && imageKey ? (
                    <Link href={cleanPath(getPathValue(item, path))}>
                      {imageContent}
                    </Link>
                  ) : (
                    imageContent
                  )}
                  <div className="flex flex-col line-clamp-1">
                    {path ? (
                      <Link
                        href={cleanPath(getPathValue(item, path))}
                        className="text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        {labelContent}
                      </Link>
                    ) : (
                      labelContent
                    )}
                    {subpath ? (
                      <Link
                        href={cleanPath(getPathValue(item, subpath))}
                        className="text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        {sublabelContent}
                      </Link>
                    ) : (
                      sublabelContent
                    )}
                  </div>
                </div>
              );
              break;
          }
          return (
            <td key={field + index} className="px-4 py-3 align-middle">
              {content}
            </td>
          );
        }
      )}
      {hasActions && renderCombinedActions()}
    </motion.tr>
  );
};
export const Row = RowBase;
