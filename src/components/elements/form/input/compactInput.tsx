import React, {
  useEffect,
  useRef,
  type FC,
  type InputHTMLAttributes,
} from "react";
import type { VariantProps } from "class-variance-authority";
import { inputVariants } from "@/components/elements/variants/input-variants";
import Loader from "@/components/elements/base/loader/Loader";
import Select from "../select/Select";

interface CompactInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "color">,
    VariantProps<typeof inputVariants> {
  label?: string;
  postLabel?: string;
  options?: { value: string; label: string }[];
  addon?: string;
  error?: string;
  loading?: boolean;
  noPadding?: boolean;
  setFirstErrorCompactInputRef?: (ref: HTMLInputElement) => void;
  selected?: string;
  setSelected?: (value: string) => void;
}

const CompactInput: FC<CompactInputProps> = ({
  label = "",
  postLabel = "",
  options,
  addon,
  size = "md",
  color = "default",
  shape = "smooth",
  error,
  loading = false,
  className: classes = "",
  noPadding = false,
  setFirstErrorCompactInputRef,
  selected,
  setSelected,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (setFirstErrorCompactInputRef) {
      setFirstErrorCompactInputRef(inputRef.current as HTMLInputElement);
    }
  }, [setFirstErrorCompactInputRef, error]);

  return (
    <div className="w-full">
      <div className={`relative w-full ${addon ? "flex" : ""}`}>
        {!!addon ? (
          <div
            className={`inline-flex cursor-pointer items-center justify-center border border-muted-200 border-e-transparent bg-muted-100 ${
              !noPadding && "px-4 py-2"
            } text-center text-sm leading-tight text-muted-500 dark:border-muted-800 dark:border-e-transparent dark:bg-muted-700 dark:text-muted-300
            ${size === "sm" ? "h-8" : ""}
            ${size === "md" ? "h-10" : ""}
            ${size === "lg" ? "h-12" : ""}
            ${shape === "rounded" ? "rounded-s-md" : ""}
            ${shape === "smooth" ? "rounded-s-lg" : ""}
            ${shape === "curved" ? "rounded-s-xl" : ""}
            ${shape === "full" ? "rounded-s-full" : ""}
          `}
          >
            {addon}
          </div>
        ) : (
          ""
        )}
        <input
          ref={inputRef}
          className={inputVariants({
            size,
            color,
            shape,
            className: `order-input peer text-end
      ${classes}
      ${size === "sm" && label ? "pe-14 ps-8" : ""}
      ${size === "md" && label ? "pe-16 ps-10" : ""}
      ${size === "lg" && label ? "pe-18 ps-12" : ""}
      ${size === "sm" && !label ? "px-2" : ""}
      ${size === "md" && !label ? "px-3" : ""}
      ${size === "lg" && !label ? "px-4" : ""}
      ${size === "sm" && options ? "pe-14 ps-8" : ""}
      ${size === "md" && options ? "pe-16 ps-10" : ""}
      ${size === "lg" && options ? "pe-18 ps-12" : ""}
      ${size === "sm" && !options ? "px-2" : ""}
      ${size === "md" && !options ? "px-3" : ""}
      ${size === "lg" && !options ? "px-4" : ""}
      ${size === "sm" && postLabel ? "pe-8 ps-2" : ""}
      ${size === "md" && postLabel ? "pe-10 ps-3" : ""}
      ${size === "lg" && postLabel ? "pe-12 ps-4" : ""}
      ${size === "sm" && !postLabel ? "px-2" : ""}
      ${size === "md" && !postLabel ? "px-3" : ""}
      ${size === "lg" && !postLabel ? "px-4" : ""}
      ${error ? "!border-danger-500" : ""}
      ${addon ? "!rounded-s-none" : ""}
      ${
        loading
          ? "!text-transparent placeholder:!text-transparent !shadow-none pointer-events-none !select-none"
          : ""
      }
      ring-1 ring-transparent focus:ring-warning-500 focus:ring-opacity-50
    `,
          })}
          {...props}
        />

        {options && options.length > 0 ? (
          <div
            className={`absolute start-0 top-0 z-0 flex items-center justify-center font-sans text-[.68rem] text-muted-400 transition-colors duration-300 peer-focus-visible:text-warning-500 dark:text-muted-500 
            ${size === "sm" ? "h-9 w-24 ps-1" : ""} 
            ${size === "md" ? "h-10 w-24 ps-1" : ""} 
            ${size === "lg" ? "h-12 w-28 ps-1" : ""}`}
          >
            <Select
              options={options}
              size={"sm"}
              color={color}
              shape={"rounded-sm"}
              error={error}
              loading={loading}
              value={selected}
              onChange={(e) => setSelected && setSelected(e.target.value)}
            />
          </div>
        ) : (
          <div
            className={`absolute start-0 top-0 z-0 flex items-center justify-center font-sans text-[.68rem] text-muted-400 transition-colors duration-300 peer-focus-visible:text-warning-500 dark:text-muted-500 
            ${size === "sm" ? "h-9 w-9" : ""} 
            ${size === "md" ? "h-10 w-24" : ""} 
            ${size === "lg" ? "h-12 w-12" : ""}`}
          >
            <span
              className={`
              ${size === "sm" ? "h-4 w-4" : ""} 
              ${size === "md" ? "h-[14px] w-[14px] min-w-20" : ""} 
              ${size === "lg" ? "h-6 w-6" : ""}
              ${error ? "!text-danger-500" : ""}
            `}
            >
              {label}
            </span>
          </div>
        )}
        {!!postLabel ? (
          <div
            className={`absolute end-0 top-0 z-0 flex items-center justify-center font-sans text-[.6rem] text-end text-muted-400 transition-colors duration-300 peer-focus-visible:text-warning-500 dark:text-muted-500 
            ${size === "sm" ? "h-9 pe-8" : ""} 
            ${size === "md" ? "h-10 pe-10" : ""} 
            ${size === "lg" ? "h-12 pe-12" : ""}`}
          >
            <span
              className={`
              ${size === "sm" ? "h-4 w-4" : ""} 
              ${size === "md" ? "h-[14px] w-[14px]" : ""} 
              ${size === "lg" ? "h-6 w-6" : ""}
              ${error ? "!text-danger-500" : ""}
            `}
            >
              {postLabel}
            </span>
          </div>
        ) : (
          ""
        )}
        {!!loading ? (
          <div
            className={`absolute end-0 top-0 z-0 flex items-center justify-center text-muted-400 transition-colors duration-300 peer-focus-visible:text-warning-500 dark:text-muted-500 
            ${size === "sm" ? "h-9 w-9" : ""} 
            ${size === "md" ? "h-10 w-10" : ""} 
            ${size === "lg" ? "h-12 w-12" : ""}`}
          >
            <Loader
              classNames={`dark:text-muted-200
                ${
                  color === "muted" || color === "mutedContrast"
                    ? "text-muted-400"
                    : "text-muted-300"
                }
              `}
              size={20}
              thickness={4}
            />
          </div>
        ) : (
          ""
        )}
        {error ? (
          <span className="mt-0.5 block font-sans text-[0.6rem] text-danger-500">
            {error}
          </span>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default CompactInput;
