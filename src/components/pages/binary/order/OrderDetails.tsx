import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import Progress from "@/components/elements/base/progress/Progress";
import Card from "@/components/elements/base/card/Card";
import { useBinaryOrderStore } from "@/stores/binary/order";
import useMarketStore from "@/stores/trade/market";
import { formatTime } from "@/hooks/useBinaryCountdown";
import Button from "@/components/elements/base/button/Button";
import { capitalize } from "lodash";
const binaryProfit = parseFloat(process.env.NEXT_PUBLIC_BINARY_PROFIT || "87");
type OrderDetailsProps = {
  price: number;
  currency: string;
  pair: string;
  side: "RISE" | "FALL";
  createdAt: string;
  closedAt: string;
  amount: number;
  orderId: string;
  isPractice?: boolean;
};
const OrderDetails = ({
  currency,
  pair,
  price,
  side,
  createdAt,
  closedAt,
  amount,
  orderId,
  isPractice,
}: OrderDetailsProps) => {
  const { t } = useTranslation();
  const { cancelOrder, updatePracticeBalance } = useBinaryOrderStore();
  const { priceChangeData } = useMarketStore();
  const [timeLeft, setTimeLeft] = useState(
    Math.max(0, (new Date(closedAt).getTime() - new Date().getTime()) / 1000)
  );
  const [progress, setProgress] = useState(0);
  const [profit, setProfit] = useState(0);
  const totalTime =
    (new Date(closedAt).getTime() - new Date(createdAt).getTime()) / 1000;
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      const totalSeconds = Math.max(
        0,
        (new Date(closedAt).getTime() - currentTime) / 1000
      );
      const elapsedSeconds = totalTime - totalSeconds;
      const progressPercentage = Math.max(
        0,
        (elapsedSeconds / totalTime) * 100
      );
      setTimeLeft(totalSeconds);
      setProgress(progressPercentage);
      const currentPrice =
        priceChangeData[`${currency}/${pair}`]?.price || price;
      let profit = 0;
      if (side === "RISE") {
        if (currentPrice > price) {
          profit = amount * (binaryProfit / 100);
        } else {
          profit = -amount;
        }
      } else if (side === "FALL") {
        if (currentPrice < price) {
          profit = amount * (binaryProfit / 100);
        } else {
          profit = -amount;
        }
      }
      // Calculate profit based on progress, except for the last 15 seconds
      if (totalSeconds > 15) {
        profit = profit * (progressPercentage / 100);
      } else {
        // Show full profit or loss in the last 15 seconds
        profit = profit > 0 ? amount * (binaryProfit / 100) : -amount;
      }
      setProfit(profit);
      if (totalSeconds <= 0) {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [
    closedAt,
    amount,
    totalTime,
    priceChangeData,
    currency,
    pair,
    side,
    price,
  ]);
  const profitColor =
    profit > 0
      ? "text-green-500"
      : profit < 0
      ? "text-red-500"
      : "text-muted-500";
  const currentPriceColor =
    side === "RISE"
      ? priceChangeData[`${currency}/${pair}`]?.price > price
        ? "text-green-500"
        : "text-red-500"
      : priceChangeData[`${currency}/${pair}`]?.price < price
      ? "text-green-500"
      : "text-red-500";
  return (
    <div className="absolute top-5 left-5 text-md max-w-xs w-64 text-muted-800 dark:text-muted-200">
      <Card className="p-4" shadow={"flat"}>
        <p>
          {t("Start Price")}: {price}
        </p>
        <p className={currentPriceColor}>
          {t("Current Price")}:{" "}
          {priceChangeData[`${currency}/${pair}`]?.price || price}
        </p>
        <p>
          {t("Side")}: {capitalize(side)}
        </p>
        <p>
          {t("Ends in")}: {formatTime(timeLeft)}
        </p>
        <Progress size="xs" value={progress} />
        <p className={`mt-2 ${profitColor}`}>
          {t("Profit")}: {profit.toFixed(2)}
        </p>
        {/* <Button
          type="button"
          className="mt-2 w-full"
          onClick={() => cancelOrder(orderId, pair, isPractice, amount)}
          disabled={timeLeft <= 15}
          loading={timeLeft <= 1}
          color="primary"
          size="sm"
          shape="rounded"
        >
          {t("Close Order")}
        </Button> */}
      </Card>
    </div>
  );
};
export default OrderDetails;
