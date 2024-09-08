import { memo } from "react";
import { TickerProps } from "./Ticker.types";
import useMarketStore from "@/stores/trade/market";
import Card from "@/components/elements/base/card/Card";

const TickerBase = ({}: TickerProps) => {
  const { market, priceChangeData } = useMarketStore();
  return (
    priceChangeData[`${market?.symbol}`] && (
      <div className="flex items-center gap-2">
        <Card className="p-[1px] px-3 flex flex-col text-xs" shape={"rounded"}>
          <span className="text-muted-500 dark:text-muted-400">
            {market?.symbol}
          </span>
          <span className="text-mutted-800 dark:text-muted-200 text-sm">
            {priceChangeData[`${market?.symbol}`].price}
          </span>
        </Card>
      </div>
    )
  );
};

export const Ticker = memo(TickerBase);
