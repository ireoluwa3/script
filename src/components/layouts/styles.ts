import { LayoutType } from "@/stores/layout";

export const layoutWrapperClasses: Record<LayoutType, string> = {
  "sidebar-panel":
    "lg:ms-20 lg:w-[calc(100%_-_64px)] pt-16 px-4 ptablet:px-6 ltablet:px-6 lg:px-12 pb-20",
  "sidebar-panel-float":
    "lg:ms-20 lg:w-[calc(100%_-_80px)] pt-16 px-4 ptablet:px-6 ltablet:px-6 lg:px-12 pb-20",

  // "sidebar-collapse": "pt-16 px-4 ptablet:px-6 ltablet:px-6 lg:px-12 pb-20",
  // sideblock: "pt-16 px-4 ptablet:px-6 ltablet:px-6 lg:px-12 pb-20",
  "top-navigation":
    "pt-16 lg:pt-4 px-4 ptablet:px-6 ltablet:px-6 lg:px-12 pb-20",
};

export const panelWrapperClasses: Record<LayoutType, string> = {
  "sidebar-panel": "lg:ms-20 lg:w-[calc(100%_-_64px)]",
  "sidebar-panel-float": "lg:ps-20 lg:w-[calc(100%_-_80px)]",

  // "sidebar-collapse": "",
  // sideblock: "",
  "top-navigation": "",
};

export const layoutPushedClasses: Record<LayoutType, string> = {
  "sidebar-panel": "translate-x-[250px]",
  "sidebar-panel-float": "translate-x-[250px]",
  // "sidebar-collapse": "lg:ms-[224px] lg:w-[calc(100%_-_224px)]",
  // sideblock: "lg:ms-[224px] lg:w-[calc(100%_-_224px)]",
  "top-navigation": "",
};

export const layoutNotPushedClasses: Record<LayoutType, string> = {
  "sidebar-panel": "",
  "sidebar-panel-float": "",
  // "sidebar-collapse": "lg:ms-[64px] lg:w-[calc(100%_-_64px)]",
  // sideblock: "",
  "top-navigation": "",
};
