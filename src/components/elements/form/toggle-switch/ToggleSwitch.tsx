import React, { useEffect, useRef, type FC } from "react";
import type { VariantProps } from "class-variance-authority";
import { toggleSwitchVariants } from "@/components/elements/variants/toggle-switch-variants";

interface ToggleSwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "color">,
    VariantProps<typeof toggleSwitchVariants> {
  checked?: boolean;
  label?: string;
  sublabel?: string;
  error?: string;
  setFirstErrorInputRef?: (ref: HTMLInputElement) => void;
}

const ToggleSwitch: FC<ToggleSwitchProps> = ({
  id,
  checked,
  label,
  sublabel,
  color,
  className: classes = "",
  error,
  setFirstErrorInputRef,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (setFirstErrorInputRef) {
      setFirstErrorInputRef(inputRef.current as HTMLInputElement);
    }
  }, [setFirstErrorInputRef, error]);

  return (
    <div className={`relative flex items-center gap-2 text-base ${classes}`}>
      <label
        htmlFor={id}
        className="relative inline-flex items-center gap-3 cursor-pointer"
      >
        <span className="relative inline-flex">
          <input
            ref={inputRef}
            id={id}
            type="checkbox"
            checked={checked}
            className={`peer pointer-events-none absolute opacity-0`}
            {...props}
          />
          <i className={toggleSwitchVariants({ color })}></i>
        </span>

        {!sublabel ? (
          <span className="font-sans text-sm text-muted-400">{label}</span>
        ) : (
          <div className="ms-1">
            <span className="block font-sans text-sm text-muted-800 dark:text-muted-100">
              {label}
            </span>
            <span className="block font-sans text-xs text-muted-400 dark:text-muted-400">
              {sublabel}
            </span>
          </div>
        )}
      </label>
    </div>
  );
};

export default ToggleSwitch;
