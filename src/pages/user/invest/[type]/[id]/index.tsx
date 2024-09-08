import Layout from "@/layouts/Default";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import $fetch from "@/utils/api";
import Card from "@/components/elements/base/card/Card";
import Button from "@/components/elements/base/button/Button";
import { Icon } from "@iconify/react";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import Link from "next/link";
import { useWalletStore } from "@/stores/user/wallet";
import { NewInvestment } from "@/components/pages/user/invest/plan/NewInvestment";
import { Lottie } from "@/components/elements/base/lottie";
import { formatDate } from "date-fns";
import Progress from "@/components/elements/base/progress/Progress";
import { capitalize } from "lodash";
import Tag from "@/components/elements/base/tag/Tag";
import { useTranslation } from "next-i18next";
import Alert from "@/components/elements/base/alert/Alert";
import { toast } from "sonner";

const InvestmentPlansDashboard = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { type, id } = router.query as {
    type: string;
    id: string;
  };
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [plan, setPlan] = useState<any | null>(null);
  const [investment, setInvestment] = useState<any | null>(null);
  const { wallet, fetchWallet } = useWalletStore();
  const [amount, setAmount] = useState<number>(0);
  const [duration, setDuration] = useState<{
    label: string;
    value: string;
  }>({
    label: "Select Duration",
    value: "",
  });

  const fetchInvestmentPlan = async () => {
    if (!type || !id) return;
    let url;
    switch (type.toLowerCase()) {
      case "general":
        url = `/api/finance/investment/plan/${id}`;
        break;
      case "ai":
        url = `/api/ext/ai/investment/plan/${id}`;
        break;
      case "forex":
        url = `/api/ext/forex/investment/plan/${id}`;
        break;
      default:
        break;
    }
    const { data, error } = await $fetch({
      url,
      silent: true,
    });
    if (!error) {
      setPlan(data);
    }
  };

  const fetchInvestment = async () => {
    if (!type || !id) return;
    let url;
    switch (type.toLowerCase()) {
      case "forex":
      case "general":
        url = `/api/finance/investment`;
        break;
      case "ai":
        url = `/api/ext/ai/investment`;
        break;
      default:
        break;
    }
    const { data, error } = await $fetch({
      url,
      silent: true,
      params: { type },
    });
    if (error) {
      setInvestment(null);
    } else {
      setInvestment(data);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      fetchInvestmentPlan();
      fetchInvestment();
      setIsLoading(false);
    }
  }, [type, id, router.isReady]);

  useEffect(() => {
    if (plan) {
      fetchWallet(plan.walletType, plan.currency);
    }
  }, [plan]);

  const invest = async () => {
    if (!plan) return;
    if (!duration.value || amount <= 0) {
      toast.error("Please select a duration and amount to invest");
      return;
    }
    if (!wallet || wallet.balance < amount) {
      toast.error("Insufficient balance to invest");
      return;
    }
    if (amount < plan.minInvestment) {
      toast.error("Amount is less than the minimum investment");
      return;
    }
    if (amount > plan.maxInvestment) {
      toast.error("Amount is more than the maximum investment");
      return;
    }

    setIsLoading(true);
    const { error } = await $fetch({
      url: `/api/finance/investment`,
      method: "POST",
      body: {
        type,
        planId: id,
        durationId: duration.value,
        amount,
      },
    });
    if (!error) {
      fetchInvestment();
      if (plan) fetchWallet(plan.walletType, plan.currency);
      setAmount(0);
      setDuration({ label: "Select Duration", value: "" });
    }
    setIsLoading(false);
  };

  const cancelInvestment = async () => {
    setIsLoading(true);
    const { error } = await $fetch({
      url: `/api/finance/investment/${investment.id}`,
      method: "DELETE",
      params: { type },
    });
    if (!error) {
      setInvestment(null);
      if (plan) fetchWallet(plan.walletType, plan.currency);
    }
    setIsLoading(false);
  };

  const ROI = useMemo(() => {
    if (!plan) return 0;
    return (amount * plan.profitPercentage) / 100;
  }, [amount, plan]);

  const progress = useMemo(() => {
    if (!investment) return 0;
    const startDate = new Date(investment.createdAt).getTime();
    const endDate = new Date(investment.endDate).getTime();
    const currentDate = new Date().getTime();
    return ((currentDate - startDate) / (endDate - startDate)) * 100;
  }, [investment]);

  const statusColor = useMemo(() => {
    if (!investment) return "text-muted-400";
    switch (investment.status) {
      case "ACTIVE":
        return "primary";
      case "COMPLETED":
        return "success";
      case "CANCELLED":
      case "REJECTED":
        return "danger";
      default:
        return "muted";
    }
  }, [investment]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (plan) {
        setInvestment((prev) => {
          if (!prev) return null;
          if (prev.status === "ACTIVE") {
            return {
              ...prev,
            };
          }
          return prev;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [plan]);

  return (
    <Layout title={`${plan?.title || "Loading"} Investment Plan`} color="muted">
      <div className="mx-auto w-full max-w-xl mt-5">
        <div className="rounded-2xl border border-transparent md:border-muted-200 md:p-4 md:dark:border-muted-800 ">
          <Card color="contrast">
            <div className="flex items-center justify-between border-b border-muted-200 px-6 py-4 dark:border-muted-800">
              <div>
                <h2 className="font-sans text-base font-normal leading-tight text-muted-800 dark:text-muted-100">
                  {plan?.title}
                </h2>
                <p className="text-sm text-muted-400">{plan?.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <IconButton
                  type="button"
                  size="sm"
                  color="muted"
                  onClick={() => router.back()}
                >
                  <Icon icon="lucide:arrow-left" className="h-4 w-4" />
                </IconButton>
              </div>
            </div>

            <div className="p-6 w-full flex flex-col gap-4">
              {plan && investment && investment.planId !== plan.id && (
                <Alert color="warning" canClose={false}>
                  <Icon icon="mdi:alert" className="h-6 w-6 text-warning-500" />
                  <p className="text-sm text-warning-600">
                    You have an active investment in a different plan. You
                    cannot invest in this plan until your current investment is
                    completed.
                  </p>
                </Alert>
              )}

              <div className="rounded-lg bg-muted-100 p-4 dark:bg-muted-900">
                <div className="flex flex-col divide-y divide-muted-200 rounded-lg border border-muted-200 bg-white text-center dark:divide-muted-800 dark:border-muted-800 dark:bg-muted-950 md:flex-row md:divide-x md:divide-y-0">
                  <div className="my-2 flex-1 py-3">
                    <h3 className="mb-1 text-sm uppercase leading-tight text-muted-500 dark:text-muted-400 flex gap-1 justify-center items-center">
                      {t("Balance")}{" "}
                      <Link href={`/user/wallet/deposit`}>
                        <Icon
                          icon="mdi:plus"
                          className="h-5 w-5 hover:text-primary-500 cursor-pointer"
                        />
                      </Link>
                    </h3>
                    <span className="text-lg font-semibold text-muted-800 dark:text-muted-100">
                      {wallet?.balance || 0} {plan?.currency}
                    </span>
                  </div>
                  <div className="my-2 flex-1 py-3">
                    <h3 className="mb-1 text-sm uppercase leading-tight text-muted-500 dark:text-muted-400">
                      {investment ? "Invested" : "Investing"}
                    </h3>
                    <span className="text-lg font-semibold text-danger-500 ">
                      {investment ? investment.amount : amount} {plan?.currency}
                    </span>
                  </div>
                  <div className="my-2 flex-1 py-3">
                    <h3 className="mb-1 text-sm uppercase leading-tight text-muted-500 dark:text-muted-400">
                      {investment ? "Profit" : "ROI"}
                    </h3>
                    <span className="text-lg font-semibold text-success-500">
                      {investment ? investment.profit : ROI} {plan?.currency}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-transparent bg-muted-50 p-4 dark:bg-muted-900 md:border-muted-200 md:p-6 md:dark:border-muted-800">
                {investment ? (
                  <div className="w-full">
                    <Lottie
                      category="stock-market"
                      path="stock-market-monitoring"
                      max={2}
                      height={250}
                    />
                    <div>
                      <div className="flex justify-between items-center mt-4">
                        <p className="text-lg font-semibold text-muted-800 dark:text-muted-100">
                          {capitalize(type)} {t("Investment Details")}
                        </p>
                        <Tag color={statusColor as any} shape={"rounded"}>
                          {investment.status}
                        </Tag>
                      </div>
                      <div className="flex flex-col gap-2 mt-4">
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-400">
                            {t("Duration")}
                          </p>
                          <p className="text-sm text-muted-800 dark:text-muted-100">
                            {investment.duration?.duration}{" "}
                            {investment.duration?.timeframe}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-400">
                            {t("Amount")}
                          </p>
                          <p className="text-sm text-muted-800 dark:text-muted-100">
                            {investment.amount} {plan?.currency}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-400">
                            {t("Return of Investment")}
                          </p>
                          <p className="text-sm text-muted-800 dark:text-muted-100">
                            {investment.profit} {plan?.currency}
                          </p>
                        </div>
                        <div className="">
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-muted-400">
                              {t("Start Date")}
                            </p>
                            <p className="text-sm text-muted-400">
                              {t("End Date")}
                            </p>
                          </div>
                          <Progress
                            size="sm"
                            color="primary"
                            value={progress}
                            classNames={"my-[1px"}
                          />
                          <div className="flex justify-between items-center]">
                            <p className="text-sm text-muted-400">
                              {investment.createdAt &&
                                formatDate(
                                  new Date(investment.createdAt),
                                  "dd MMM yyyy, hh:mm a"
                                )}
                            </p>
                            <p className="text-sm text-muted-400">
                              {investment.endDate &&
                                formatDate(
                                  new Date(investment.endDate),
                                  "dd MMM yyyy, hh:mm a"
                                )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-4 w-full justify-center border-t border-muted-200 dark:border-muted-800 pt-4">
                      <span className="w-1/2">
                        <Button
                          type="button"
                          color="danger"
                          onClick={() => cancelInvestment()}
                          loading={isLoading}
                          disabled={investment.status !== "ACTIVE" || isLoading}
                          className="w-full"
                        >
                          {t("Cancel Investment")}
                        </Button>
                      </span>
                    </div>
                  </div>
                ) : (
                  <NewInvestment
                    plan={plan}
                    duration={duration}
                    setDuration={setDuration}
                    amount={amount}
                    setAmount={setAmount}
                    invest={invest}
                    isLoading={isLoading}
                  />
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};
export default InvestmentPlansDashboard;
