import { memo } from "react";

interface SortableHeaderProps {
  field: string; // Single field passed as a parameter
  setSort: (sort: { field: string; rule: "asc" | "desc" }) => void;
  sort: { field: string; rule: "asc" | "desc" };
  className?: string;
}

const SortableHeaderBase = ({
  field,
  setSort,
  sort,
  className,
}: SortableHeaderProps) => {
  const isSorted = (field: string) => sort.field === field;

  return (
    <div
      className={`flex flex-row items-center cursor-pointer text-xs gap-1 ${className}`}
      onClick={() =>
        setSort({
          field: field,
          rule: sort.rule === "asc" && isSorted(field) ? "desc" : "asc",
        })
      }
    >
      {field.charAt(0).toUpperCase() + field.slice(1)}{" "}
      {/* Capitalize the first letter */}
      <div className="flex flex-col items-center">
        <svg
          fill="none"
          role="button"
          tabIndex={0}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className={`h-2 w-2 cursor-pointer fill-none ${
            sort.rule === "asc" && isSorted(field)
              ? "text-warning-500"
              : "text-muted-400"
          }`}
        >
          <path d="M5 15l7-7 7 7"></path>
        </svg>
        <svg
          fill="none"
          role="button"
          tabIndex={0}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className={`h-2 w-2 cursor-pointer fill-none ${
            sort.rule === "desc" && isSorted(field)
              ? "text-warning-500"
              : "text-muted-400"
          }`}
        >
          <path d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
    </div>
  );
};

export const SortableHeader = memo(SortableHeaderBase);
