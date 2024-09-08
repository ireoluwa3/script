import { memo, useEffect, useState } from "react";
import Button from "@/components/elements/base/button/Button";
import CompactInput from "@/components/elements/form/input/compactInput";
import { capitalize } from "lodash";
import RangeSlider from "@/components/elements/addons/range-slider/RangeSlider";
import { useDashboardStore } from "@/stores/dashboard";
import { useOrderStore } from "@/stores/trade/order";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { AnimatedTooltip } from "@/components/elements/base/tooltips/AnimatedTooltip";
import useMarketStore from "@/stores/trade/market";
import { useTranslation } from "next-i18next";
import { toast } from "sonner";
const OrderInputBase = ({ type, side }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { profile, getSetting } = useDashboardStore();
  const { market } = useMarketStore();
  const getPrecision = (type) => Number(market?.precision?.[type] || 8);
  const minAmount = Number(market?.limits?.amount?.min || 0);
  const maxAmount = Number(market?.limits?.amount?.max || 0);
  const minPrice = Number(market?.limits?.price?.min || 0);
  const maxPrice = Number(market?.limits?.price?.max || 0);
  const { placeOrder, currencyBalance, pairBalance, ask, bid } =
    useOrderStore();
  const [amount, setAmount] = useState<number>(0);
  const options =
    type === "MARKET"
      ? [
          { value: "AMOUNT", label: "Amount" },
          { value: "TOTAL", label: "Total" },
        ]
      : [];
  const [inputType, setInputType] = useState("AMOUNT");
  const [price, setPrice] = useState<any>(0);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    setPercentage(0);
    if (type === "MARKET") {
      setPrice(0);
    } else {
      setPrice(side === "BUY" ? ask : bid);
    }
    setInputType("AMOUNT");
  }, [type]);

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
      market.isEco,
      market?.currency,
      market?.pair,
      type,
      side,
      calculatedAmount,
      price
    );
    if (type !== "MARKET") {
      setPrice(0);
    }
    setAmount(0);
    setPercentage(0);
  };

  return (
    <div className="flex flex-col gap-2 justify-between h-full w-full">
      <div className="flex flex-col w-full gap-3">
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
            onChange={(e) => setPrice(e.target.value)}
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
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            min={minAmount}
            max={maxAmount}
            step={
              minAmount > 0 ? minAmount : Math.pow(10, -getPrecision("amount"))
            }
          />
        </div>
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
      <div className="flex flex-col gap-1">
        <Button
          type="button"
          color={
            profile?.id ? (side === "BUY" ? "success" : "danger") : "muted"
          }
          animated={false}
          className="w-full"
          shape={"rounded-sm"}
          disabled={
            !profile?.id ||
            (type !== "MARKET" && price === 0) ||
            amount === 0 ||
            !amount
          }
          onClick={() => {
            if (profile?.id) {
              handlePlaceOrder();
            } else {
              router.push("/auth/login");
            }
          }}
        >
          {profile?.id ? (
            capitalize(side) + " " + market?.currency
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
  );
};
export const OrderInput = memo(OrderInputBase);
