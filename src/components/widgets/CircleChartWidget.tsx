import type { CircleColors } from "@/types";
import React, { type FC } from "react";

const CircleColors: CircleColors = {
  primary: "text-primary-500",
  info: "text-info-500",
  yellow: "text-yellow-500",
  success: "text-success-500",
  warning: "text-warning-500",
  danger: "text-danger-500",
  orange: "text-orange-500",
  green: "text-green-500",
};

interface CircleChartProps {
  circleColor?: keyof CircleColors;
  circlePercentage?: number;
  children?: React.ReactNode;
  height: number | string;
  width: number | string;
}

const CircleChartWidget: FC<CircleChartProps> = ({
  circleColor = "primary",
  children,
  circlePercentage = 84,
  width,
  height,
}) => {
  return (
    <div className="relative h-max w-max ">
      <svg
        className="relative"
        viewBox="0 0 33.83098862 33.83098862"
        width={width}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="stroke-muted-100 dark:stroke-muted-800"
          strokeWidth="2"
          fill="none"
          cx="16.91549431"
          cy="16.91549431"
          r="15.91549431"
        />
        <circle
          className={`stroke-current transition-[stroke] duration-300 ${CircleColors[circleColor]}`}
          strokeWidth="2"
          strokeDasharray={`${
            circlePercentage <= 100 ? circlePercentage : 84
          },100`}
          strokeLinecap="round"
          fill="none"
          cx="16.91549431"
          cy="16.91549431"
          r="15.91549431"
        />
      </svg>
      <div className="absolute start-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {children}
      </div>
    </div>
  );
};

export default CircleChartWidget;
