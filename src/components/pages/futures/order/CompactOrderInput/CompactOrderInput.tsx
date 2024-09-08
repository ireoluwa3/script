import { memo, useEffect, useState } from "react";
import Button from "@/components/elements/base/button/Button";
import CompactInput from "@/components/elements/form/input/compactInput";
import Select from "@/components/elements/form/select/Select";
import { capitalize } from "lodash";
import RangeSlider from "@/components/elements/addons/range-slider/RangeSlider";
import { useDashboardStore } from "@/stores/dashboard";
import { useFuturesOrderStore } from "@/stores/futures/order";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { AnimatedTooltip } from "@/components/elements/base/tooltips/AnimatedTooltip";
import useFuturesMarketStore from "@/stores/futures/market";
import { useTranslation } from "next-i18next";
import { toast } from "sonner";

const CompactOrderInputBase = ({ type }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { profile, getSetting } = useDashboardStore();
  const { market } = useFuturesMarketStore();
  const getPrecision = (type) => {
    const precision = Number(market?.precision?.[type] || 8);
    return Math.min(Math.max(precision, 0), 100);
  };

  const minAmount = Number(market?.limits?.amount?.min || 0);
  const maxAmount = Number(market?.limits?.amount?.max || 0);
  const minPrice = Number(market?.limits?.price?.min || 0);
  const maxPrice = Number(market?.limits?.price?.max || 0);
  const { placeOrder, currencyBalance, pairBalance, ask, bid } =
    useFuturesOrderStore();

  const leverageValues = market?.limits?.leverage
    ? market.limits.leverage.split(",").map(Number)
    : [1];

  const leverageOptions = leverageValues.map((value) => ({
    label: `${value}x`,
    value,
  }));

  const [amount, setAmount] = useState<number>(0);
  const [inputType, setInputType] = useState("AMOUNT");
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [price, setPrice] = useState<number>(0);
  const [percentage, setPercentage] = useState(0);
  const [leverage, setLeverage] = useState(leverageOptions[0].value);
  const [stopPrice, setStopPrice] = useState<number | undefined>(undefined);
  const [takeProfitPrice, setTakeProfitPrice] = useState<number | undefined>(
    undefined
  );

  const options =
    type === "MARKET"
      ? [
          { value: "AMOUNT", label: "Amount" },
          { value: "TOTAL", label: "Total" },
        ]
      : [];

  useEffect(() => {
    setPercentage(0);
    if (type === "MARKET") {
      setPrice(0);
    } else if (price === 0) {
      setPrice(side === "BUY" ? ask : bid);
    }
    setInputType("AMOUNT");
  }, [type, side, ask, bid]);

  const handleSliderChange = (value: number) => {
    setPercentage(value);
    let total = 0;
    const calculateTotal = (
      balance: number,
      divisor: number | null,
      precisionType: string
    ) =>
      parseFloat(
        ((balance * value) / 100 / (divisor || 1)).toFixed(
          getPrecision(precisionType)
        )
      );
    if (type === "MARKET") {
      if (side === "BUY") {
        total =
          inputType === "AMOUNT"
            ? calculateTotal(pairBalance, ask, "amount")
            : calculateTotal(pairBalance, null, "price");
      } else {
        total = calculateTotal(currencyBalance, null, "amount");
      }
    } else {
      if (side === "BUY") {
        total = calculateTotal(pairBalance, price, "amount");
      } else {
        total = calculateTotal(currencyBalance, null, "amount");
      }
    }
    setAmount(total);
  };

  const handlePlaceOrder = async () => {
    if (
      getSetting("tradeRestrictions") === "true" &&
      (!profile?.kyc?.status ||
        (parseFloat(profile?.kyc?.level || "0") < 2 &&
          profile?.kyc?.status !== "APPROVED"))
    ) {
      await router.push("/user/profile?tab=kyc");
      toast.error(t("Please complete your KYC to start trading"));
      return;
    }
    let calculatedAmount = amount;
    if (type === "MARKET" && inputType === "TOTAL")
      calculatedAmount = amount / (side === "BUY" ? ask : bid);

    await placeOrder(
      market?.currency,
      market?.pair,
      type,
      side,
      calculatedAmount,
      type === "MARKET" ? undefined : price,
      leverage,
      stopPrice,
      takeProfitPrice
    );

    setAmount(0);
    setPercentage(0);
    setStopPrice(undefined);
    setTakeProfitPrice(undefined);
  };

  return (
    <div className="flex flex-col gap-2 justify-between h-full w-full">
      <div className="flex flex-col w-full gap-3">
        <div className="text-xs -mx-4">
          <button
            className={`w-1/2 transition-all duration-300 translate-x-4 rounded-l-sm ${
              side === "BUY"
                ? "bg-success-500 text-white"
                : "bg-muted-100 dark:bg-muted-800 text-muted-500"
            } py-2`}
            style={{
              clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)",
            }}
            onClick={() => setSide("BUY")}
          >
            <span className="text-md font-heading">{t("Buy")}</span>
          </button>

          <button
            className={`w-1/2 transition-all duration-300 -translate-x-4 rounded-r-sm ${
              side === "SELL"
                ? "bg-danger-500 text-white"
                : "bg-muted-100 dark:bg-muted-800 text-muted-500"
            } py-2`}
            style={{
              clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)",
            }}
            onClick={() => setSide("SELL")}
          >
            <span className="text-md font-heading">{t("Sell")}</span>
          </button>
        </div>
        <div className="flex gap-1 justify-between items-center">
          <div className="flex gap-2 items-center">
            <span className="text-muted-400 dark:text-muted-400 text-xs">
              {t("Avbl")}{" "}
              {side === "BUY"
                ? pairBalance.toFixed(getPrecision("price"))
                : currencyBalance.toFixed(getPrecision("amount"))}{" "}
              {side === "BUY" ? market?.pair : market?.currency}
            </span>
            <AnimatedTooltip
              content={`Deposit ${
                side === "BUY" ? market?.pair : market?.currency
              }`}
            >
              <Link
                href={
                  profile?.id
                    ? "/user/wallet/deposit"
                    : "/login?return=/user/wallet/deposit"
                }
              >
                <Icon
                  icon="mdi:plus"
                  className="h-3 w-3 text-primary-500 cursor-pointer border border-primary-500 rounded-full hover:bg-primary-500 hover:text-white"
                />
              </Link>
            </AnimatedTooltip>
          </div>
          {type !== "MARKET" && (
            <span
              className="text-xs text-primary-500 dark:text-primary-400 cursor-pointer"
              onClick={() => setPrice(side === "BUY" ? ask : bid)}
            >
              {t("Best")} {side === "BUY" ? "Ask" : "Bid"}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <CompactInput
            type="number"
            className="input"
            placeholder={type === "MARKET" ? "Market" : price.toString()}
            label={t("Price")}
            postLabel={market?.pair}
            shape={"rounded-sm"}
            disabled={type === "MARKET"}
            value={type === "MARKET" ? "" : price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            min={minPrice}
            max={maxPrice}
            step={
              minPrice > 0 ? minPrice : Math.pow(10, -getPrecision("price"))
            }
          />
        </div>
        <div className="flex flex-col gap-1">
          <CompactInput
            type="number"
            className="input"
            placeholder="0.0"
            label={type === "MARKET" ? "" : "Amount"}
            postLabel={inputType === "AMOUNT" ? market?.currency : market?.pair}
            shape={"rounded-sm"}
            options={options}
            selected={inputType}
            setSelected={(value) => {
              setAmount(0);
              setPercentage(0);
              setInputType(value);
            }}
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            min={minAmount}
            max={maxAmount}
            step={
              minAmount > 0 ? minAmount : Math.pow(10, -getPrecision("amount"))
            }
          />
        </div>
        {type === "STOPLIMIT" && (
          <>
            <div className="flex flex-col">
              <CompactInput
                type="number"
                className="input"
                placeholder="0.0"
                label={t("Stop Price")}
                postLabel={market?.pair}
                shape={"rounded-sm"}
                value={stopPrice ?? ""}
                onChange={(e) =>
                  setStopPrice(parseFloat(e.target.value) || undefined)
                }
                min={minPrice}
                max={maxPrice}
                step={
                  minPrice > 0 ? minPrice : Math.pow(10, -getPrecision("price"))
                }
              />
            </div>
            <div className="flex flex-col">
              <CompactInput
                type="number"
                className="input"
                placeholder="0.0"
                label={t("Take Profit")}
                postLabel={market?.pair}
                shape={"rounded-sm"}
                value={takeProfitPrice ?? ""}
                onChange={(e) =>
                  setTakeProfitPrice(parseFloat(e.target.value) || undefined)
                }
                min={minPrice}
                max={maxPrice}
                step={
                  minPrice > 0 ? minPrice : Math.pow(10, -getPrecision("price"))
                }
              />
            </div>
          </>
        )}
        <div className="mt-2 mb-3">
          <RangeSlider
            legend
            min={0}
            max={100}
            steps={[0, 25, 50, 75, 100]}
            value={percentage}
            onSliderChange={handleSliderChange}
            color="warning"
            disabled={!profile?.id || (type !== "MARKET" && price === 0)}
          />
        </div>
      </div>
      <div className="flex gap-1 items-end">
        <div className="min-w-24">
          {leverageOptions.length > 1 ? (
            <Select
              label={t("Leverage")}
              options={leverageOptions}
              value={leverage}
              onChange={(e) => setLeverage(parseFloat(e.target.value))}
              shape={"rounded-sm"}
            />
          ) : (
            <CompactInput
              type="number"
              className="input"
              label={t("Leverage")}
              value={leverage}
              shape={"rounded-sm"}
              disabled
            />
          )}
        </div>
        <div className="w-full">
          <Button
            type="button"
            color={
              profile?.id ? (side === "BUY" ? "success" : "danger") : "muted"
            }
            animated={false}
            className="w-full"
            shape={"rounded-sm"}
            onClick={() => {
              if (profile?.id) {
                handlePlaceOrder();
              } else {
                router.push("/auth/login");
              }
            }}
          >
            {profile?.id ? (
              capitalize(side === "BUY" ? t("Long") : t("Short")) +
              " " +
              t("Position")
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
  );
};

export const CompactOrderInput = memo(CompactOrderInputBase);
