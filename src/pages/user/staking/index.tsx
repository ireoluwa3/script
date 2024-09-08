import Layout from "@/layouts/Default";
import React, { useEffect, useState } from "react";
import { useDashboardStore } from "@/stores/dashboard";
import { useRouter } from "next/router";
import $fetch from "@/utils/api";
import { HeaderCardImage } from "@/components/widgets/HeaderCardImage";
import Avatar from "@/components/elements/base/avatar/Avatar";
import Button from "@/components/elements/base/button/Button";
import Card from "@/components/elements/base/card/Card";
import Tag from "@/components/elements/base/tag/Tag";
import Input from "@/components/elements/form/input/Input";
import { MashImage } from "@/components/elements/MashImage";
import { toast } from "sonner";
import { useWalletStore } from "@/stores/user/wallet";
import { Panel } from "@/components/elements/base/panel";
import ListBox from "@/components/elements/form/listbox/Listbox";
import { StakingInfo } from "@/components/pages/user/staking/StakingInfo";
import Progress from "@/components/elements/base/progress/Progress";
import { addDays } from "date-fns";
import { Faq } from "@/components/pages/knowledgeBase/Faq";
import { useTranslation } from "next-i18next";
type StakingDuration = {
  id: string;
  poolId: string;
  duration: number;
  interestRate: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};
type StakingLog = {
  id: string;
  userId: string;
  poolId: string;
  durationId: string;
  amount: number;
  status: "ACTIVE" | "RELEASED" | "COLLECTED";
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  duration: StakingDuration;
};
type StakingPool = {
  id: string;
  name: string;
  description: string;
  currency: string;
  chain: string;
  type: string;
  minStake: number;
  maxStake: number;
  status: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  stakingDurations: StakingDuration[];
  stakingLogs: StakingLog[];
};
const StakesDashboard = () => {
  const { t } = useTranslation();
  const { profile, getSetting } = useDashboardStore();
  const router = useRouter();
  const [stakingPools, setStakingPools] = useState<StakingPool[]>([]);
  const [selectedPool, setSelectedPool] = useState<StakingPool | null>(null);
  const [filter, setFilter] = useState("");
  const [perPage] = useState(10);
  const [currentPage] = useState(1);
  const [amount, setAmount] = useState(0);
  const [hasStaked, setHasStaked] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const { wallet, fetchWallet, setWallet } = useWalletStore();
  const [countdown, setCountdown] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isStarted: boolean;
    progress: number;
    endDate: string;
    startDate: string;
  } | null>(null);

  const fetchStakingPools = async () => {
    const url = "/api/ext/staking/pool";
    const { data, error } = await $fetch({
      url,
      silent: true,
    });
    if (!error) {
      setStakingPools(data);
    }
  };
  useEffect(() => {
    if (router.isReady) {
      fetchStakingPools();
    }
  }, [router.isReady]);

  const openStake = async (pool: StakingPool) => {
    setWallet(null);
    fetchWallet(pool.type, pool.currency);
    setHasStaked(
      Array.isArray(pool.stakingLogs) && pool.stakingLogs.length > 0
    );
    setSelectedPool(pool);
    if (!pool.stakingDurations[0]?.duration) return;
    setSelectedDuration({
      label: `${pool.stakingDurations[0]?.duration} days`,
      value: pool.stakingDurations[0]?.id,
    });
    setAmount(0);
    if (pool.stakingLogs.length > 0) {
      const log = pool.stakingLogs[0];
      if (!log.createdAt) return;
      const durationInDays = log.duration?.duration;
      const endDate = addDays(new Date(log.createdAt), durationInDays);
      const countdown = calculateCountdown(
        log.createdAt,
        endDate.toISOString()
      );
      setCountdown(countdown);
    }
  };

  const [loading, setLoading] = useState(false);
  const handleStake = async () => {
    if (
      getSetting("stakingRestrictions") === "true" &&
      (!profile?.kyc?.status ||
        (parseFloat(profile?.kyc?.level || "0") < 2 &&
          profile?.kyc?.status !== "APPROVED"))
    ) {
      await router.push("/user/profile?tab=kyc");
      toast.error(t("Please complete your KYC to purchase this product"));
      return;
    }

    if (!wallet) {
      toast.error("You need to have balance in your wallet to stake");
      return;
    }

    if (!selectedPool || !selectedDuration) return;
    if (
      amount < selectedPool.minStake ||
      amount > selectedPool.maxStake ||
      amount > wallet.balance
    ) {
      toast.error("Invalid amount");
      return;
    }
    setLoading(true);
    const { error } = await $fetch({
      url: "/api/ext/staking/log",
      method: "POST",
      body: {
        poolId: selectedPool.id,
        durationId: selectedDuration.value,
        amount,
      },
    });
    if (!error) {
      fetchWallet(selectedPool.type, selectedPool.currency);
      fetchStakingPools();
      setSelectedPool(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedPool && hasStaked) {
      const intervalId = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown) {
            const durationInDays =
              selectedPool.stakingLogs[0].duration.duration;
            const endDate = addDays(
              new Date(prevCountdown.startDate),
              durationInDays
            );
            return calculateCountdown(
              prevCountdown.startDate,
              endDate.toISOString()
            );
          }
          return null;
        });
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [selectedPool, hasStaked]);

  const calculateCountdown = (startDate: string, endDate: string) => {
    const now: number = new Date().getTime();
    const start: number = new Date(startDate).getTime();
    const end: number = new Date(endDate).getTime();
    const isStarted: boolean = now >= start;
    const timeRemaining: number = Math.max((end - now) / 1000, 0);
    const totalDuration: number = (end - start) / 1000; // Total duration in seconds
    const progress: number =
      ((totalDuration - timeRemaining) / totalDuration) * 100;
    const days: number = Math.floor(timeRemaining / (60 * 60 * 24));
    const hours: number = Math.floor(
      (timeRemaining % (60 * 60 * 24)) / (60 * 60)
    );
    const minutes: number = Math.floor((timeRemaining % (60 * 60)) / 60);
    const seconds: number = Math.floor(timeRemaining % 60);
    return {
      days,
      hours,
      minutes,
      seconds,
      isStarted,
      progress,
      endDate,
      startDate,
    };
  };
  const filteredPools = stakingPools.filter((pool) =>
    pool.currency.includes(filter)
  );
  const paginatedPools = filteredPools.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );
  return (
    <Layout title={t("Staking Pool")} color="muted">
      <HeaderCardImage
        title={t("Stake your crypto and earn interest on it.")}
        description="Staking is the process of holding funds in a cryptocurrency wallet to support the operations of a blockchain network. Users are rewarded for simply depositing and holding coins."
        lottie={{
          category: "cryptocurrency-2",
          path: "payout",
          height: 240,
        }}
        link={`/user/staking/history`}
        linkLabel="View Staking History"
        size="lg"
      />
      <div className="relative pt-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl">
            <span className="text-primary-500">{t("Staking")}</span>{" "}
            <span className="text-muted-800 dark:text-muted-200">
              {t("Pools")}
            </span>
          </h2>
          <div>
            <Input
              type="text"
              placeholder={t("Search for a pool")}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-5">
          {paginatedPools.map((pool, index) => (
            <Card
              key={index}
              shape="smooth"
              color="contrast"
              shadow="hover"
              className="flex flex-col items-center p-6 sm:flex-row"
            >
              <div className="contact flex w-full flex-row items-center gap-3 justify-start">
                <div className="relative">
                  <Avatar
                    size="md"
                    src={
                      pool.icon ||
                      `/img/crypto/${pool.currency.toLowerCase()}.webp`
                    }
                  />
                  {pool?.chain && (
                    <MashImage
                      src={`/img/crypto/${pool.chain.toLowerCase()}.webp`}
                      width={16}
                      height={16}
                      alt="chain"
                      className="absolute right-0 bottom-0 rounded-full"
                    />
                  )}
                </div>
                <div className="text-start font-sans">
                  <h4 className="text-base font-medium leading-tight text-muted-800 dark:text-muted-100">
                    {pool.currency} ({pool.name})
                  </h4>
                  <p className="font-sans text-xs text-muted-400">
                    {pool.description.length > 100
                      ? `${pool.description.slice(0, 100)}...`
                      : pool.description}
                  </p>
                </div>
              </div>
              <div className="my-4 px-4 text-center lg:my-0 lg:me-8 lg:text-start">
                <span className="block text-xs uppercase leading-snug text-muted-400">
                  {t("Limits")}
                </span>
                <span className="block whitespace-nowrap text-[1.1rem] font-medium leading-snug text-muted-800 dark:text-muted-100">
                  {pool.minStake} - {pool.maxStake} {pool.currency}
                </span>
              </div>
              <div className="status px-4">
                <span className=" text-info-500 text-sm">{pool.type}</span>
              </div>
              <div className="my-6 flex items-center justify-center gap-3 lg:my-0 lg:me-8 lg:justify-end"></div>
              <div className="flex items-center">
                <Button
                  onClick={() => openStake(pool)}
                  color={"primary"}
                  shape={"rounded"}
                >
                  {t("Stake")}
                </Button>
              </div>
            </Card>
          ))}
        </div>
        {/* Add pagination and modal here */}
      </div>
      <Panel
        isOpen={!!selectedPool}
        title={t("Stake")}
        tableName={t("Stake")}
        size="xl"
        onClose={() => setSelectedPool(null)}
      >
        {selectedPool && (
          <div className="flex flex-col justify-between gap-5 text-sm text-muted-800 dark:text-muted-200">
            <div className="contact flex w-full flex-row items-center justify-center gap-3 lg:justify-start">
              <div className="relative">
                <MashImage
                  src={
                    selectedPool.icon ||
                    `/img/crypto/${selectedPool.currency.toLowerCase()}.webp`
                  }
                  alt={selectedPool.currency}
                  width={96}
                  height={96}
                  className="rounded-full w-full h-full"
                />
                {selectedPool.chain && (
                  <MashImage
                    src={`/img/crypto/${selectedPool.chain.toLowerCase()}.webp`}
                    width={16}
                    height={16}
                    alt="chain"
                    className="absolute right-0 bottom-0 rounded-full"
                  />
                )}
              </div>
              <div className="text-start font-sans">
                <h4 className="text-base font-medium leading-tight text-muted-800 dark:text-muted-100">
                  {selectedPool.currency} ({selectedPool.name})
                </h4>
                <p className="font-sans text-xs text-muted-400">
                  {selectedPool.description}
                </p>
              </div>
            </div>

            <StakingInfo
              hasStaked={hasStaked}
              selectedPool={selectedPool}
              wallet={{ balance: wallet?.balance }}
              selectedDuration={selectedDuration}
              amount={amount}
            />

            {hasStaked && countdown && (
              <div className="mt-6 w-full">
                <Progress
                  size="xs"
                  color="success"
                  value={countdown.progress}
                />
                <div className="flex justify-between mt-1 w-full text-xs text-muted-500 dark:text-muted-400">
                  <p>{t("Collectable in")}</p>
                  <p>
                    {countdown.days}d {countdown.hours}h {countdown.minutes}m{" "}
                    {countdown.seconds}s{" "}
                    <span className="text-success-500">
                      ({countdown.progress.toFixed(2)}%)
                    </span>
                  </p>
                </div>
              </div>
            )}

            {hasStaked ? (
              <>
                <Card className="p-2 w-full">
                  <Button
                    onClick={() => {}}
                    color="primary"
                    shape="rounded"
                    className="w-full"
                    disabled
                  >
                    {t("Collect")}
                  </Button>
                </Card>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-5 md:flex-row">
                  <ListBox
                    label={t("Select Duration")}
                    selected={selectedDuration}
                    setSelected={(d) => {
                      setSelectedDuration(d);
                    }}
                    options={selectedPool.stakingDurations.map(
                      (d) =>
                        ({
                          label: `${d.duration} days`,
                          value: d.id,
                        } || [])
                    )}
                  />
                  <Input
                    label={t("Amount")}
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(+e.target.value)}
                  />
                </div>
                <Card className="p-2 w-full">
                  <Button
                    onClick={handleStake}
                    color="primary"
                    shape="rounded"
                    className="w-full"
                    loading={loading}
                    disabled={loading}
                  >
                    {t("Stake")}
                  </Button>
                </Card>
              </>
            )}
          </div>
        )}
      </Panel>

      <Faq category="STAKING" />
    </Layout>
  );
};
export default StakesDashboard;
