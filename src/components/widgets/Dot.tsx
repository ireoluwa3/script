import React, { type FC } from "react";

interface DotColors {
  primary: string;
  info: string;
  yellow: string;
  success: string;
  warning: string;
  danger: string;
}

const dotColors: DotColors = {
  primary: "bg-primary",
  info: "bg-info",
  yellow: "bg-yellow",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

const Dot: FC<{ color: keyof DotColors }> = ({ color }) => {
  return (
    <span
      className={`dot dot-${color} ${dotColors[color]} block h-3 w-3 rounded-full`}
    ></span>
  );
};

export default Dot;
