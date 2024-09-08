import React, { memo, useEffect, useState } from "react";
import { OrderProps } from "./Order.types";
import { useDashboardStore } from "@/stores/dashboard";
import { useBinaryOrderStore } from "@/stores/binary/order";
import useMarketStore from "@/stores/trade/market";
import { useTranslation } from "next-i18next";
import Input from "@/components/elements/form/input/Input";
import Button from "@/components/elements/base/button/Button";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";
import Card from "@/components/elements/base/card/Card";
import { formatTime, useBinaryCountdown } from "@/hooks/useBinaryCountdown";
import OrderDetails from "./OrderDetails";
import Portal from "@/components/elements/portal";
import { ClientTime } from "./ClientTime";
import { toast } from "sonner";
import useWebSocketStore from "@/stores/trade/ws";
import ToolTip from "@/components/elements/base/tooltips/Tooltip";
import { AnimatedTooltip } from "@/components/elements/base/tooltips/AnimatedTooltip";
const binaryProfit = parseFloat(process.env.NEXT_PUBLIC_BINARY_PROFIT || "87");

const OrderBase = ({}: OrderProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { profile, getSetting } = useDashboardStore();

  const {
    fetchWallet,
    placeOrder,
    openOrders,
    orderInProcess,
    loading,
    setPracticeBalance,
    updatePracticeBalance,
    removeOrder,
    wallet,
    getPracticeBalance,
  } = useBinaryOrderStore();

  const {
    orderConnection,
    createConnection,
    removeConnection,
    addMessageHandler,
    removeMessageHandler,
    subscribe,
    unsubscribe,
  } = useWebSocketStore();

  const { market } = useMarketStore();
  const minAmount = Number(market?.limits?.amount?.min || 0);
  const maxAmount = Number(market?.limits?.amount?.max || 0);
  const { expirations, expiry, setExpiry } = useBinaryCountdown();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const isPractice = router.query.practice === "true";

  useEffect(() => {
    if (isPractice && market?.currency && market?.pair) {
      setPracticeBalance(
        market.currency,
        market.pair,
        getPracticeBalance(market.currency, market.pair)
      ); // Initialize practice balance
    }
  }, [
    isPractice,
    setPracticeBalance,
    getPracticeBalance,
    market?.currency,
    market?.pair,
  ]);

  const handleOrderMessage = (message: any) => {
    if (message.type !== "ORDER_COMPLETED") return;
    const { order } = message;
    if (!order) return;

    const amount = order.amount;
    const profitPercentage = order.profit || binaryProfit;
    const profit = amount * (profitPercentage / 100);
    if (order.status === "WIN") {
      toast.success(`You won ${profit.toFixed(2)}`);
    } else if (order.status === "LOSS") {
      toast.error(`You lost ${amount.toFixed(2)}`);
    } else if (order.status === "DRAW") {
      toast.info(`Order ended in a draw`);
    }

    if (isPractice && market?.currency && market?.pair) {
      if (order.status === "WIN") {
        updatePracticeBalance(
          market.currency,
          market.pair,
          amount + profit,
          "add"
        );
      } else if (order.status === "LOSS") {
        updatePracticeBalance(market.currency, market.pair, 0);
      } else if (order.status === "DRAW") {
        updatePracticeBalance(market.currency, market.pair, amount, "add");
      }
    } else {
      fetchWallet(order.symbol.split("/")[1]);
    }
    removeOrder(order.id);
  };

  const balance =
    isPractice && market?.currency && market?.pair
      ? getPracticeBalance(market.currency, market.pair)
      : wallet?.balance || 0;

  const [orderConnectionReady, setOrderConnectionReady] = useState(false);

  useEffect(() => {
    if (router.isReady) {
      const path = `/api/exchange/binary/order`;
      createConnection("orderConnection", path);
      setOrderConnectionReady(true);
      return () => {
        if (!router.query.symbol) {
          removeConnection("orderConnection");
        }
      };
    }
  }, [router.isReady]);

  useEffect(() => {
    if (orderConnectionReady && orderConnection?.isConnected) {
      if (market?.symbol) {
        subscribe("orderConnection", "order", { symbol: market.symbol });
        return () => {
          unsubscribe("orderConnection", "order", { symbol: market.symbol });
        };
      }
    }
  }, [
    orderConnectionReady,
    orderConnection?.isConnected,
    market?.symbol,
    subscribe,
    unsubscribe,
  ]);

  useEffect(() => {
    if (orderConnectionReady && orderConnection?.isConnected) {
      addMessageHandler("orderConnection", handleOrderMessage);
      return () => {
        removeMessageHandler("orderConnection", handleOrderMessage);
      };
    }
  }, [
    orderConnectionReady,
    orderConnection?.isConnected,
    addMessageHandler,
    removeMessageHandler,
  ]);

  const handlePlaceOrder = async (side: "RISE" | "FALL") => {
    if (
      getSetting("binaryRestrictions") === "true" &&
      (!profile?.kyc?.status ||
        (parseFloat(profile?.kyc?.level || "0") < 2 &&
          profile?.kyc?.status !== "APPROVED"))
    ) {
      await router.push("/user/profile?tab=kyc");
      toast.error(t("Please complete your KYC to trade binary options"));
      return;
    }

    const closedAt = expiry.expirationTime.toISOString();
    if (amount <= 0) {
      toast.error(t("Please enter a valid amount"));
      return;
    }

    await placeOrder(
      market.currency,
      market.pair,
      side,
      amount,
      closedAt,
      isPractice
    );

    setExpiry(
      expirations.find(
        (exp) =>
          (exp.expirationTime.getTime() - new Date().getTime()) / 1000 > 15
      ) || expirations[0]
    );
  };

  return (
    <>
      <div className="flex gap-3 md:overflow-x-auto flex-col justify-between p-4 md:p-2">
        <div className="flex md:flex-col gap-3 items-end">
          <div className="w-full">
            <Input
              type="number"
              label={t("Amount")}
              value={amount}
              shape={"rounded"}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={minAmount}
              max={maxAmount}
              step={minAmount}
              disabled={orderInProcess || balance <= 0}
            />
          </div>
          <div className="relative w-full">
            <label className="font-sans text-[.68rem] text-muted-400">
              {t("Expiration")}
            </label>
            <button
              type="button"
              className="w-full text-left p-2 border text-sm rounded-md bg-white dark:bg-muted-800 border-muted-200 dark:border-muted-700 text-muted-700 dark:text-muted-200"
              onClick={() => setIsModalOpen(!isModalOpen)}
            >
              <ClientTime expiry={expiry} />
            </button>
          </div>
        </div>
        <div className="text-lg font-bold text-center text-success-500">
          <span className="text-4xl">{binaryProfit}</span>%
        </div>
        <div className="flex md:flex-col gap-2 items-center justify-center">
          <div className="w-full">
            <Button
              type="button"
              color={profile?.id ? "success" : "muted"}
              animated={false}
              shape={"rounded"}
              className="h-20 w-full"
              onClick={() => {
                if (profile?.id) {
                  handlePlaceOrder("RISE");
                } else {
                  router.push("/login");
                }
              }}
              loading={loading}
              disabled={
                orderInProcess ||
                balance <= 0 ||
                amount <= 0 ||
                amount < minAmount ||
                amount > maxAmount
              }
            >
              {profile?.id ? (
                <span className="text-md flex md:flex-col items-center gap-2 md:gap-0">
                  {t("Rise")}
                  <Icon icon="ant-design:rise-outlined" className="h-8 w-8" />
                </span>
              ) : (
                <div className="flex gap-2 flex-col">
                  <span className="text-warning-500">{t("Log In")}</span>
                  <span>{t("or")}</span>
                  <span className="text-warning-500">{t("Register Now")}</span>
                </div>
              )}
            </Button>
          </div>
          <div className="w-full">
            <Button
              type="button"
              color={profile?.id ? "danger" : "muted"}
              animated={false}
              shape={"rounded"}
              className="h-20 w-full"
              onClick={() => {
                if (profile?.id) {
                  handlePlaceOrder("FALL");
                } else {
                  router.push("/login");
                }
              }}
              loading={loading}
              disabled={
                orderInProcess ||
                balance <= 0 ||
                amount <= 0 ||
                amount < minAmount ||
                amount > maxAmount
              }
            >
              {profile?.id ? (
                <span className="text-md flex md:flex-col items-center gap-2">
                  {t("Fall")}
                  <Icon icon="ant-design:fall-outlined" className="h-8 w-8" />
                </span>
              ) : (
                <div className="flex gap-2">
                  <span className="text-warning-500">{t("Log In")}</span>
                  <span>{t("or")}</span>
                  <span className="text-warning-500">{t("Register Now")}</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <Portal onClose={() => setIsModalOpen(!isModalOpen)}>
          <Card className="max-w-md p-5">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-muted-700 dark:text-muted-300">
                {t("Expiry Time")}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {expirations.map((exp) => {
                const timeLeft = Math.round(
                  (exp.expirationTime.getTime() - new Date().getTime()) / 1000
                );
                const isDisabled = timeLeft < 15;
                return (
                  <button
                    key={exp.minutes}
                    type="button"
                    className={`w-full flex justify-between min-w-64 text-left p-2 mb-2 text-md border rounded transition-colors ${
                      isDisabled
                        ? "text-danger-500 border-danger-500 cursor-not-allowed dark:text-danger-500 dark:border-danger-500"
                        : "hover:bg-muted-100 dark:hover:bg-muted-700 text-muted-700 dark:text-muted-200 border-muted-200 dark:border-muted-700"
                    } ${
                      expiry.minutes === exp.minutes
                        ? "bg-muted-200 dark:bg-muted-700"
                        : ""
                    }`}
                    onClick={() => {
                      if (!isDisabled) {
                        setExpiry(exp);
                        setIsModalOpen(false);
                      }
                    }}
                    disabled={isDisabled}
                  >
                    <span>
                      {exp.minutes} {t("min")}
                    </span>{" "}
                    <span>({formatTime(timeLeft)})</span>
                  </button>
                );
              })}
            </div>
          </Card>
        </Portal>
      )}
      {openOrders.length > 0 &&
        openOrders.map((order) => (
          <OrderDetails
            key={order.id}
            orderId={order.id}
            currency={market.currency}
            pair={market.pair}
            price={order.price}
            side={order.side}
            createdAt={order.createdAt}
            closedAt={order.closedAt}
            amount={order.amount}
            isPractice={isPractice}
          />
        ))}
    </>
  );
};

export const Order = memo(OrderBase);
