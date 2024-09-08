import React, { type FC } from "react";
import { Icon } from "@iconify/react";
import type { VariantProps } from "class-variance-authority";
import { checkboxVariants } from "@/components/elements/variants/checkbox-variants";

interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "color">,
    VariantProps<typeof checkboxVariants> {
  label?: string | React.ReactNode;
}

const Checkbox: FC<CheckboxProps> = ({
  id,
  color = "default",
  shape = "smooth",
  label,
  className: classes = "",
  ...props
}) => {
  // const checkboxId = label.toLocaleLowerCase().replaceAll(" ", "-");

  return (
    <div
      className={`checkbox-${
        color || "default"
      }  relative inline-block cursor-pointer leading-tight overflow-hidden`}
    >
      <label htmlFor={id} className="flex items-center">
        <span
          className={`shrink-0 relative flex h-5 w-5 items-center justify-center border-muted-300 dark:border-muted-700 overflow-hidden border-2 bg-muted-100 transition-shadow duration-300 dark:bg-muted-800 
          ${shape === "rounded" ? "rounded" : ""} 
          ${shape === "smooth" ? "rounded-md" : ""} 
          ${shape === "curved" ? "rounded-lg" : ""} 
          ${shape === "full" ? "rounded-full" : ""}
          ${color === "primary" ? "focus-within:border-primary-500/20" : ""}
          ${color === "info" ? "focus-within:border-info-500/20" : ""}
          ${color === "success" ? "focus-within:border-success-500/20" : ""}
          ${color === "warning" ? "focus-within:border-warning-500/20" : ""}
          ${color === "danger" ? "focus-within:border-danger-500/20" : ""}
        `}
        >
          <input
            id={id}
            type="checkbox"
            className={`peer absolute start-0 top-0 z-[3] h-full w-full cursor-pointer appearance-none ${classes}`}
            {...props}
          />
          <Icon
            icon="fluent:checkmark-12-filled"
            className={`relative start-0 z-[2] h-3 w-3 translate-y-5 scale-0 transition-transform delay-150 duration-300 peer-checked:translate-y-0 peer-checked:scale-100
              ${
                color === "default"
                  ? "text-muted-700 dark:text-muted-100"
                  : "text-white"
              }
            `}
          />
          <span className={`${checkboxVariants({ color, shape })}`}></span>
        </span>
        {label && (
          <span className="ms-2 cursor-pointer font-sans text-sm text-muted-400">
            {label}
          </span>
        )}
      </label>
    </div>
  );
};

export default Checkbox;
