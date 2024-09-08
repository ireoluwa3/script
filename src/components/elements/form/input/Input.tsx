import React, {
  useEffect,
  useRef,
  type FC,
  type InputHTMLAttributes,
} from "react";
import { Icon, type IconifyIcon } from "@iconify/react";
import type { VariantProps } from "class-variance-authority";
import { inputVariants } from "@/components/elements/variants/input-variants";
import Loader from "@/components/elements/base/loader/Loader";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "color">,
    VariantProps<typeof inputVariants> {
  icon?: IconifyIcon | string;
  label?: string;
  addon?: string;
  error?: string;
  loading?: boolean;
  noPadding?: boolean;
  setFirstErrorInputRef?: (ref: HTMLInputElement) => void;
  warning?: boolean;
}

const Input: FC<InputProps> = ({
  label,
  addon,
  size = "md",
  color = "default",
  shape = "smooth",
  error,
  loading = false,
  icon,
  className: classes = "",
  noPadding = false,
  setFirstErrorInputRef,
  warning,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (setFirstErrorInputRef) {
      setFirstErrorInputRef(inputRef.current as HTMLInputElement);
    }
  }, [setFirstErrorInputRef, error]);

  return (
    <div className="w-full">
      {!!label && (
        <label className="font-sans text-[.68rem] text-muted-400">
          {label}
        </label>
      )}
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
            className: `peer 
      ${classes}
      ${size === "sm" && icon ? "pe-2 ps-8" : ""}
      ${size === "md" && icon ? "pe-3 ps-10" : ""}
      ${size === "lg" && icon ? "pe-4 ps-12" : ""}
      ${size === "sm" && !icon ? "px-2" : ""}
      ${size === "md" && !icon ? "px-3" : ""}
      ${size === "lg" && !icon ? "px-4" : ""}
      ${error ? "!border-danger-500" : ""}
      ${addon ? "!rounded-s-none" : ""}
      ${
        loading
          ? "!text-transparent placeholder:!text-transparent !shadow-none pointer-events-none !select-none"
          : ""
      }
      ring-1 ring-transparent focus:ring-${
        warning ? "warning" : "primary"
      }-500 focus:ring-opacity-50
    `,
          })}
          {...props}
        />

        {!!icon ? (
          <div
            className={`absolute start-0 top-0 z-0 flex items-center justify-center text-muted-400 transition-colors duration-300 peer-focus-visible:text-${
              warning ? "warning" : "primary"
            }-500 dark:text-muted-500 
            ${size === "sm" ? "h-9 w-9" : ""} 
            ${size === "md" ? "h-10 w-10" : ""} 
            ${size === "lg" ? "h-12 w-12" : ""}`}
          >
            <Icon
              icon={icon}
              className={`
              ${size === "sm" ? "h-4 w-4" : ""} 
              ${size === "md" ? "h-[14px] w-[14px]" : ""} 
              ${size === "lg" ? "h-6 w-6" : ""}
              ${error ? "!text-danger-500" : ""}
            `}
            />
          </div>
        ) : (
          ""
        )}
        {!!loading ? (
          <div
            className={`absolute end-0 top-0 z-0 flex items-center justify-center text-muted-400 transition-colors duration-300 peer-focus-visible:text-primary-500 dark:text-muted-500 
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

export default Input;
