import { memo, useEffect, useState } from "react";
import Button from "@/components/elements/base/button/Button";
import CompactInput from "@/components/elements/form/input/compactInput";
import RangeSlider from "@/components/elements/addons/range-slider/RangeSlider";
import { useDashboardStore } from "@/stores/dashboard";
import { useOrderStore } from "@/stores/trade/order";
import { useRouter } from "next/router";
import useMarketStore from "@/stores/trade/market";
import ListBox from "@/components/elements/form/listbox/Listbox";
import { useTranslation } from "next-i18next";
import { toast } from "sonner";

const AiInvestmentInputBase = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { profile, getSetting } = useDashboardStore();
  const { market } = useMarketStore();
  const getPrecision = (type) => Number(market?.precision?.[type] || 8);
  const { loading, aiPlans, placeAiInvestmentOrder, pairBalance } =
    useOrderStore();
  const [selectedDuration, setSelectedDuration] = useState<any>(null);
  const [amount, setAmount] = useState<number>(0);
  const [percentage, setPercentage] = useState(0);
  const [selectedPlanId, setSelectedPlanId] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  useEffect(() => {
    if (selectedPlanId) {
      setSelectedPlan(aiPlans.find((plan) => plan.id === selectedPlanId.value));
    }
    setPercentage(0);
    setAmount(0);
    setSelectedDuration(null);
  }, [selectedPlanId]);

  const handleSliderChange = (value: number) => {
    setPercentage(value);
    const total = (pairBalance * value) / 100;
    setAmount(total);
  };

  const handlePlaceInvestment = async () => {
    if (
      getSetting("aiInvestmentRestrictions") === "true" &&
      (!profile?.kyc?.status ||
        (parseFloat(profile?.kyc?.level || "0") < 2 &&
          profile?.kyc?.status !== "APPROVED"))
    ) {
      await router.push("/user/profile?tab=kyc");
      toast.error(t("Please complete your KYC to invest in AI Bots"));
      return;
    }
    if (!selectedPlanId || !selectedDuration) return;
    await placeAiInvestmentOrder(
      selectedPlanId.value,
      selectedDuration.value,
      market,
      amount
    );
    setSelectedPlanId(null);
    setSelectedDuration(null);
    setAmount(0);
    setPercentage(0);
    setSelectedPlan(null);
  };

  return (
    <div className="flex flex-col gap-2 justify-between h-full w-full">
      <div className="flex flex-col w-full gap-3">
        <div className="flex gap-1 justify-between items-center">
          <div className="flex gap-2 items-center">
            <span className="text-muted-400 dark:text-muted-400 text-xs">
              {t("Avbl")} {pairBalance.toFixed(getPrecision("price"))}{" "}
              {market?.pair}
            </span>
          </div>
        </div>
        <div className="flex gap-4">
          <ListBox
            selected={selectedPlanId}
            options={aiPlans.map((plan) => ({
              value: plan.id,
              label: plan.title,
            }))}
            setSelected={setSelectedPlanId}
            placeholder={t("Select a Plan")}
            disabled={loading}
            loading={loading}
            shape={"rounded-sm"}
          />
          <ListBox
            selected={selectedDuration}
            options={selectedPlan?.durations?.map((duration) => ({
              value: duration.id,
              label: `${duration.duration} ${duration.timeframe}`,
            }))}
            setSelected={setSelectedDuration}
            placeholder={t("Select a Duration")}
            disabled={loading || !selectedPlan?.durations}
            loading={loading}
            shape={"rounded-sm"}
          />
        </div>

        <div className="flex flex-col gap-1">
          <CompactInput
            type="number"
            className="input"
            placeholder="0.0"
            label={t("Amount")}
            postLabel={market?.pair}
            shape={"rounded-sm"}
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value))}
            min={selectedPlan?.minAmount}
            max={selectedPlan?.maxAmount}
            disabled={loading || !selectedPlan}
            loading={loading}
          />
        </div>
        <div className="text-xs text-muted-400 dark:text-muted-400 flex justify-between gap-5">
          <p>
            {t("Min Amount")}: {selectedPlan?.minAmount}
          </p>
          <p>
            {t("Max Amount")}: {selectedPlan?.maxAmount}
          </p>
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
          />
        </div>
      </div>
      {selectedPlan && (
        <div className="p-3 rounded-sm text-xs mt-2 bg-muted-100 dark:bg-muted-800 text-muted-400 dark:text-muted-400">
          {selectedPlan?.description}
          <div className="mt-2">
            <p className="text-success-500">
              {t("ROI")}: {selectedPlan?.profitPercentage}%
            </p>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-1 mt-3">
        <Button
          type="button"
          color={profile?.id ? "success" : "muted"}
          animated={false}
          className="w-full"
          shape={"rounded-sm"}
          onClick={() => {
            if (profile?.id) {
              handlePlaceInvestment();
            } else {
              router.push("/auth/login");
            }
          }}
        >
          {profile?.id ? (
            "Invest"
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

export const AiInvestmentInput = memo(AiInvestmentInputBase);
