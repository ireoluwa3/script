import { memo } from "react";
const PercentageBarBase = ({ askPercentage, bidPercentage }) => {
  return (
    <div className="w-full">
      <div className="flex items-center w-full relative h-6">
        <div
          style={{
            width: `${bidPercentage}%`,
            clipPath: `polygon(0 0, 100% 0, calc(100% - 3px) 100%, 0 100%)`,
          }}
          className="flex items-center justify-start text-left pl-1 text-white h-full bg-success-600 rounded-l-sm transition-all duration-300 ease-in-out"
        >
          <span className="px-[4px] py bg-muted-100 dark:bg-muted-900 mr-2 cursor-default text-muted-800 dark:text-muted-200 rounded-sm">
            B
          </span>
          <span className="text-sm z-1 cursor-default">{bidPercentage}%</span>
        </div>
        <div
          style={{
            width: `${askPercentage}%`,
            clipPath: `polygon(3px 0, 100% 0, 100% 100%, 0 100%)`,
          }}
          className="flex items-center justify-end text-right pr-1 text-white h-full bg-danger-500 rounded-r-sm transition-all duration-300 ease-in-out"
        >
          <span className="text-sm z-1 cursor-default">{askPercentage}%</span>
          <span className="px-[4px] py bg-muted-100 dark:bg-muted-900 ms-2 cursor-default text-muted-800 dark:text-muted-200 rounded-sm">
            S
          </span>
        </div>
      </div>
    </div>
  );
};

export const PercentageBar = memo(PercentageBarBase);
