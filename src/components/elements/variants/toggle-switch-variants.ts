import { cva } from "class-variance-authority";

export const toggleSwitchVariants = cva(
  "bg-muted-100 dark:bg-muted-700 relative inline-block h-[20.8px] w-[36.8px] rounded-[18.4px] transition-all duration-300 ease-linear before:absolute before:start-0 before:h-[17.6px] before:w-[33.6px] before:rounded-[8.8px] before:bg-white before:transition-all before:duration-[200ms] before:ease-linear before:content-[''] before:[transform:translate3d(calc(1.6px_*_1),_1.6px,_0)_scale3d(1,_1,_1)] after:absolute after:start-0  after:h-[17.6px] after:w-[17.6px] after:rounded-full after:bg-white dark:after:bg-muted-900 after:transition-all after:duration-160 after:ease-in-out after:content-[''] after:[box-shadow:0_1.6px_1.6px_rgba(0,_0,_0,_0.24)] after:[transform:translate3d(calc(1.6px_*_1),_1.6px,_0)] peer-checked:before:[transform:translate3d(calc(14.4px_*_1),_1.6px,_0)_scale3d(0,_0,_0)] peer-checked:after:[transform:translate3d(calc(17.6px_*_1),_1.6px,_0)] dark:before:bg-muted-800",
  {
    variants: {
      color: {
        primary: "peer-checked:bg-primary-500 dark:peer-checked:bg-primary-700",
        info: "peer-checked:bg-info-500 dark:peer-checked:bg-info-700",
        success: "peer-checked:bg-success-500 dark:peer-checked:bg-success-700",
        warning: "peer-checked:bg-warning-500 dark:peer-checked:bg-warning-700",
        danger: "peer-checked:bg-danger-500 dark:peer-checked:bg-danger-700",
        default: "peer-checked:bg-muted-200 dark:peer-checked:bg-muted-700/70",
      },
    },
    defaultVariants: {
      color: "default",
    },
  }
);
