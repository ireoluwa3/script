import React, { type FC } from "react";

interface CheckboxHeadlessProps extends React.HTMLProps<HTMLInputElement> {
  label?: string;
  id?: string;
  checked?: boolean;
  children?: React.ReactNode;
}

const CheckboxHeadless: FC<CheckboxHeadlessProps> = ({
  id,
  checked,
  label,
  children,
  ...props
}) => {
  return (
    <div className="group/checkbox-headless relative">
      {label ? (
        <label className="mb-1 inline-block cursor-pointer select-none font-sans text-sm text-muted-400">
          {label}
        </label>
      ) : (
        ""
      )}
      <label htmlFor={id} className="relative block">
        <input
          id={id}
          className="peer absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0"
          type="checkbox"
          checked={checked}
          {...props}
        />
        {children}
      </label>
    </div>
  );
};

export default CheckboxHeadless;
