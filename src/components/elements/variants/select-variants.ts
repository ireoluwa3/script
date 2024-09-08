import { cva } from "class-variance-authority";

export const selectVariants = cva(
  "relative font-sans disabled:opacity-50 disabled:cursor-not-allowed block w-full cursor-pointer appearance-none leading-snug outline-none transition-all duration-300 focus:outline-none focus-visible:shadow-lg focus-visible:shadow-muted-300/30",
  {
    variants: {
      color: {
        default:
          "border border-muted-200 bg-white dark:border-muted-700 dark:bg-muted-800 text-muted-600 dark:text-muted-300 dark:placeholder:text-muted-700 dark:hover:enabled:border-muted-600 placeholder:text-muted-300 hover:enabled:border-muted-300 focus-visible:border-muted-300 focus-visible:outline-none focus-visible:shadow-lg focus-visible:shadow-muted-300/30 dark:focus-visible:shadow-muted-800/20",
        contrast:
          "border border-muted-200 bg-white dark:border-muted-800 dark:bg-muted-900 text-muted-600 dark:text-muted-300 dark:placeholder:text-muted-700 dark:hover:enabled:border-muted-700 placeholder:text-muted-300 hover:enabled:border-muted-300 focus-visible:border-muted-300 focus-visible:outline-none focus-visible:shadow-lg focus-visible:shadow-muted-300/30 dark:focus-visible:shadow-muted-900/20",
        muted:
          "border border-muted-200 bg-muted-100 dark:border-muted-700 dark:bg-muted-800 text-muted-600 dark:text-muted-300 dark:placeholder:text-muted-700 dark:hover:enabled:border-muted-600 placeholder:text-muted-300 hover:enabled:border-muted-300 focus-visible:border-muted-300 focus-visible:outline-none focus-visible:shadow-lg focus-visible:shadow-muted-300/30 dark:focus-visible:shadow-muted-800/20",
        mutedContrast:
          "border border-muted-200 bg-muted-100 dark:border-muted-800 dark:bg-muted-900 text-muted-600 dark:text-muted-300 dark:placeholder:text-muted-700 dark:hover:enabled:border-muted-700 placeholder:text-muted-300 hover:enabled:border-muted-300 focus-visible:border-muted-300 focus-visible:outline-none focus-visible:shadow-lg focus-visible:shadow-muted-300/30 dark:focus-visible:shadow-muted-900/20",
      },
      shape: {
        straight: "",
        "rounded-sm": "rounded-sm",
        rounded: "rounded-md",
        smooth: "rounded-lg",
        curved: "rounded-xl",
        full: "rounded-full",
      },
      size: {
        sm: "h-8 py-2 pe-8 text-sm",
        md: "h-10 py-2 pe-10 text-sm",
        lg: "h-12 py-2 pe-12 text-base",
      },
    },
    defaultVariants: {
      shape: "smooth",
      color: "default",
      size: "md",
    },
  }
);
