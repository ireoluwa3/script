import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Checkbox from "@/components/elements/form/checkbox/Checkbox";
import { LoadingRowProps } from "./LoadingRow.types";
import { useDashboardStore } from "@/stores/dashboard";

const LoadingRowBase = ({
  columnConfig,
  canDelete,
  isCrud,
  hasActions,
}: LoadingRowProps) => {
  const { isDark } = useDashboardStore();
  const [skeletonProps, setSkeletonProps] = useState({
    baseColor: "#f7fafc",
    highlightColor: "#edf2f7",
  });

  useEffect(() => {
    setSkeletonProps({
      baseColor: isDark ? "#27272a" : "#f7fafc",
      highlightColor: isDark ? "#3a3a3e" : "#edf2f7",
    });
  }, [isDark]);

  const renderSkeleton = (type, hasImage) => {
    if (hasImage) {
      return (
        <div className="flex items-center gap-2 pl-4">
          <Skeleton width={25.6} height={25.6} circle {...skeletonProps} />
          <Skeleton width={48} height={9.6} {...skeletonProps} />
        </div>
      );
    }

    switch (type) {
      case "switch":
        return (
          <Skeleton
            width={36.8}
            height={20.8}
            borderRadius={40}
            {...skeletonProps}
          />
        );
      case "select":
        return (
          <Skeleton
            width={64}
            height={22.4}
            borderRadius={6.4}
            {...skeletonProps}
          />
        );
      default:
        return (
          <span className="line-clamp-1 text-sm">
            <Skeleton width="100%" height={12} {...skeletonProps} />
          </span>
        );
    }
  };

  return (
    <>
      {Array.from({ length: 3 }).map((_, index) => (
        <motion.tr
          key={index}
          initial={{ opacity: 0, x: -2 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 2 }}
          transition={{ duration: 0.2 }}
          className="border-b border-muted-200 transition-colors duration-300 last:border-none hover:bg-muted-200/40 dark:border-muted-800 dark:hover:bg-muted-900/60 h-16"
        >
          {canDelete && isCrud && (
            <td className="px-4 pt-2">
              <Checkbox className="cursor-pointer" color="primary" />
            </td>
          )}
          {columnConfig.map(({ field, type, hasImage }) => (
            <td key={field} className="px-4 py-3 align-middle">
              {renderSkeleton(type, hasImage)}
            </td>
          ))}
          {hasActions && (
            <td className="px-4 py-3 align-middle">
              <div className="flex w-full justify-end">
                <Skeleton width={32} height={32} circle {...skeletonProps} />
              </div>
            </td>
          )}
        </motion.tr>
      ))}
    </>
  );
};

export const LoadingRow = LoadingRowBase;
