import { memo } from "react";
import { TradesTableHeaderProps } from "./TradesTableHeader.types";
import { useTranslation } from "next-i18next";
import useMarketStore from "@/stores/trade/market";
const TradesTableHeaderBase = ({}: TradesTableHeaderProps) => {
  const { t } = useTranslation();
  const { market } = useMarketStore();
  return (
    <div className="flex justify-between p-2 bg-muted-100 dark:bg-muted-900 text-muted-800 dark:text-muted-200 text-xs">
      <span className="w-[40%] cursor-default">
        {t("Price")}({market?.pair})
      </span>
      <span className="w-[40%] cursor-default">
        {t("Amount")}({market?.currency})
      </span>
      <span className="w-[20%] cursor-default">{t("Time")}</span>
    </div>
  );
};
export const TradesTableHeader = memo(TradesTableHeaderBase);
