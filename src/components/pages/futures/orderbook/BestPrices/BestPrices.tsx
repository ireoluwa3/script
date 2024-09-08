import { memo, useEffect } from "react";
import { useFuturesOrderStore } from "@/stores/futures/order";
import useMarketStore from "@/stores/futures/market";
import { useTranslation } from "next-i18next";
const BestPricesBase = ({ bestAsk, bestBid }) => {
  const { t } = useTranslation();
  const { setAsk, setBid } = useFuturesOrderStore();
  useEffect(() => {
    setAsk(bestAsk);
    setBid(bestBid);
  }, [bestAsk, bestBid]);
  const { market } = useMarketStore();
  const getPrecision = (type) => Number(market?.precision?.[type] || 8);
  return (
    <div className="text-center text-base p-2 text-white flex justify-between items-center">
      <div className="flex items-center gap-1">
        <span className="text-sm text-muted-600 dark:text-muted-400 font-semibold">
          {t("Ask")}
        </span>{" "}
        <span className="text-danger-500 text-lg">
          {bestAsk?.toFixed(getPrecision("price"))}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-sm text-muted-600 dark:text-muted-400 font-semibold">
          {t("Bid")}
        </span>{" "}
        <span className="text-success-500 text-lg">
          {bestBid?.toFixed(getPrecision("price"))}
        </span>
      </div>
    </div>
  );
};
export const BestPrices = memo(BestPricesBase);
