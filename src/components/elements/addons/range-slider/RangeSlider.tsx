import React, { type FC } from "react";
import ReactSlider from "react-slider";

interface RangeSliderProps {
  value: number;
  min?: number;
  max?: number;
  steps?: boolean | number[];
  valuePrefix?: string;
  valueSuffix?: string;
  legend?: boolean;
  color?: "primary" | "info" | "success" | "warning" | "danger";
  orientation?: "horizontal" | "vertical";
  invert?: boolean;
  tooltip?: boolean;
  handleHover?: boolean;
  onSliderChange: (value: number) => void;
  disabled?: boolean;
  thumbSize?: "xs" | "sm" | "md" | "lg";
}

const RangeSlider: FC<RangeSliderProps> = ({
  value,
  min = 0,
  max = 100,
  steps,
  valuePrefix,
  valueSuffix,
  legend,
  color = "primary",
  orientation = "horizontal",
  invert = false,
  tooltip = true,
  handleHover = false,
  disabled,
  onSliderChange,
  thumbSize = "md",
}) => {
  return (
    <div
      className={`flex items-center text-sm text-muted-500
      ${legend ? "justify-between gap-5" : ""}
      ${orientation === "vertical" ? "min-h-[160px] w-6 flex-col" : "w-full"}
    `}
    >
      {legend ? (
        <span className="relative start-2 top-0.5 font-sans text-sm leading-none text-muted-500 dark:text-muted-400">
          <span className="pe-1">
            {valuePrefix}
            {min}
          </span>
          {valueSuffix}
        </span>
      ) : (
        ""
      )}
      <ReactSlider
        disabled={disabled}
        className={`relative
          ${orientation === "vertical" ? "min-h-[160px]" : "w-full"}
        `}
        value={value}
        min={min}
        max={max}
        marks={steps}
        orientation={orientation}
        invert={invert}
        markClassName={`-top-1 start-1 h-3 w-3 border-2 bg-muted-100 dark:bg-muted-900 rounded-sm rotate-45 cursor-pointer
          ${
            color === "primary"
              ? "border-primary-500 hover:bg-muted-400 hover:dark:bg-muted-500 hover:border-muted-200 hover:dark:border-muted-950"
              : ""
          }
          ${
            color === "info"
              ? "border-info-500 hover:bg-muted-400 hover:dark:bg-muted-500 hover:border-muted-200 hover:dark:border-muted-950"
              : ""
          }
          ${
            color === "success"
              ? "border-success-500 hover:bg-muted-400 hover:dark:bg-muted-500 hover:border-muted-200 hover:dark:border-muted-950"
              : ""
          }
          ${
            color === "warning"
              ? "border-warning-500 hover:bg-muted-400 hover:dark:bg-muted-500 hover:border-muted-200 hover:dark:border-muted-950"
              : ""
          }
          ${
            color === "danger"
              ? "border-danger-500 hover:bg-muted-400 hover:dark:bg-muted-500 hover:border-muted-200 hover:dark:border-muted-950"
              : ""
          }
        `}
        onChange={(value) => onSliderChange?.(value as number)}
        thumbActiveClassName="[&>div>div]:opacity-100 [&>div>div>div]:translate-y-0 [&>div]:ring-1"
        trackClassName={`rounded-sm even:border-muted-300 dark:even:border-muted-700
          ${color === "primary" ? "odd:border-primary-500" : ""}
          ${color === "info" ? "odd:border-info-500" : ""}
          ${color === "success" ? "odd:border-success-500" : ""}
          ${color === "warning" ? "odd:border-warning-500" : ""}
          ${color === "danger" ? "odd:border-danger-500" : ""}
          ${orientation === "vertical" ? "border-s-4 start-1" : "border-t-4"}
        `}
        renderThumb={(props, state) => {
          const { key, ...restProps } = props; // Destructure key and remove it from restProps
          const thumbSizeClasses = {
            xs: "h-2 w-2",
            sm: "h-3 w-3",
            md: "h-4 w-4",
            lg: "h-5 w-5",
          };

          const thumbClass = thumbSizeClasses[thumbSize] || thumbSizeClasses.md;

          return (
            <div
              className={`absolute -top-1 start-0 rounded-sm rotate-45
                ${color === "primary" ? "border-primary-500" : ""}
                ${color === "info" ? "border-info-500" : ""}
                ${color === "success" ? "border-success-500" : ""}
                ${color === "warning" ? "border-warning-500" : ""}
                ${color === "danger" ? "border-danger-500" : ""}
                ${orientation === "vertical" ? "border-s-4" : "border-t-4"}
              `}
              key={key} // Directly apply the key to the JSX element
              {...restProps} // Spread the remaining props
            >
              <div
                tabIndex={0}
                className={`absolute -end-3 bottom-0 top-0.5 my-auto ${thumbClass} cursor-pointer rounded-sm rotate-45 ring-offset-2 ring-offset-white dark:ring-offset-muted-950
                  ${
                    color === "primary" ? "bg-primary-500 ring-primary-500" : ""
                  }
                  ${color === "info" ? "bg-info-500 ring-info-500" : ""}
                  ${
                    color === "success" ? "bg-success-500 ring-success-500" : ""
                  }
                  ${
                    color === "warning" ? "bg-warning-500 ring-warning-500" : ""
                  }
                  ${color === "danger" ? "bg-danger-500 ring-danger-500" : ""}
                  ${
                    handleHover
                      ? "scale-0 opacity-0 transition-all duration-300 group-hover/react-slider:scale-100 group-hover/react-slider:opacity-100"
                      : ""
                  }
                `}
              >
                {tooltip ? (
                  <div className="relative h-full w-full opacity-0 transition-opacity duration-200 -rotate-45">
                    <div className="absolute start-[0.11rem] top-[-1.22rem] h-3 w-3 translate-y-2 -rotate-45 bg-muted-900 transition-all duration-300 ease-in-out dark:bg-muted-700"></div>
                    <div className="absolute -top-12 start-[-0.4rem] flex h-8 w-8 translate-y-2 items-center justify-center rounded-full bg-muted-900 text-center font-sans text-[0.52rem] font-medium text-white transition-all duration-300 ease-in-out dark:bg-muted-700">
                      <span className="select-none leading-none">
                        {state.valueNow}
                      </span>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          );
        }}
      />
      {legend ? (
        <span className="relative top-0.5 font-sans text-sm leading-none text-muted-500 dark:text-muted-400">
          <span
            className={`relative ${
              orientation === "horizontal" ? "pe-1" : "start-2 pe-3"
            }`}
          >
            {valuePrefix}
            {max}
          </span>
          {valueSuffix}
        </span>
      ) : (
        ""
      )}
    </div>
  );
};

export default RangeSlider;
