import React, { type FC } from "react";
import CircleChartWidget from "./CircleChartWidget";
import type { CircleColors } from "@/types";

interface CircleWidgetProps {
  icon: string | React.ReactNode;
  circleColor?: keyof CircleColors;
  circlePercentage?: number;
  title: string;
  text: string;
}

const CircleWidget: FC<CircleWidgetProps> = ({
  title,
  text,
  icon,
  circleColor = "primary",
  circlePercentage = 84,
}) => {
  return (
    <div className="flex w-full items-center rounded-lg border border-muted-200 bg-white p-5 dark:border-muted-800 dark:bg-muted-900">
      <CircleChartWidget
        circleColor={circleColor}
        height={70}
        width={70}
        circlePercentage={circlePercentage}
      >
        {typeof icon === "string" ? (
          <span className="inner-text text-center font-medium text-muted-800 dark:text-muted-100">
            {icon}
          </span>
        ) : (
          icon
        )}
      </CircleChartWidget>
      <div className="circle-meta ms-6 ">
        <h3 className="font-sans text-base font-normal text-muted-800 dark:text-muted-100">
          {title}
        </h3>
        <p className="text-xs text-muted-400 max-w-xs">{text}</p>
      </div>
    </div>
  );
};

export default CircleWidget;
