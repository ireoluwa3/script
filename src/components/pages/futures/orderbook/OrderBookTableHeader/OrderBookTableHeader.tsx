import { memo } from "react";
import { OrderBookTableHeaderProps } from "./OrderBookTableHeader.types";
import { useTranslation } from "next-i18next";
import useMarketStore from "@/stores/futures/market";
const OrderBookTableHeaderBase = ({}: OrderBookTableHeaderProps) => {
  const { t } = useTranslation();
  const { market } = useMarketStore();
  return (
    <>
      <div className="flex w-full">
        <div className="flex justify-between p-2 bg-muted-100 dark:bg-muted-900 text-muted-800 dark:text-muted-200 w-full">
          <span className="w-[50%] cursor-default">
            {t("Price")}({market?.pair})
          </span>
          <span className="w-[20%] cursor-default hidden sm:block">
            {t("Amount")}({market?.currency})
          </span>
          <span className="w-[30%] text-end cursor-default">{t("Total")}</span>
        </div>

        <div className="flex justify-between p-2 bg-muted-100 dark:bg-muted-900 text-muted-800 dark:text-muted-200 w-full md:hidden">
          <span className="w-[50%] cursor-default">
            {t("Price")}({market?.pair})
          </span>
          <span className="w-[20%] cursor-default hidden sm:block">
            {t("Amount")}({market?.currency})
          </span>
          <span className="w-[30%] text-end cursor-default">{t("Total")}</span>
        </div>
      </div>
    </>
  );
};
export const OrderBookTableHeader = memo(OrderBookTableHeaderBase);
