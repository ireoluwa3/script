import Layout from "@/layouts/Default";
import React, { useEffect, useState } from "react";
import { useDashboardStore } from "@/stores/dashboard";
import Card from "@/components/elements/base/card/Card";
import { MashImage } from "@/components/elements/MashImage";
import { useRouter } from "next/router";
import $fetch from "@/utils/api";
import { debounce } from "lodash";
import { BackButton } from "@/components/elements/base/button/BackButton";
import { useTranslation } from "next-i18next";
type Condition = {
  id: string;
  title: string;
  description: string;
  reward: number;
  rewardType: string;
  rewardCurrency: string;
};
const AffiliateDashboard = () => {
  const { t } = useTranslation();
  const { profile } = useDashboardStore();
  const router = useRouter();
  const [validConditions, setValidConditions] = useState<Condition[]>([]);
  const fetchConditions = async () => {
    const { data, error } = await $fetch({
      url: `/api/ext/affiliate/condition`,
      silent: true,
    });
    if (!error) {
      setValidConditions(data);
    }
  };
  const debounceFetchConditions = debounce(fetchConditions, 100);
  useEffect(() => {
    if (router.isReady) {
      debounceFetchConditions();
    }
  }, [router.isReady]);
  return (
    <Layout title={t("Affiliate")} color="muted">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">
            <span className="text-primary-500">{t("Affiliate")}</span>{" "}
            <span className="text-muted-800 dark:text-muted-200">
              {t("Program")}
            </span>
          </h2>
          <p className="font-sans text-base text-muted-500 dark:text-muted-400">
            {t("Welcome to the affiliate program")} {profile?.firstName}
            {t("Here are the conditions for earning rewards.")}
          </p>
        </div>
        <BackButton href="/user/affiliate" />
      </div>
      <div className="flex justify-center items-center text-center w-full">
        <div className="w-full max-w-lg">
          <MashImage
            src="/img/ui/referral-program.svg"
            alt="mlm-program"
            width={300}
            height={300}
            className="w-full"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {validConditions.map((condition, index) => (
          <Card
            key={index}
            shape="smooth"
            color="contrast"
            className="group relative overflow-hidden p-5"
          >
            <div className="flex items-center gap-2">
              <div className="mask mask-hexed flex h-16 w-16 items-center justify-center bg-muted-100 transition-colors duration-300 group-hover:bg-primary-500 dark:bg-muted-900 dark:group-hover:bg-primary-500">
                <div className="mask mask-hexed relative flex h-16 w-16 scale-95 items-center justify-center bg-white dark:bg-muted-950 text-muted-800 dark:text-muted-200">
                  {index + 1}
                </div>
              </div>
              <h4 className="font-sans text-base font-medium leading-tight text-muted-800 dark:text-muted-100">
                {condition.title}
              </h4>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-500">{condition.description}</p>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <span className="font-sans text-md text-muted-400">
                {t("Reward")}
              </span>
              <span className="font-sans text-md text-success-500 border border-success-500 rounded-md px-3 py-1">
                {condition.reward}{" "}
                {condition.rewardType === "PERCENTAGE"
                  ? "%"
                  : ` ${condition.rewardCurrency}`}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </Layout>
  );
};
export default AffiliateDashboard;
