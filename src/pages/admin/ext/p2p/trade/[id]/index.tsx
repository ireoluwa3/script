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
    handleFileUpload,
    isReplying,
    replyToTrade,
    fetchTrade,
    adminResolveDispute,
    adminCloseDispute,
    adminCompleteTrade,
    adminCancelTrade,
  } = useP2PStore();
  const [isResolvingDispute, setIsResolvingDispute] = useState(false);
  const [isCancelDisputeOpen, setIsCancelDisputeOpen] = useState(false);
  const [isCancellingOpen, setIsCancellingOpen] = useState(false);
  const [isCompletingOpen, setIsCompletingOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
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
    if (
      ["DISPUTE_OPEN"].includes(trade?.status) &&
      ["PENDING", "IN_PROGRESS"].includes(trade.p2pDisputes[0]?.status)
    ) {
      buttons.push(
        <div className="w-full">
          <Button
            key="resolve-dispute"
            color="success"
            variant="solid"
            className="w-full"
            onClick={() =>
              adminResolveDispute(trade.p2pDisputes[0]?.resolution)
            }
          >
            {trade.p2pDisputes[0]?.resolution
              ? "Edit Resolution"
              : "Resolve Dispute"}
          </Button>
        </div>
      );
      buttons.push(
        <div className="w-full">
          <Button
            key="close-dispute"
            color="success"
            variant="solid"
            className="w-full"
            onClick={() => adminCloseDispute()}
          >
            {t("Close Dispute")}
          </Button>
        </div>
      );
    }
    if (["PENDING", "PAID", "DISPUTE_OPEN"].includes(trade?.status)) {
      buttons.push(
        <div className="w-full">
          <Button
            key="cancel-trade"
            color="danger"
            variant="solid"
            className="w-full"
            onClick={() => adminCancelTrade()}
          >
            {t("Cancel Trade")}
          </Button>
        </div>
      );
    }
    if (["DISPUTE_OPEN", "PAID"].includes(trade?.status)) {
      buttons.push(
        <div className="w-full">
          <Button
            key="release-trade"
            color="success"
            variant="solid"
            className="w-full"
            onClick={() => adminCompleteTrade()}
          >
            {t("Complete Trade")}
          </Button>
        </div>
      );
    }
    return buttons;
  };
  const hasButtons = renderButtons().length > 0;
  return (
    <Layout title={t("Trade Details")} color="muted" horizontal={true}>
      <div className="pt-20 pe-4">
        <PageHeader
          title={`Trade #${trade.id}`}
          BackPath="/admin/ext/p2p/trade"
        />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 ltablet:grid-cols-12 mt-4">
          <div className="order-last md:order-1 col-span-1 lg:col-span-8 ltablet:col-span-8">
            <Chat
              messages={trade.messages || []}
              handleFileUpload={handleFileUpload}
              messageSide={messageSide}
              user1={profile}
              user2={trade.seller || trade.user}
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

      {/* admin modals */}
      <Modal open={isCancelDisputeOpen} size="sm">
        <Card shape="smooth">
          <div className="flex items-center justify-between p-4 md:p-6">
            <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
              {t("Resolve Dispute")}
            </p>
            <IconButton
              size="sm"
              shape="full"
              onClick={() => setIsResolvingDispute(false)}
            >
              <Icon icon="lucide:x" className="h-4 w-4" />
            </IconButton>
          </div>
          <div className="p-4 md:p-6">
            <span className="text-muted-400 dark:text-muted-600">
              {t("Please enter the resolution for the dispute.")}
            </span>
            <Textarea
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              shape="curved"
              placeholder={t("Resolution")}
              label={t("Resolution")}
            />
          </div>
          <div className="p-4 md:p-6">
            <div className="flex gap-x-2 justify-end">
              <Button
                color="warning"
                onClick={async () => {
                  await adminResolveDispute(disputeReason);
                  setIsResolvingDispute(false);
                  setDisputeReason("");
                }}
              >
                {t("Submit")}
              </Button>
            </div>
          </div>
        </Card>
      </Modal>

      {/* cancel dispute */}
      <Modal open={isCancellingOpen} size="sm">
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
            <span className="text-muted-400 dark:text-muted-600">
              {t("Are you sure you want to cancel the dispute")}
            </span>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex gap-x-2 justify-end">
              <Button
                color="warning"
                onClick={async () => {
                  await adminCancelTrade();
                  setIsCancelDisputeOpen(false);
                }}
              >
                {t("Confirm")}
              </Button>
            </div>
          </div>
        </Card>
      </Modal>

      <Modal open={isCompletingOpen} size="sm">
        <Card shape="smooth">
          <div className="flex items-center justify-between p-4 md:p-6">
            <p className="font-sans text-lg font-medium text-muted-900 dark:text-white">
              {t("Complete Trade")}
            </p>
            <IconButton
              size="sm"
              shape="full"
              onClick={() => setIsCompletingOpen(false)}
            >
              <Icon icon="lucide:x" className="h-4 w-4" />
            </IconButton>
          </div>
          <div className="p-4 md:p-6">
            <span className="text-muted-400 dark:text-muted-600">
              {t("Are you sure you want to release the trade")}
            </span>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex gap-x-2 justify-end">
              <Button
                color="warning"
                onClick={async () => {
                  await adminCompleteTrade();
                  setIsCompletingOpen(false);
                }}
              >
                {t("Confirm")}
              </Button>
            </div>
          </div>
        </Card>
      </Modal>

      <Modal open={isResolvingDispute} size="sm">
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
            <span className="text-muted-400 dark:text-muted-600">
              {t("Are you sure you want to cancel the trade")}
            </span>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex gap-x-2 justify-end">
              <Button
                color="warning"
                onClick={async () => {
                  await adminCancelTrade();
                  setIsCancellingOpen(false);
                }}
              >
                {t("Confirm")}
              </Button>
            </div>
          </div>
        </Card>
      </Modal>
    </Layout>
  );
};
export default TradeDetails;
export const permission = "Access P2P Trade Management";
