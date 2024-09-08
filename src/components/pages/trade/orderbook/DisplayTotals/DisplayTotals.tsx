import { memo } from "react";
import { useTranslation } from "next-i18next";
const calculateTotals = (
  orders: {
    price: number;
    amount: number;
    total: number;
  }[],
  startIndex: number | null,
  type: "ask" | "bid"
) => {
  if (startIndex === null) {
    return { avgPrice: 0, sumCurrency: 0, sumPair: 0 }; // Return zeros or another appropriate default value
  }
  const selectedOrders = orders.slice(0, startIndex + 1);
  const sumCurrency = selectedOrders.reduce((acc, cur) => acc + cur.amount, 0);
  const sumPair = selectedOrders.reduce((acc, cur) => acc + cur.total, 0);
  const avgPrice = sumCurrency > 0 ? sumPair / sumCurrency : 0; // Check to prevent division by zero
  return { avgPrice, sumCurrency, sumPair };
};
const DisplayTotalsBase = ({
  currency,
  pair,
  orderBook,
  hoveredIndex,
  hoveredType,
  cardPosition,
  isHovered,
}) => {
  const { t } = useTranslation();
  if (hoveredType) {
    const totals = calculateTotals(
      hoveredType === "ask" ? orderBook.asks : orderBook.bids,
      hoveredType === "ask" ? hoveredIndex.ask : hoveredIndex.bid,
      hoveredType
    );
    return (
      <div
        className={`hover-card ${
          isHovered ? "visible" : ""
        } fixed p-2 border-l-2 z-20 border-primary-500 dark:border-primary-400 bg-muted-100 dark:bg-muted-900 text-muted-800 dark:text-muted-200 rounded-[.65rem] before:end-full after:end-full before:pointer-events-none before:absolute before:top-[20px] before:-mt-[9px] before:h-0 before:w-0 before:border-[9px] before:border-transparent after:pointer-events-none after:absolute after:top-[18px] after:-mt-2 after:h-0 after:w-0 after:border-[8px] after:border-transparent before:border-r-primary-500 after:border-r-primary-500  dark:before:border-r-primary-400 dark:after:border-r-primary-400 max-w-[80%] min-w-[15%]`}
        style={{
          top: cardPosition?.top - (hoveredType === "ask" ? 20 : 0),
          left: cardPosition?.left,
        }}
      >
        <div>
          {t("Avg Price")} {totals.avgPrice.toFixed(2)}
        </div>
        <div>
          {t("Sum")} {currency}: {totals.sumCurrency.toFixed(4)}
        </div>
        <div>
          {t("Sum")} {pair}: {totals.sumPair.toFixed(2)}
        </div>
      </div>
    );
  }
  return null;
};
export const DisplayTotals = memo(DisplayTotalsBase);
