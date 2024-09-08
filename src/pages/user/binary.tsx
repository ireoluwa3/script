import Layout from "@/layouts/Default";
import React, { useEffect, useState } from "react";
import { useDashboardStore } from "@/stores/dashboard";
import { useRouter } from "next/router";
import $fetch from "@/utils/api";
import Button from "@/components/elements/base/button/Button";
import Link from "next/link";
import Card from "@/components/elements/base/card/Card";
import { Icon } from "@iconify/react";
import { Faq } from "@/components/pages/knowledgeBase/Faq";
import { useTranslation } from "next-i18next";
import BinaryList from "@/components/pages/binary/BinaryList";
import { toast } from "sonner";
import { debounce } from "lodash";
import useMarketStore from "@/stores/trade/market";
import { HeaderCardImage } from "@/components/widgets/HeaderCardImage";
import ButtonLink from "@/components/elements/base/button-link/ButtonLink";

const binaryPractice =
  process.env.NEXT_PUBLIC_BINARY_PRACTICE_STATUS !== "false";

const BinaryTradingDashboard = () => {
  const { t } = useTranslation();
  const { profile, getSetting } = useDashboardStore();
  const router = useRouter();
  const [livePositions, setLivePositions] = useState<any[]>([]);
  const [practicePositions, setPracticePositions] = useState<any[]>([]);
  const [livePercentageChange, setLivePercentageChange] = useState<number>(0);
  const [practicePercentageChange, setPracticePercentageChange] =
    useState<number>(0);
  const [firstAvailableMarket, setFirstAvailableMarket] = useState<
    string | null
  >(null);
  const { getFirstAvailablePair, fetchData, marketData } = useMarketStore();

  useEffect(() => {
    if (
      router.isReady &&
      getSetting("binaryRestrictions") === "true" &&
      (!profile?.kyc?.status ||
        (parseFloat(profile?.kyc?.level || "0") < 2 &&
          profile?.kyc?.status !== "APPROVED"))
    ) {
      router.push("/user/profile?tab=kyc");
      toast.error(t("Please complete your KYC to access forex accounts"));
    }
  }, [router.isReady, profile?.kyc?.status]);

  useEffect(() => {
    if (router.isReady) {
      fetchBinaryPositions();
      debounce(fetchData, 100)();
    }
  }, [router.isReady]);

  useEffect(() => {
    const availableMarket = getFirstAvailablePair();
    setFirstAvailableMarket(availableMarket);
  }, [marketData.length]);

  const fetchBinaryPositions = async () => {
    const { data, error } = await $fetch({
      url: "/api/exchange/binary/order/last",
      silent: true,
    });
    if (!error) {
      setLivePositions(data.nonPracticeOrders);
      setPracticePositions(data.practiceOrders);
      setLivePercentageChange(data.livePercentageChange);
      setPracticePercentageChange(data.practicePercentageChange);
    }
  };

  const LivePositionsMonthCount = livePositions.filter(
    (item) =>
      new Date(item.createdAt).getTime() >
      new Date(new Date().setDate(new Date().getDate() - 30)).getTime()
  );

  const PracticePositionsMonthCount = practicePositions.filter(
    (item) =>
      new Date(item.createdAt).getTime() >
      new Date(new Date().setDate(new Date().getDate() - 30)).getTime()
  );

  return (
    <Layout title={t("Binary Trading")} color="muted">
      <HeaderSection
        t={t}
        binaryPractice={binaryPractice}
        firstAvailableMarket={firstAvailableMarket}
      />
      <PositionsSection
        t={t}
        livePositions={livePositions}
        practicePositions={practicePositions}
        livePercentageChange={livePercentageChange}
        practicePercentageChange={practicePercentageChange}
        LivePositionsMonthCount={LivePositionsMonthCount}
        PracticePositionsMonthCount={PracticePositionsMonthCount}
        binaryPractice={binaryPractice}
      />
      <Faq category="BINARY" />
    </Layout>
  );
};

const HeaderSection = ({ t, binaryPractice, firstAvailableMarket }) => (
  <HeaderCardImage
    title={t("Binary Trading")}
    description={
      binaryPractice
        ? "Practice your trading skills with a Practice account or start trading with a live account."
        : "Start trading with a live account."
    }
    lottie={{ category: "cryptocurrency-2", path: "trading", height: 240 }}
    size="lg"
    linkElement={
      <>
        {firstAvailableMarket ? (
          <>
            {binaryPractice && (
              <ButtonLink
                href={`/binary/${firstAvailableMarket}?practice=true`}
                color="primary"
                shape="rounded"
                className="text-white dark:text-muted-100"
                variant={"outlined"}
              >
                {t("Practice")}
              </ButtonLink>
            )}
            <ButtonLink
              href={`/binary/${firstAvailableMarket}`}
              color="contrast"
              shape="rounded"
            >
              {t("Start Trading")}
            </ButtonLink>
          </>
        ) : (
          <Button color="primary" shape="rounded">
            {t("Coming Soon")}
          </Button>
        )}
      </>
    }
  />
);

const PositionsSection = ({
  t,
  livePositions,
  practicePositions,
  livePercentageChange,
  practicePercentageChange,
  LivePositionsMonthCount,
  PracticePositionsMonthCount,
  binaryPractice,
}) => (
  <div className="flex flex-col md:flex-row gap-8 w-full mt-16">
    <div className="flex flex-col gap-5 w-full md:w-1/2">
      <PositionCard
        title={t("Live Positions (30 days)")}
        positions={livePositions}
        percentageChange={livePercentageChange}
        count={LivePositionsMonthCount.length}
        imgSrc="/img/illustrations/apex.svg"
      />
    </div>
    <div className="flex flex-col gap-5 w-full md:w-1/2">
      {binaryPractice && (
        <PositionCard
          title={t("Practice Positions (30 days)")}
          positions={practicePositions}
          percentageChange={practicePercentageChange}
          count={PracticePositionsMonthCount.length}
          imgSrc="/img/illustrations/laptop-woman.svg"
        />
      )}
    </div>
  </div>
);

const PositionCard = ({
  title,
  positions,
  percentageChange,
  count,
  imgSrc,
}) => {
  const { t } = useTranslation();

  return (
    <Card className="p-6" color={"contrast"}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-muted-500 dark:text-muted-400 text-md">{title}</p>
          <div className="pb-6 pt-4">
            <span className="text-muted-800 dark:text-muted-100 font-sans text-4xl font-semibold leading-none">
              <span className="mr-2">{count}</span>
              <small className="text-muted-500 dark:text-muted-400 text-sm font-medium">
                {t("positions")}
              </small>
            </span>
          </div>
          <div className="mb-2 flex items-center gap-2 font-sans">
            {Number(percentageChange) === 0 ? (
              <span className="text-muted-400 text-sm">
                {t("No records from last month")}
              </span>
            ) : (
              <div
                className={`flex items-center font-semibold ${
                  percentageChange > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                <Icon
                  icon={
                    percentageChange > 0
                      ? "ri:arrow-up-s-fill"
                      : "ri:arrow-down-s-fill"
                  }
                  className="h-4 w-4 text-current"
                />
                <span>{percentageChange.toFixed(2)}%</span>
                <span className="text-muted-400 text-sm ml-2">
                  {percentageChange > 0
                    ? t("more than last month")
                    : t("less than last month")}
                </span>
              </div>
            )}
          </div>
        </div>
        <span className="xs:hidden sm:absolute -right-4 -top-10">
          <img src={imgSrc} className="h-48" alt={title} />
        </span>
      </div>
      <BinaryList shape="full" positions={positions} />
    </Card>
  );
};

export default BinaryTradingDashboard;
