import Layout from "@/layouts/Default";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { capitalize } from "lodash";
import $fetch from "@/utils/api";
import { MashImage } from "@/components/elements/MashImage";
import Tag from "@/components/elements/base/tag/Tag";
import Input from "@/components/elements/form/input/Input";
import {
  BentoGrid,
  BentoGridItem,
} from "@/components/pages/blog/PostsGrid/BentoCard";
import { HeaderCardImage } from "@/components/widgets/HeaderCardImage";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import Card from "@/components/elements/base/card/Card";
type InvestmentPlan = {
  id: string;
  title: string;
  description: string;
  image: string;
  minAmount: number;
  maxAmount: number;
  profitPercentage: number;
  currency: string;
  walletType: string;
  trending: boolean;
  durations: {
    id: string;
    duration: number;
    timeframe: string;
  }[];
};
const InvestmentPlansDashboard = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { type } = router.query as {
    type: string;
  };
  const Type = capitalize(type);
  const [plans, setPlans] = useState<InvestmentPlan[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const fetchInvestmentPlans = async () => {
    if (!type) return;
    let url;
    switch (type.toLowerCase()) {
      case "general":
        url = "/api/finance/investment/plan";
        break;
      case "ai":
        url = "/api/ext/ai/investment/plan";
        break;
      case "forex":
        url = "/api/ext/forex/investment/plan";
        break;
      default:
        break;
    }
    const { data, error } = await $fetch({
      url,
      silent: true,
    });
    if (!error) {
      setPlans(data);
    }
  };
  useEffect(() => {
    if (router.isReady) {
      fetchInvestmentPlans();
    }
  }, [type, router.isReady]);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const filteredPlans = plans.filter(
    (plan) =>
      plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.currency.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <Layout title={`${Type} Investment Plans`} color="muted">
      <div className="mb-6">
        <HeaderCardImage
          title={`Welcome to our ${Type} Investment Plans`}
          description={`Here you can find a list of all available investment plans that are currently active and open for new investments.`}
          link={`/user/invest/${type}`}
          linkLabel="View Your Investments"
          lottie={{
            category: type === "forex" ? "stock-market" : "cryptocurrency-2",
            path: type === "forex" ? "stock-market-monitoring" : "analysis-1",
            max: type === "forex" ? 2 : undefined,
            height: 240,
          }}
          size="lg"
        />
      </div>

      <div className="w-full flex items-center justify-between mb-6">
        <div className="w-full hidden sm:block">
          <h2 className="text-2xl">
            <span className="text-primary-500">{t("Popular")} </span>
            <span className="text-muted-800 dark:text-muted-200">
              {t("Investment Plans")}
            </span>
          </h2>
        </div>

        <div className="w-full sm:max-w-xs text-end">
          <Input
            type="text"
            placeholder={t("Search Investment Plans")}
            value={searchTerm}
            onChange={handleSearchChange}
            icon={"mdi:magnify"}
          />
        </div>
      </div>

      <div className="relative mb-5">
        <hr className="border-muted-200 dark:border-muted-700" />
        <span className="absolute inset-0 -top-2 text-center font-semibold text-xs text-muted-500 dark:text-muted-400">
          <span className="bg-muted-50 dark:bg-muted-900 px-2">
            {searchTerm
              ? `Matching "${searchTerm}"`
              : `All ${Type} Investment Plans`}
          </span>
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mx-auto md:auto-rows-[18rem]">
        {filteredPlans.map((plan) => (
          <Link key={plan.id} href={`/user/invest/${type}/${plan.id}`}>
            <Card
              className="group relative w-full h-full p-3 hover:shadow-lg cursor-pointer hover:border-primary-500 dark:hover:border-primary-400"
              color="contrast"
            >
              <div className="relative w-full h-[200px]">
                <MashImage
                  src={plan.image}
                  alt={plan.title}
                  className="rounded-md object-cover w-full h-full bg-muted-100 dark:bg-muted-900"
                  fill
                />
                {plan.trending && (
                  <div className="absolute top-0 right-1">
                    <Tag color="primary" className="rounded">
                      {t("Trending")}
                    </Tag>
                  </div>
                )}
              </div>

              <div className="p-2">
                <h3 className="text-lg font-semibold text-primary-500 dark:text-primary-400">
                  {plan.title}
                </h3>
                <div className="flex flex-col gap-1">
                  <p className="pb-2 text-muted-500 dark:text-muted-400 text-sm">
                    {plan.description.length > 100
                      ? plan.description.slice(0, 100) + "..."
                      : plan.description}
                  </p>
                  <div className="flex justify-between text-xs text-muted-500 dark:text-muted-400">
                    <p>{t("Return of Investment")}</p>
                    <p className="text-success-500">{plan.profitPercentage}%</p>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </Layout>
  );
};
export default InvestmentPlansDashboard;
