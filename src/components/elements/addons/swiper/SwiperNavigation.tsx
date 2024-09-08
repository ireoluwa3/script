import React from "react";
import { Icon } from "@iconify/react";
import { useSwiper } from "swiper/react";

export default function SwiperNavigation() {
  const swiper = useSwiper();

  return (
    <div className="absolute start-4 top-4 z-10 flex items-center justify-between">
      <button
        type="button"
        className="relative z-30 flex h-10 w-10 cursor-pointer items-center justify-center rounded-s-lg border border-muted-200 bg-white text-muted-500 transition-colors duration-300 ease-in-out hover:enabled:bg-muted-100 hover:enabled:text-muted-700 active:enabled:bg-muted-50 dark:border-muted-800 dark:bg-muted-950 dark:hover:enabled:bg-muted-900 dark:hover:enabled:text-muted-100 dark:active:enabled:bg-muted-800"
        onClick={() => swiper.slidePrev()}
      >
        <Icon icon="lucide:arrow-left" className="h-4 w-4" />
      </button>
      <button
        type="button"
        className="relative z-30 flex h-10 w-10 cursor-pointer items-center justify-center rounded-e-lg border border-muted-200 bg-white text-muted-500 transition-colors duration-300 ease-in-out hover:enabled:bg-muted-100 hover:enabled:text-muted-700 active:enabled:bg-muted-50 dark:border-muted-800 dark:bg-muted-950 dark:hover:enabled:bg-muted-900 dark:hover:enabled:text-muted-100 dark:active:enabled:bg-muted-800"
        onClick={() => swiper.slideNext()}
      >
        <Icon icon="lucide:arrow-right" className="h-4 w-4" />
      </button>
    </div>
  );
}
