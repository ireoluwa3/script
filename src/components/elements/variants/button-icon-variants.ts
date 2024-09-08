import { cva } from "class-variance-authority";

export const buttonIconVariants = cva(
  "cursor-pointer relative inline-flex items-center justify-center gap-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
  {
    variants: {
      color: {
        default: "",
        contrast: "",
        muted: "",
        primary: "",
        info: "",
        success: "",
        warning: "",
        danger: "",
      },
      variant: {
        solid: "",
        pastel: "",
        outlined: "",
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
        xxs: "h-4 w-4",
        xs: "h-6 w-6",
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
      },
      shadow: {
        none: "",
        default: "hover:enabled:shadow-xl",
        contrast: "hover:enabled:shadow-xl",
        muted: "hover:enabled:shadow-xl",
        primary:
          "hover:enabled:shadow-xl hover:enabled:shadow-primary-500/50 dark:hover:enabled:shadow-primary-800/20",
        info: "hover:enabled:shadow-xl hover:enabled:shadow-info-500/50 dark:hover:enabled:shadow-info-800/20",
        success:
          "hover:enabled:shadow-xl hover:enabled:shadow-success-500/50 dark:hover:enabled:shadow-success-800/20",
        warning:
          "hover:enabled:shadow-xl hover:enabled:shadow-warning-500/50 dark:hover:enabled:shadow-warning-800/20",
        danger:
          "hover:enabled:shadow-xl hover:enabled:shadow-danger-500/50 dark:hover:enabled:shadow-danger-800/20",
      },
    },

    compoundVariants: [
      {
        color: "default",
        variant: "solid",
        className:
          "[&>span>.loader]:text-muted-500 dark:[&>span>.loader]:text-muted-200 bg-white hover:enabled:bg-muted-50 active:enabled:bg-muted-100 hover:enabled:border-muted-300 dark:hover:enabled:border-muted-600 border border-muted-200 dark:border-muted-700 text-muted-800 dark:text-muted-100 dark:bg-muted-800 dark:hover:enabled:bg-muted-700 dark:active:enabled:bg-muted-800",
      },
      {
        color: "contrast",
        variant: "solid",
        className:
          "[&>span>.loader]:text-muted-500 dark:[&>span>.loader]:text-muted-200 bg-white hover:enabled:bg-muted-50 active:enabled:bg-muted-100 hover:enabled:border-muted-300 dark:hover:enabled:border-muted-700 border border-muted-200 dark:border-muted-800 text-muted-800 dark:text-muted-100 dark:bg-muted-900 dark:hover:enabled:bg-muted-900 dark:active:enabled:bg-muted-900",
      },
      {
        color: "muted",
        variant: "solid",
        className:
          "[&>span>.loader]:text-muted-500 dark:[&>span>.loader]:text-muted-200 border border-muted-200 dark:border-muted-700 bg-muted-200 dark:bg-muted-800 text-muted-500 dark:text-muted-100 enabled:hover:bg-muted-300 dark:enabled:hover:bg-muted-700 active:enabled:bg-muted-100 dark:active:enabled:bg-muted-800",
      },
      {
        color: "primary",
        variant: "solid",
        className:
          "[&>span>.loader]:text-muted-100 border border-primary-500 bg-primary-500 text-white enabled:hover:bg-primary-600 active:enabled:bg-primary-400",
      },
      {
        color: "info",
        variant: "solid",
        className:
          "[&>span>.loader]:text-muted-100 border border-info-500 bg-info-500 text-white enabled:hover:bg-info-600 active:enabled:bg-info-400",
      },
      {
        color: "success",
        variant: "solid",
        className:
          "[&>span>.loader]:text-muted-100 border border-success-500 bg-success-500 text-white enabled:hover:bg-success-600 active:enabled:bg-success-400",
      },
      {
        color: "warning",
        variant: "solid",
        className:
          "[&>span>.loader]:text-muted-100 border border-warning-500 bg-warning-500 text-white enabled:hover:bg-warning-600 active:enabled:bg-warning-400",
      },
      {
        color: "danger",
        variant: "solid",
        className:
          "[&>span>.loader]:text-muted-100 border border-danger-500 bg-danger-500 text-white enabled:hover:bg-danger-600 active:enabled:bg-danger-400",
      },
      {
        color: "default",
        variant: "pastel",
        className:
          "[&>span>.loader]:text-muted-500 dark:[&>span>.loader]:text-muted-200 border-none bg-muted-300/30 dark:bg-muted-300/10 text-muted-500 dark:text-muted-400 enabled:hover:bg-muted-300/60 dark:enabled:hover:bg-muted-300/20 active:enabled:bg-muted-300/30 dark:active:enabled:bg-muted-300/10",
      },

      {
        color: "contrast",
        variant: "pastel",
        className:
          "[&>span>.loader]:text-muted-500 dark:[&>span>.loader]:text-muted-200 border-none bg-muted-300/30 dark:bg-muted-300/10 text-muted-500 dark:text-muted-400 enabled:hover:bg-muted-300/60 dark:enabled:hover:bg-muted-300/20 active:enabled:bg-muted-300/30 dark:active:enabled:bg-muted-300/10",
      },
      {
        color: "muted",
        variant: "pastel",
        className:
          "[&>span>.loader]:text-muted-500 dark:[&>span>.loader]:text-muted-200 bg-muted-300/30 dark:bg-muted-300/10 text-muted-500 dark:text-muted-400 enabled:hover:bg-muted-300/60 dark:enabled:hover:bg-muted-300/20 active:enabled:bg-muted-300/30 dark:active:enabled:bg-muted-300/10",
      },
      {
        color: "primary",
        variant: "pastel",
        className:
          "[&>span>.loader]:text-primary-500 bg-primary-500/10 dark:bg-primary-500/20 text-primary-500 enabled:hover:bg-primary-500/20 dark:enabled:hover:bg-primary-500/30 active:enabled:bg-primary-500/10 dark:active:enabled:bg-primary-500/10",
      },
      {
        color: "info",
        variant: "pastel",
        className:
          "[&>span>.loader]:text-info-500 bg-info-500/10 dark:bg-info-500/20 text-info-500 enabled:hover:bg-info-500/20 dark:enabled:hover:bg-info-500/30 active:enabled:bg-info-500/10 dark:active:enabled:bg-info-500/10",
      },
      {
        color: "success",
        variant: "pastel",
        className:
          "[&>span>.loader]:text-success-500 bg-success-500/10 dark:bg-success-500/20 text-success-500 enabled:hover:bg-success-500/20 dark:enabled:hover:bg-success-500/30 active:enabled:bg-success-500/10 dark:active:enabled:bg-success-500/10",
      },
      {
        color: "warning",
        variant: "pastel",
        className:
          "[&>span>.loader]:text-warning-500 bg-warning-500/10 dark:bg-warning-500/20 text-warning-500 enabled:hover:bg-warning-500/20 dark:enabled:hover:bg-warning-500/30 active:enabled:bg-warning-500/10 dark:active:enabled:bg-warning-500/10",
      },
      {
        color: "danger",
        variant: "pastel",
        className:
          "[&>span>.loader]:text-danger-500 bg-danger-500/10 dark:bg-danger-500/20 text-danger-500 enabled:hover:bg-danger-500/20 dark:enabled:hover:bg-danger-500/30 active:enabled:bg-danger-500/10 dark:active:enabled:bg-danger-500/10",
      },
      {
        color: "default",
        variant: "outlined",
        className:
          "[&>span>.loader]:text-muted-500 dark:[&>span>.loader]:text-muted-200 border border-muted-300 dark:border-muted-700 text-muted-500 hover:bg-white hover:enabled:bg-muted-100 dark:hover:enabled:bg-muted-800 active:enabled:bg-muted-50 dark:active:enabled:bg-muted-700 hover:enabled:text-muted-600 dark:hover:enabled:text-muted-100",
      },
      {
        color: "contrast",
        variant: "outlined",
        className:
          "[&>span>.loader]:text-muted-500 dark:[&>span>.loader]:text-muted-200 border border-muted-300 dark:border-muted-700 text-muted-500 hover:bg-white hover:enabled:bg-muted-100 dark:hover:enabled:bg-muted-900 active:enabled:bg-muted-50 dark:active:enabled:bg-muted-900 hover:enabled:text-muted-600 dark:hover:enabled:text-muted-100",
      },
      {
        color: "muted",
        variant: "outlined",
        className:
          "[&>span>.loader]:text-muted-500 dark:[&>span>.loader]:text-muted-200 border border-muted-300 dark:border-muted-700 text-muted-500 hover:bg-white hover:enabled:bg-muted-100 dark:hover:enabled:bg-muted-800 active:enabled:bg-muted-50 dark:active:enabled:bg-muted-700 hover:enabled:text-muted-600 dark:hover:enabled:text-muted-100",
      },
      {
        color: "primary",
        variant: "outlined",
        className:
          "[&>span>.loader]:text-primary-500 border border-primary-500 text-primary-500 hover:bg-primary-500 active:enabled:bg-primary-400 hover:text-white",
      },
      {
        color: "info",
        variant: "outlined",
        className:
          "[&>span>.loader]:text-info-500 border border-info-500 text-info-500 hover:bg-info-500 active:enabled:bg-info-400 hover:text-white",
      },
      {
        color: "success",
        variant: "outlined",
        className:
          "[&>span>.loader]:text-success-500 border border-success-500 text-success-500 hover:bg-success-500 active:enabled:bg-success-400 hover:text-white",
      },
      {
        color: "warning",
        variant: "outlined",
        className:
          "[&>span>.loader]:text-warning-500 border border-warning-500 text-warning-500 hover:bg-warning-500 active:enabled:bg-warning-400 hover:text-white",
      },
      {
        color: "danger",
        variant: "outlined",
        className:
          "[&>span>.loader]:text-danger-500 border border-danger-500 text-danger-500 hover:bg-danger-500 active:enabled:bg-danger-400 hover:text-white",
      },
    ],

    defaultVariants: {
      color: "default",
      variant: "solid",
      shape: "smooth",
      shadow: "none",
    },
  }
);
