import React, { useEffect, useState } from "react";
import Layout from "@/layouts/Default";
import Button from "@/components/elements/base/button/Button";
import Card from "@/components/elements/base/card/Card";
import { useRouter } from "next/router";
import { PageHeader } from "@/components/elements/base/page-header";
import useP2PStore from "@/stores/user/p2p/trade";
import { Chat } from "@/components/pages/user/Chat";
import { TradeInfo } from "@/components/pages/user/p2p/TradeInfo";
import Modal from "@/components/elements/base/modal/Modal";
import Input from "@/components/elements/form/input/Input";
import Textarea from "@/components/elements/form/textarea/Textarea";
import { useDashboardStore } from "@/stores/dashboard";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { Icon } from "@iconify/react";
import Alert from "@/components/elements/base/alert/Alert";
import { useTranslation } from "next-i18next";
const TradeDetails = () => {
  const { t } = useTranslation();
  const { profile } = useDashboardStore();
  const {
    trade,
    initializeWebSocket,
    disconnectWebSocket,
    setIsSeller,
    isSeller,
    handleFileUpload,
    isReplying,
    replyToTrade,
    fetchTrade,
    cancelTrade,
    markAsPaidTrade,
    disputeTrade,
    cancelDisputeTrade,
    releaseTrade,
    refundTrade,
    submitReview,
    reviewRating,
    setReviewRating,
    hoverRating,
    setHoverRating,
    comment,
    setComment,
  } = useP2PStore();
  const [isCancellingOpen, setIsCancellingOpen] = useState(false);
  const [isPayingOpen, setIsPayingOpen] = useState(false);
  const [isDisputingOpen, setIsDisputingOpen] = useState(false);
  const [isCancelDisputeOpen, setIsCancelDisputeOpen] = useState(false);
  const [isReleasingOpen, setIsReleasingOpen] = useState(false);
  const [isRefundingOpen, setIsRefundingOpen] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [hasReviewed, setHasReviewed] = useState(false);
  const [isReviewingOpen, setIsReviewingOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { id } = router.query as {
    id: string;
  };
  useEffect(() => {
    if (!router.isReady || !profile) return;
    fetchTrade(id);
    initializeWebSocket(profile.id, id);
    return () => {
      disconnectWebSocket();
    };
  }, [router.isReady, profile]);
  useEffect(() => {
    if (!trade) return;
    setIsSeller(trade.seller.id === profile?.id);
    setHasReviewed(
      trade.offer.p2pReviews.some(
        (review) => review.reviewer.id === profile?.id
      )
    );
  }, [trade]);
  const messageSide = (userId) => {
    return userId === profile?.id ? "left" : "right";
  };
  if (!trade) return null;

  const renderDisputeMessage = () => {
    if (trade.status === "DISPUTE_OPEN") {
      return (
        <div className="w-full">
          {trade.p2pDisputes[0]?.status === "PENDING" && (
            <div className="px-5 pb-5">
              <Alert color="warning" className="w-full text-sm">
                {t("Trade is in dispute, please wait until it is reviewed.")}
              </Alert>
            </div>
          )}
          {trade.p2pDisputes[0]?.status === "IN_PROGRESS" && (
            <div className="px-5 pb-5">
              <Alert color="warning" className="w-full text-sm">
                {trade.p2pDisputes[0]?.resolution}
              </Alert>
            </div>
          )}
        </div>
      );
    }
  };

  const renderButtons = () => {
    const buttons: JSX.Element[] = [];
    if (trade.status === "PENDING") {
      buttons.push(
        <div key="cancel-trade" className="w-full">
          <Button
            color="danger"
            variant="solid"
            className="w-full"
            onClick={() => setIsCancellingOpen(true)}
          >
            {t("Cancel Trade")}
          </Button>
        </div>
      );
      if (!isSeller) {
        buttons.push(
          <div key="pay-trade" className="w-full">
            <Button
              color="success"
              variant="solid"
              className="w-full"
              onClick={() => setIsPayingOpen(true)}
            >
              {t("Submit Transaction ID")}
            </Button>
          </div>
        );
      }
    }
    if (trade.status === "PAID" && !trade.p2pDisputes.length) {
      buttons.push(
        <div key="dispute-trade" className="w-full">
          <Button
            color="warning"
            variant="solid"
            className="w-full"
            onClick={() => setIsDisputingOpen(true)}
          >
            {t("Dispute Trade")}
          </Button>
        </div>
      );
    }
    if (
      trade.status === "DISPUTE_OPEN" &&
      trade.p2pDisputes[0]?.status === "PENDING" &&
      trade.p2pDisputes[0]?.raisedBy?.id === profile?.id
    ) {
      buttons.push(
        <div key="cancel-dispute" className="w-full">
          <Button
            color="warning"
            variant="solid"
            className="w-full"
            onClick={() => setIsCancelDisputeOpen(true)}
          >
            {t("Cancel Dispute")}
          </Button>
        </div>
      );
    }
    if (isSeller && ["DISPUTE_OPEN", "PAID"].includes(trade.status)) {
      buttons.push(
        <div key="release-trade" className="w-full">
          <Button
            color="primary"
            variant="solid"
            className="w-full"
            onClick={() => setIsReleasingOpen(true)}
          >
            {t("Release Trade")}
          </Button>
        </div>
      );
    }
    if (!isSeller && ["COMPLETED"].includes(trade.status) && !hasReviewed) {
      buttons.push(
        <div key="review-offer" className="w-full">
          <Button
            color="warning"
            variant="solid"
            className="w-full"
            onClick={() => setIsReviewingOpen(true)}
          >
            {t("Review Offer")}
          </Button>
        </div>
      );
    }
    return buttons;
  };

  const hasButtons = renderButtons().length > 0;
  return (
    <Layout title={t("Trade Details")} color="muted" horizontal={true}>
      <div className="pt-20 pe-4 pb-20">
        <PageHeader title={`Trade #${trade.id}`} BackPath="/user/p2p/trade" />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 ltablet:grid-cols-12 mt-4">
          <div className="order-last md:order-1 col-span-1 lg:col-span-8 ltablet:col-span-8">
            <Chat
              messages={trade.messages || []}
              handleFileUpload={handleFileUpload}
              messageSide={messageSide}
              user1={trade.user}
              user2={trade.seller}
              reply={replyToTrade}
              isReplying={isReplying}
              canReply={
                !["CANCELLED", "COMPLETED", "REFUNDED"].includes(trade.status)
              }
            />
          </div>
          <div className="col-span-1 lg:col-span-4 ltablet:col-span-4">
            <div className="relative">
              <Card shape="smooth" color="contrast">
                <TradeInfo />
                {renderDisputeMessage()}
                {trade.status !== "CLOSED" && hasButtons && (
                  <div className="border-t-2 border-dashed border-muted-200 p-6 dark:border-muted-800">
                    <div className="flex flex-col items-center justify-center gap-2">
                      {renderButtons()}
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal open={isCancellingOpen} size="sm">
        <Card shape="smooth">
          <div className="flex items-center justify-between p-4 md:p-6">
            <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
              {t("Cancel Trade")}
            </p>

            <IconButton
              size="sm"
              shape="full"
              onClick={() => setIsCancellingOpen(false)}
            >
              <Icon icon="lucide:x" className="h-4 w-4" />
            </IconButton>
          </div>
          <div className="p-4 md:p-6">
            <p className="text-sm text-muted-500 dark:text-muted-400">
              {t(
                "Are you sure you want to cancel the trade? This action cannot be undone."
              )}
            </p>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex gap-x-2 justify-end">
              <Button
                color="danger"
                onClick={async () => {
                  await cancelTrade();
                  setIsCancellingOpen(false);
                }}
              >
                {t("Submit")}
              </Button>
            </div>
          </div>
        </Card>
      </Modal>

      <Modal open={isPayingOpen} size="sm">
        <Card shape="smooth">
          <div className="flex items-center justify-between p-4 md:p-6">
            <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
              {t("Send Payment Transaction ID")}
            </p>
            <IconButton
              size="sm"
              shape="full"
              onClick={() => setIsPayingOpen(false)}
            >
              <Icon icon="lucide:x" className="h-4 w-4" />
            </IconButton>
          </div>
          <div className="p-4 md:p-6">
            <p className="text-muted-400 dark:text-muted-600 text-sm mb-4">
              {t(
                "Please enter the transaction id of the payment, so the seller can verify it."
              )}
            </p>
            <Input
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              shape="curved"
              placeholder={t("Transaction Hash")}
              label={t("Transaction Hash")}
            />
          </div>
          <div className="p-4 md:p-6">
            <div className="flex gap-x-2 justify-end">
              <Button
                color="success"
                onClick={async () => {
                  await markAsPaidTrade(txHash);
                  setIsPayingOpen(false);
                  setTxHash("");
                }}
              >
                {t("Submit")}
              </Button>
            </div>
          </div>
        </Card>
      </Modal>

      <Modal open={isDisputingOpen} size="sm">
        <Card shape="smooth">
          <div className="flex items-center justify-between p-4 md:p-6">
            <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
              {t("Dispute Trade")}
            </p>
            <IconButton
              size="sm"
              shape="full"
              onClick={() => setIsDisputingOpen(false)}
            >
              <Icon icon="lucide:x" className="h-4 w-4" />
            </IconButton>
          </div>
          <div className="p-4 md:p-6">
            <span className="text-muted-400 dark:text-muted-600">
              {t(
                "Please enter the reason for the dispute, we will review it and get back to you."
              )}
            </span>
            <Textarea
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              shape="curved"
              placeholder={t("Reason")}
              label={t("Reason")}
            />
          </div>
          <div className="p-4 md:p-6">
            <div className="flex gap-x-2 justify-end">
              <Button
                color="warning"
                onClick={async () => {
                  await disputeTrade(disputeReason);
                  setIsDisputingOpen(false);
                  setDisputeReason("");
                }}
              >
                {t("Submit")}
              </Button>
            </div>
          </div>
        </Card>
      </Modal>

      <Modal open={isCancelDisputeOpen} size="sm">
        <Card shape="smooth">
          <div className="flex items-center justify-between p-4 md:p-6">
            <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
              {t("Cancel Dispute")}
            </p>
            <IconButton
              size="sm"
              shape="full"
              onClick={() => setIsCancelDisputeOpen(false)}
            >
              <Icon icon="lucide:x" className="h-4 w-4" />
            </IconButton>
          </div>
          <div className="p-4 md:p-6">
            <p className="text-sm text-muted-500 dark:text-muted-400">
              {t(
                "Are you sure you want to cancel the dispute? This action cannot be undone, and you will not be able to open a dispute again."
              )}
            </p>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex gap-x-2 justify-end">
              <Button
                color="primary"
                onClick={async () => {
                  await cancelDisputeTrade();
                  setIsCancelDisputeOpen(false);
                }}
              >
                {t("Close Dispute")}
              </Button>
            </div>
          </div>
        </Card>
      </Modal>

      <Modal open={isReleasingOpen} size="sm">
        <Card shape="smooth">
          <div className="flex items-center justify-between p-4 md:p-6">
            <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
              {t("Release Funds")}
            </p>

            <IconButton
              size="sm"
              shape="full"
              onClick={() => setIsReleasingOpen(false)}
            >
              <Icon icon="lucide:x" className="h-4 w-4" />
            </IconButton>
          </div>
          <div className="p-4 md:p-6">
            <p className="text-sm text-muted-500 dark:text-muted-400">
              {t(
                "Are you sure you want to release the funds? This action cannot be undone."
              )}
            </p>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex gap-x-2 justify-end">
              <Button
                color="primary"
                onClick={async () => {
                  await releaseTrade();
                  setIsReleasingOpen(false);
                }}
              >
                {t("Submit")}
              </Button>
            </div>
          </div>
        </Card>
      </Modal>

      <Modal open={isRefundingOpen} size="sm">
        <Card shape="smooth">
          <div className="flex items-center justify-between p-4 md:p-6">
            <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
              {t("Refund Funds")}
            </p>

            <IconButton
              size="sm"
              shape="full"
              onClick={() => setIsRefundingOpen(false)}
            >
              <Icon icon="lucide:x" className="h-4 w-4" />
            </IconButton>
          </div>
          <div className="p-4 md:p-6">
            <p className="text-sm text-muted-500 dark:text-muted-400">
              {t(
                "Are you sure you want to refund the funds? This action cannot be undone."
              )}
            </p>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex gap-x-2 justify-end">
              <Button
                color="primary"
                onClick={async () => {
                  await refundTrade();
                  setIsRefundingOpen(false);
                }}
              >
                {t("Submit")}
              </Button>
            </div>
          </div>
        </Card>
      </Modal>

      <Modal open={isReviewingOpen} size="sm">
        <Card shape="smooth">
          <div className="flex items-center justify-between p-4 md:p-6">
            <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
              {t("Review Offer")}
            </p>

            <IconButton
              size="sm"
              shape="full"
              onClick={() => setIsReviewingOpen(false)}
            >
              <Icon icon="lucide:x" className="h-4 w-4" />
            </IconButton>
          </div>
          <div className="p-4 md:p-6">
            <p className="text-sm text-muted-500 dark:text-muted-400">
              {t("Please leave a review for the offer.")}
            </p>

            <div className="flex gap-2">
              {Array.from({ length: 5 }, (_, i) => (
                <Icon
                  key={i} // Add key here
                  icon="uim:star"
                  className={`w-5 h-5 ${
                    i < (hoverRating || reviewRating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  onMouseOver={() => setHoverRating(i + 1)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setReviewRating(i + 1)}
                />
              ))}
            </div>
            <div className="space-y-5">
              <Textarea
                label={t("Message")}
                placeholder={t("Write your message...")}
                name="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex gap-x-2 justify-end">
              <Button
                color="primary"
                onClick={async () => {
                  setIsSubmitting(true);
                  submitReview();
                  setIsReviewingOpen(false);
                  setIsSubmitting(false);
                }}
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {t("Submit")}
              </Button>
            </div>
          </div>
        </Card>
      </Modal>
    </Layout>
  );
};
export default TradeDetails;
