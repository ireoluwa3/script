import React, { type FC } from "react";

interface RadioHeadlessProps extends React.HTMLProps<HTMLInputElement> {
  id?: string;
  label?: string;
  name?: string;
  checked?: boolean;
  children?: React.ReactNode;
}

const RadioHeadless: FC<RadioHeadlessProps> = ({
  id,
  checked,
  label,
  name,
  children,
  ...props
}) => {
  return (
    <div className="group/radio-headless relative">
      {label ? (
        <label className="mb-1 inline-block cursor-pointer select-none font-sans text-sm text-muted-400">
          {label}
        </label>
      ) : (
        ""
      )}
      <div className="relative">
        <input
          type="radio"
          id={id}
          name={name}
          checked={checked}
          {...props}
          className="peer absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0"
        />
        {children}
      </div>
    </div>
  );
};

export default RadioHeadless;
