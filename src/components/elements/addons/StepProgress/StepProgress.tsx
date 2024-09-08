import { memo } from "react";
import React from "react";
import Progress from "../../base/progress/Progress";
import { Icon } from "@iconify/react";

interface StepProgressProps {
  step: number;
  icons: string[];
}

const StepProgressBase: React.FC<StepProgressProps> = ({ step, icons }) => {
  const numberOfSteps = icons.length;
  const getProgress = () => {
    if (step < 1 || step > numberOfSteps) return 0;
    return ((step - 1) / (numberOfSteps - 1)) * 100;
  };

  const renderSteps = () => {
    return icons.map((icon, index) => (
      <button
        key={index}
        type="button"
        style={{
          position: "absolute",
          left: `${(index / (numberOfSteps - 1)) * 100}%`,
          transform: "translateX(-50%)", // This centers the button on the calculated left position
          top: "-1rem",
          zIndex: 10,
        }}
        className={`flex h-10 w-10 items-center justify-center rounded-full border-[1.4px] bg-white dark:bg-muted-950 ${
          step > index
            ? "border-primary-500 text-primary-500"
            : "border-muted-200 text-muted-400 dark:border-muted-800"
        }`}
      >
        <Icon icon={icon} className="h-4 w-4" />
      </button>
    ));
  };

  return (
    <div className="absolute inset-x-0 top-24 lg:top-20 z-10 mx-auto max-w-xs md:max-w-md ltablet:max-w-md lg:max-w-lg">
      <div className="flex w-full relative">
        <Progress size="sm" color="primary" value={getProgress()} />
        {renderSteps()}
      </div>
    </div>
  );
};

export const StepProgress = memo(StepProgressBase);
