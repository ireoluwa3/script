"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/layouts/Default";
import { useDashboardStore } from "@/stores/dashboard";
import $fetch from "@/utils/api";
import Input from "@/components/elements/form/input/Input";
import Card from "@/components/elements/base/card/Card";
import { Icon } from "@iconify/react";
import Progress from "@/components/elements/base/progress/Progress";
import Avatar from "@/components/elements/base/avatar/Avatar";
import { format, parseISO, differenceInSeconds } from "date-fns";
import Button from "@/components/elements/base/button/Button";
import { MashImage } from "@/components/elements/MashImage";
import { formatLargeNumber } from "@/utils/market";
import Link from "next/link";
import { BackButton } from "@/components/elements/base/button/BackButton";
import { useWalletStore } from "@/stores/user/wallet";
import { debounce } from "lodash";
import { useTranslation } from "next-i18next";
import { toast } from "sonner";
type Token = {
  id: string;
  projectId: string;
  saleAmount: number;
  name: string;
  chain: string;
  currency: string;
  purchaseCurrency: string;
  purchaseWalletType: string;
  address: string;
  totalSupply: number;
  description: string;
  image: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  phases: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    price: number;
    status: string;
    tokenId: string;
    minPurchase: number;
    maxPurchase: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    contributions: number;
    contributionPercentage: number;
  }[];
  icoAllocation: {
    id: string;
    name: string;
    percentage: number;
    tokenId: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
  };
  project: {
    id: string;
    name: string;
    description: string;
    website: string;
    whitepaper: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
  };
};
const OfferDetails = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query as {
    id: string;
  };
  const [token, setToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState(0);
  const { profile, getSetting } = useDashboardStore();
  const { wallet, fetchWallet } = useWalletStore();
  const fetchToken = async () => {
    const { data, error } = await $fetch({
      url: `/api/ext/ico/offer/${id}`,
      silent: true,
    });
    if (!error) {
      setToken(data);
    }
  };
  const debouncedFetchToken = debounce(fetchToken, 100);
  useEffect(() => {
    if (router.isReady) {
      debouncedFetchToken();
    }
  }, [router.isReady]);
  useEffect(() => {
    if (token) {
      const intervalId = setInterval(() => updateCountdown(), 1000);
      return () => clearInterval(intervalId);
    }
  }, [token]);
  useEffect(() => {
    if (
      token &&
      (!wallet ||
        (wallet &&
          wallet.type !== token.purchaseWalletType &&
          wallet.currency !== token.purchaseCurrency))
    ) {
      fetchWallet(token.purchaseWalletType, token.purchaseCurrency);
    }
  }, [token, wallet]);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isStarted: false,
  });
  const activePhase = token?.phases?.find((phase) => phase.status === "ACTIVE");
  const updateCountdown = () => {
    if (!activePhase) return;
    const now = new Date();
    const start = parseISO(activePhase.startDate);
    const end = parseISO(activePhase.endDate);
    const isStarted = now >= start;
    const targetDate = isStarted ? end : start;
    const timeRemaining = differenceInSeconds(targetDate, now);
    if (timeRemaining < 0) return;
    const days = Math.floor(timeRemaining / (60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((timeRemaining % (60 * 60)) / 60);
    const seconds = timeRemaining % 60;
    setCountdown({ days, hours, minutes, seconds, isStarted });
  };
  const purchase = async () => {
    if (!activePhase) return;
    if (
      getSetting("icoRestrictions") === "true" &&
      (!profile?.kyc?.status ||
        (parseFloat(profile?.kyc?.level || "0") < 2 &&
          profile?.kyc?.status !== "APPROVED"))
    ) {
      await router.push("/user/profile?tab=kyc");
      toast.error(t("Please complete your KYC to participate in ICO"));
      return;
    }
    const { error } = await $fetch({
      url: `/api/ext/ico/contribution`,
      method: "POST",
      body: { amount, phaseId: activePhase.id },
    });
    if (!error) {
      if (token)
        await fetchWallet(token.purchaseWalletType, token.purchaseCurrency);
      fetchToken();
      setAmount(0);
    }
  };
  return (
    <Layout title={`${token?.name} Details`} color="muted">
      <div className="flex flex-col md:flex-row gap-5 justify-between items-center">
        <h2 className="text-2xl">
          <span className="text-primary-500">{token?.name} </span>
          <span className="text-muted-800 dark:text-muted-200">
            {t("Details")}
          </span>
        </h2>

        <BackButton href={`/ico/project/${token?.projectId}`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-5 mt-6">
        <div className="col-span-1 md:col-span-2 xl:col-span-3 space-y-5">
          <Card
            className="text-muted-800 dark:text-muted-200 flex flex-col items-center p-6 sm:flex-row"
            color="contrast"
          >
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <div className="relative">
                <Avatar src={token?.image} text={token?.currency} size="xl" />
                {token?.chain && (
                  <MashImage
                    src={`/img/crypto/${token.chain?.toLowerCase()}.webp`}
                    width={24}
                    height={24}
                    alt="chain"
                    className="absolute right-0 bottom-0"
                  />
                )}
              </div>
              <div className="text-center sm:text-left">
                <h4 className="font-sans text-base font-medium">
                  {token?.currency} ({token?.name})
                </h4>
                <p className="text-muted-400 font-sans text-sm">
                  {token?.description}
                </p>
              </div>
            </div>
          </Card>
          <Card
            color="contrast"
            className="text-muted-800 dark:text-muted-200 p-4 text-sm"
          >
            <h3 className="text-start font-bold mb-2">{t("Token Details")}</h3>
            <ul className="flex flex-col gap-2">
              <li className="border-b border-muted-200 dark:border-muted-700 flex justify-between">
                <strong>{t("Name")}</strong> {token?.name}
              </li>
              <li className="border-b border-muted-200 dark:border-muted-700 flex justify-between">
                <strong>{t("Address")}</strong> {token?.address}
              </li>
              <li className="border-b border-muted-200 dark:border-muted-700 flex justify-between">
                <strong>{t("Project Name")}</strong> {token?.project.name}
              </li>
              <li className="border-b border-muted-200 dark:border-muted-700 flex justify-between">
                <strong>{t("Project Description")}</strong>{" "}
                {token?.project.description}
              </li>
              <li className="border-b border-muted-200 dark:border-muted-700 flex justify-between">
                <strong>{t("Project Website")}</strong>
                <a
                  href={token?.project.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-500"
                >
                  {token?.project.website}
                </a>
              </li>
              <li className="border-b border-muted-200 dark:border-muted-700 flex justify-between">
                <strong>{t("Project Whitepaper")}</strong>
                <p>{token?.project.whitepaper}</p>
              </li>
              <li className="flex justify-between">
                <strong>{t("Total Supply")}</strong> {token?.totalSupply}{" "}
                {token?.currency}
              </li>
            </ul>
          </Card>
          {activePhase && (
            <Card
              color="contrast"
              className="text-muted-800 dark:text-muted-200 p-4 flex flex-col sm:flex-row justify-between text-sm"
            >
              <div className="w-full">
                <h3 className="text-start font-bold mb-2">
                  {t("Active Phase Details")}
                </h3>
                <ul className="flex flex-col gap-2">
                  <li className="flex justify-between border-b border-muted-200 dark:border-muted-700">
                    <strong>{t("Price")}</strong>
                    <span>
                      {activePhase.price} {token?.purchaseCurrency}
                    </span>
                  </li>
                  <li className="flex justify-between border-b border-muted-200 dark:border-muted-700">
                    <strong>{t("Min Purchase Amount")}</strong>
                    <span>
                      {activePhase.minPurchase} {token?.purchaseCurrency}
                    </span>
                  </li>
                  <li className="flex justify-between border-b border-muted-200 dark:border-muted-700">
                    <strong>{t("Max Purchase Amount")}</strong>
                    <span>
                      {activePhase.maxPurchase} {token?.purchaseCurrency}
                    </span>
                  </li>
                  <li className="flex justify-between border-b border-muted-200 dark:border-muted-700">
                    <strong>{t("Start Date")}</strong>
                    <span>
                      {format(parseISO(activePhase.startDate), "PPpp")}
                    </span>
                  </li>
                  <li className="flex justify-between">
                    <strong>{t("End Date")}</strong>
                    <span>{format(parseISO(activePhase.endDate), "PPpp")}</span>
                  </li>
                </ul>
              </div>
            </Card>
          )}
        </div>
        <div className="space-y-5">
          <Card
            color="contrast"
            className="text-muted-800 dark:text-muted-200 space-y-5"
          >
            <div className="w-full p-4 border-b text-center border-gray-200 dark:border-gray-700">
              <div className="w-full">
                {countdown.isStarted ? (
                  <span>
                    {t("Ends in")} {countdown.days}d {countdown.hours}h{" "}
                    {countdown.minutes}m {countdown.seconds}s
                  </span>
                ) : (
                  <span>
                    {t("Starts in")} {countdown.days}d {countdown.hours}h{" "}
                    {countdown.minutes}m {countdown.seconds}s
                  </span>
                )}
              </div>
            </div>
            <div className="w-full grow space-y-1 px-4 pb-4">
              <div className="flex items-center justify-between">
                <h4 className="text-muted-700 dark:text-muted-100 font-sans text-sm font-medium">
                  {t("Progress")}
                </h4>
                <div>
                  <span className="text-muted-400 font-sans text-sm">
                    {activePhase?.contributionPercentage?.toFixed(2) ?? 0}%
                  </span>
                </div>
              </div>
              <Progress
                size="xs"
                color="primary"
                value={activePhase?.contributionPercentage ?? 0}
              />
            </div>
            {countdown.isStarted && activePhase?.status === "ACTIVE" && (
              <>
                <div className="border-t border-muted-200 dark:border-muted-700 pt-4 px-4">
                  <Input
                    type="number"
                    label={t("Amount")}
                    placeholder={t("Enter amount")}
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                    min={activePhase.minPurchase}
                    max={
                      wallet
                        ? wallet.balance > activePhase.maxPurchase
                          ? activePhase.maxPurchase
                          : wallet?.balance
                        : activePhase.maxPurchase
                    }
                  />
                </div>
                <div className="flex justify-between items-center text-xs pt-0 px-4">
                  <span className="text-muted-800 dark:text-muted-200">
                    {t("Balance")}
                  </span>
                  <span className="flex gap-1 justify-center items-center">
                    {wallet?.balance ?? 0} {token?.purchaseCurrency}
                    <Link href={`/user/wallet/deposit`}>
                      <Icon
                        icon="ei:plus"
                        className="h-5 w-5 text-success-500"
                      />
                    </Link>
                  </span>
                </div>
                <div className="px-4 pb-4">
                  <Button
                    type="button"
                    shape="rounded"
                    color="primary"
                    className="w-full"
                    onClick={() => purchase()}
                    disabled={
                      !amount ||
                      amount < activePhase.minPurchase ||
                      amount > activePhase.maxPurchase ||
                      (wallet ? amount > wallet.balance : false)
                    }
                  >
                    {t("Purchase")}
                  </Button>
                </div>
              </>
            )}
          </Card>

          <Card
            color="contrast"
            className="text-muted-800 dark:text-muted-200 "
          >
            <div className="w-full">
              <div className="flex flex-col gap-1 text-center border-b border-muted-200 dark:border-muted-700 p-4">
                <h3 className="font-sans text-md font-semibold">
                  {activePhase?.name}
                </h3>
                <p className="text-muted-400 font-sans text-xs uppercase">
                  {t("Phase")}
                </p>
              </div>
              <div className="flex flex-col gap-1 border-b border-muted-200 dark:border-muted-700 p-4 text-center">
                <h3 className="font-sans text-md font-semibold">
                  {formatLargeNumber(token?.saleAmount || 0)}
                </h3>
                <p className="text-muted-400 font-sans text-xs uppercase">
                  {t("Sale Amount")}
                </p>
              </div>
              <div className="flex flex-col gap-1 border-b border-muted-200 dark:border-muted-700 p-4 text-center">
                <h3 className="font-sans text-md font-semibold">
                  {activePhase?.contributions ?? 0}
                </h3>
                <p className="text-muted-400 font-sans text-xs uppercase">
                  {t("Contributions")}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};
export default OfferDetails;
