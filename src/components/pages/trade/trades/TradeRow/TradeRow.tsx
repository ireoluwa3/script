import { memo } from "react";
import { TradeRowProps } from "./TradeRow.types";
import useMarketStore from "@/stores/trade/market";

const TradeRowBase = ({ trade }: TradeRowProps) => {
  const { market } = useMarketStore();
  const getPrecision = (type) => Number(market?.precision?.[type] || 8);
  return (
    <div
      className={`text-sm flex gap-2 ${
        trade?.side === "buy" ? "text-success-500" : "text-danger-500"
      }`}
    >
      <span className="w-[40%]">
        {trade?.price.toFixed(getPrecision("price"))}
      </span>
      <span className="w-[40%]">
        {trade?.amount.toFixed(getPrecision("amount"))}
      </span>
      <span className="w-[20%]">{trade?.time}</span>
    </div>
  );
};

export const TradeRow = memo(TradeRowBase);
