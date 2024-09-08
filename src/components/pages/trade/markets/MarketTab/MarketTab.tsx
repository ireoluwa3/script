import { useEffect } from "react";
import { Icon } from "@iconify/react";
import useMarketStore from "@/stores/trade/market";
import { memo, useRef, useState } from "react";

const MarketTabBase = () => {
  const { selectedPair, pairs, setSelectedPair } = useMarketStore();

  const uniquePairs = Array.from(new Set(pairs));

  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkForOverflow = () => {
    const container = containerRef.current;
    if (!container) return;
    setCanScrollLeft(container.scrollLeft > 1);
    setCanScrollRight(
      Math.ceil(container.scrollLeft + container.clientWidth) <
        container.scrollWidth - 1
    );
  };

  const scrollRight = () => {
    containerRef.current?.scrollBy({ left: 100, behavior: "smooth" });
  };

  const scrollLeft = () => {
    containerRef.current?.scrollBy({ left: -100, behavior: "smooth" });
  };

  useEffect(() => {
    const handleResize = () => {
      checkForOverflow();
    };
    window.addEventListener("resize", handleResize);
    checkForOverflow();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [uniquePairs]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      setCanScrollLeft(container.scrollLeft > 1);
      setCanScrollRight(
        Math.ceil(container.scrollLeft + container.clientWidth) <
          container.scrollWidth - 1
      );
    };
    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="relative p-2">
      {canScrollLeft && (
        <Icon
          icon="heroicons-outline:chevron-left"
          className="absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer text-muted-400 dark:text-muted-500 pb-[2px]"
          onClick={scrollLeft}
        />
      )}
      <div
        ref={containerRef}
        className={`flex items-center overflow-auto scrollbar-hidden text-sm ${
          canScrollLeft ? "ms-4" : ""
        } ${canScrollRight ? "me-4" : ""}`}
      >
        <span className="cursor-pointer z-1">
          <Icon
            onClick={() => setSelectedPair("WATCHLIST")}
            className={`h-4 w-4 mb-[2.5px] me-1 ${
              selectedPair === "WATCHLIST"
                ? "text-warning-500"
                : "text-muted-400"
            }`}
            icon={"uim:favorite"}
          />
        </span>
        {uniquePairs.map((pair) => (
          <span
            key={pair}
            onClick={() => setSelectedPair(pair)}
            className={`px-2 py-1 ${
              pair === selectedPair
                ? "text-warning-500 dark:text-warning-400 bg-muted-100 dark:bg-muted-900 rounded-md"
                : "text-muted-400 dark:text-muted-500 hover:text-muted-500 dark:hover:text-muted-500"
            } cursor-pointer`}
          >
            {pair}
          </span>
        ))}
      </div>
      {canScrollRight && (
        <Icon
          icon="heroicons-outline:chevron-right"
          className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer text-muted-400 dark:text-muted-500 pb-[2px]"
          onClick={scrollRight}
        />
      )}
    </div>
  );
};

export const MarketTab = memo(MarketTabBase);
