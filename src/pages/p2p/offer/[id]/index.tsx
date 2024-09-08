"use client";
import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/layouts/Default";
import { useRouter } from "next/router";
import $fetch from "@/utils/api";
import { debounce } from "lodash";
import { MashImage } from "@/components/elements/MashImage";
import { Icon } from "@iconify/react";
import Button from "@/components/elements/base/button/Button";
import { DealCard } from "@/components/pages/p2p/DealCard";
import InfoBlock from "@/components/elements/base/infoBlock";
import Card from "@/components/elements/base/card/Card";
import { formatDate } from "date-fns";
import Avatar from "@/components/elements/base/avatar/Avatar";
import { BackButton } from "@/components/elements/base/button/BackButton";
import Modal from "@/components/elements/base/modal/Modal";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import Input from "@/components/elements/form/input/Input";
import { useWalletStore } from "@/stores/user/wallet";
import { useDashboardStore } from "@/stores/dashboard";
import { useTranslation } from "next-i18next";
type P2pOfferType = {
  id: string;
  userId: string;
  paymentMethodId: string;
  walletType: string;
  currency: string;
  chain: string;
  amount: number;
  minAmount: number;
  maxAmount: number;
  inOrder: number;
  price: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  p2pTrades: {
    id: string;
    status: string;
    amount: number;
  }[];
  user: {
    firstName: string;
    lastName: string;
    avatar: string;
  };
  paymentMethod: {
    id: string;
    userId: string;
    name: string;
    instructions: string;
    currency: string;
    chain?: string;
    walletType: string;
    image: string | null;
    status: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
  p2pReviews: {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    reviewer: {
      firstName: string;
      lastName: string;
      avatar: string;
    };
  }[];
};
const P2pOffer: React.FC = () => {
  const { t } = useTranslation();
  const { profile } = useDashboardStore();
  const [isLoading, setIsLoading] = useState(false);
  const { wallet, fetchWallet } = useWalletStore();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(0);
  const [offer, setOffer] = useState<P2pOfferType | null>(null);
  const router = useRouter();

  const { id } = router.query as {
    id: string;
  };

  const fetchOffer = async () => {
    setIsLoading(true);
    const { data, error } = await $fetch({
      url: `/api/ext/p2p/offer/${id}`,
      silent: true,
    });
    if (!error) {
      setOffer(data);
    }
    setIsLoading(false);
  };
  const debounceFetchOffer = debounce(fetchOffer, 100);

  useEffect(() => {
    if (router.isReady && id) {
      debounceFetchOffer();
    }
  }, [router.isReady, id]);

  useEffect(() => {
    if (offer && !wallet) {
      fetchWallet(offer.paymentMethod.walletType, offer.paymentMethod.currency);
    }
  }, [offer, wallet]);

  const offerProgress = useMemo(() => {
    if (!offer) return 0;
    return Number((offer.inOrder / offer.amount) * 100).toFixed(2);
  }, [offer]);

  const trade = async () => {
    setIsLoading(true);
    if (offer) {
      const { data, error } = await $fetch({
        url: `/api/ext/p2p/trade`,
        method: "POST",
        body: {
          offerId: offer.id,
          amount,
        },
      });
      if (!error) {
        router.push(`/user/p2p/trade/${data.id}`);
      }
    }
    setIsLoading(false);
  };

  return (
    <Layout title={t("P2P Offer")} color="muted">
      <main className="p-6">
        <div className="mb-6 flex w-full flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="contact flex w-full flex-row items-center justify-center gap-3 sm:justify-start">
            <div className="relative">
              <Avatar
                size="md"
                src={`/img/crypto/${offer?.currency.toLowerCase()}.webp`}
              />
              {offer?.chain && (
                <MashImage
                  src={`/img/crypto/${offer.chain}.webp`}
                  width={16}
                  height={16}
                  alt="chain"
                  className="absolute right-0 bottom-0"
                />
              )}
            </div>
            <div className="text-start font-sans">
              <h4 className="text-base font-medium leading-tight text-muted-800 dark:text-muted-100">
                {offer?.currency} {offer?.chain && `(${offer.chain})`}
              </h4>
              <p className="font-sans text-xs text-muted-400">
                {offer?.createdAt
                  ? formatDate(new Date(offer.createdAt), "dd MMM yyyy")
                  : ""}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <BackButton href={`/p2p`} />
            {profile?.id !== offer?.userId && (
              <Button
                color="primary"
                shape={"rounded"}
                type="button"
                onClick={() => {
                  setOpen(true);
                }}
                disabled={
                  offer?.status !== "ACTIVE" ||
                  (offer ? offer.inOrder >= offer.amount : false)
                }
              >
                {t("Trade")}
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-1/2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-400">
                {t("Traded Amount")}
              </span>
              <span className="text-xs font-medium text-muted-400">
                {offerProgress}%
              </span>
            </div>
            <div className="h-1 bg-muted-200 dark:bg-muted-800 rounded-full">
              <div
                className="h-1 bg-primary-500 dark:bg-primary-400 rounded-full"
                style={{ width: `${offerProgress}%` }}
              ></div>
            </div>
          </div>
          <div className="w-1/2 text-right">
            <span className="text-xs font-medium text-muted-400">
              {t("Offer ID")} {offer?.id}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <div className="col-span-1 flex flex-col gap-6">
            <div className="col-span-1">
              <DealCard isToggle title={t("Payment Method")}>
                <InfoBlock
                  icon="bx:bx-wallet"
                  label={t("Method")}
                  value={offer?.paymentMethod.name}
                />
                <InfoBlock
                  icon="bx:bx-wallet"
                  label={t("Wallet Type")}
                  value={offer?.paymentMethod.walletType}
                />
                <InfoBlock
                  icon="bx:bx-dollar"
                  label={t("Currency")}
                  value={offer?.paymentMethod.currency}
                />
                {offer?.paymentMethod.chain && (
                  <InfoBlock
                    icon="bx:bx-coin-stack"
                    label={t("Chain")}
                    value={offer?.paymentMethod.chain}
                  />
                )}
              </DealCard>
            </div>

            <div className="col-span-1">
              <DealCard isToggle title={t("Offer Information")}>
                <InfoBlock
                  icon="bx:bx-wallet"
                  label={t("Wallet Type")}
                  value={offer?.walletType}
                />
                {offer?.chain && (
                  <InfoBlock
                    icon="bx:bx-coin-stack"
                    label={t("Chain")}
                    value={offer.chain}
                  />
                )}

                <InfoBlock
                  icon="bx:bx-dollar"
                  label={t("Currency")}
                  value={offer?.currency}
                />
                <InfoBlock
                  icon="bx:bx-money"
                  label={t("Price")}
                  value={`${offer?.price} ${offer?.paymentMethod?.currency}`}
                />
                <InfoBlock
                  icon="bx:bx-money"
                  label={t("Remaining Amount")}
                  value={`${offer && offer?.amount - offer?.inOrder} ${
                    offer?.currency
                  }`}
                />
              </DealCard>
            </div>
          </div>
          <div className="col-span-1">
            {offer && (
              <DealCard isToggle title={t("Recent Trades")}>
                <div className="flex flex-col gap-4">
                  {offer?.p2pTrades.slice(0, 5).map((trade) => (
                    <Card
                      key={trade.id}
                      className="flex items-center justify-between gap-4 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <MashImage
                          className="rounded-full"
                          src={offer?.user.avatar || "/img/placeholder.svg"}
                          height={32}
                          width={32}
                          alt="Deal image"
                        />
                        <div className="font-sans">
                          <span className="block text-sm font-medium text-muted-800 dark:text-muted-100">
                            {offer?.user.firstName}
                          </span>
                          <span className="block text-xs text-muted-400">
                            {offer?.user.lastName}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-medium text-muted-400">
                          {trade.status}
                        </span>
                        <span className="text-xs font-medium text-muted-400">
                          {trade.amount} {offer?.currency}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              </DealCard>
            )}
          </div>
          {/* reviews */}
          <div className="col-span-1">
            {offer && (
              <DealCard isToggle title={t("Recent Reviews")}>
                <div className="flex flex-col gap-4">
                  {offer.p2pReviews.slice(0, 5).map((review) => (
                    <Card key={review.id} className="p-3">
                      <div className="flex items-center justify-between gap-4 ">
                        <div className="flex items-center gap-3">
                          <MashImage
                            className="rounded-full"
                            src={
                              review.reviewer.avatar || "/img/placeholder.svg"
                            }
                            height={32}
                            width={32}
                            alt="Deal image"
                          />
                          <div className="font-sans">
                            <span className="block text-sm font-medium text-muted-800 dark:text-muted-100">
                              {review.reviewer.firstName}
                            </span>
                            <span className="block text-xs text-muted-400">
                              {review.reviewer.lastName}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex gap-1">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Icon
                                key={i}
                                icon={
                                  i < review.rating
                                    ? "uim:star"
                                    : i === review.rating &&
                                      review.rating % 1 >= 0.5
                                    ? "uim:star-half-alt"
                                    : "uim:star"
                                }
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <span className="text-xs font-medium text-muted-400">
                        {review.comment}
                      </span>
                    </Card>
                  ))}
                </div>
              </DealCard>
            )}
          </div>
        </div>

        <Modal open={open} size="sm">
          <Card shape="smooth">
            <div className="flex items-center justify-between p-4 md:p-6">
              <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
                {t("Invitation")}
              </p>
              <IconButton
                size="sm"
                shape="full"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <Icon icon="lucide:x" className="h-4 w-4" />
              </IconButton>
            </div>
            <div className="p-4 md:px-6 md:py-8">
              <div className="mx-auto w-full max-w-xs">
                <p className="text-sm text-muted-500 dark:text-muted-400">
                  {t(
                    "Please enter the amount you would like to trade with the user"
                  )}
                </p>
                <Input
                  type="number"
                  label={t("Amount")}
                  placeholder={t("Enter Amount")}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  min={offer?.minAmount}
                  max={wallet ? wallet.balance : offer?.maxAmount}
                />
              </div>
              {/* wallet balance */}
              <Card className="mt-6 p-3">
                <div className="flex items-center justify-between gap-2 ">
                  <span className="text-sm text-muted-500 dark:text-muted-400">
                    {t("Wallet Balance")}
                  </span>
                  <span className="text-sm text-muted-500 dark:text-muted-400">
                    {wallet ? wallet.balance : 0} {offer?.currency}
                  </span>
                </div>
                {/* wallet remaining balance */}
                <div className="flex items-center justify-between gap-2 ">
                  <span className="text-sm text-muted-500 dark:text-muted-400">
                    {t("Remaining Balance")}
                  </span>
                  <span className="text-sm text-muted-500 dark:text-muted-400">
                    {wallet ? wallet.balance - amount : 0} {offer?.currency}
                  </span>
                </div>
              </Card>
            </div>
            <div className="p-4 md:p-6 ">
              <div className="flex w-full justify-end gap-2">
                <Button
                  shape="smooth"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  {t("Cancel")}
                </Button>
                <Button
                  variant="solid"
                  color="primary"
                  shape="smooth"
                  onClick={trade}
                  loading={isLoading}
                  disabled={
                    isLoading ||
                    amount <= 0 ||
                    (offer ? amount > offer.amount - offer.inOrder : false) ||
                    (wallet ? amount > wallet.balance : false)
                  }
                >
                  {t("Trade")}
                </Button>
              </div>
            </div>
          </Card>
        </Modal>
      </main>
    </Layout>
  );
};
export default P2pOffer;
