import { Icon } from "@iconify/react";
import useMarketStore from "@/stores/trade/market";
import { memo } from "react";

const MarketTabBase = () => {
  const { selectedPair, pairs, setSelectedPair } = useMarketStore();

  const uniquePairs = Array.from(new Set(pairs));

  return (
    <div className="relative p-2">
      <div
        className={`flex flex-col items-center overflow-auto scrollbar-hidden text-sm`}
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
    </div>
  );
};

export const MarketTab = memo(MarketTabBase);
