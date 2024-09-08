import React, { useEffect } from "react";
import Layout from "@/layouts/Default";
import Button from "@/components/elements/base/button/Button";
import Card from "@/components/elements/base/card/Card";
import ListWidgetItem from "@/components/widgets/ListWidgetItem";
import { useRouter } from "next/router";
import { PageHeader } from "@/components/elements/base/page-header";
import {
  Popover,
  PopoverContentClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/elements/addons/popover/Popover";
import { TicketInformation } from "@/components/pages/user/support/TicketInformation";
import useTicketStore from "@/stores/user/support";
import { Chat } from "@/components/pages/user/Chat";
import { useDashboardStore } from "@/stores/dashboard";
import { useTranslation } from "next-i18next";
const TicketDetails = () => {
  const { t } = useTranslation();
  const { profile } = useDashboardStore();
  const {
    ticket,
    initializeWebSocket,
    disconnectWebSocket,
    fetchTicket,
    resolveTicket,
    setIsSupport,
    replyToTicket,
    handleFileUpload,
    isReplying,
  } = useTicketStore();

  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    if (router.isReady) {
      setIsSupport(false);
      fetchTicket(id as string);
      initializeWebSocket(id as string);
      return () => {
        disconnectWebSocket();
      };
    }
  }, [router.isReady]);
  const messageSide = (userId) => {
    return userId === profile?.id ? "right" : "left";
  };
  return (
    <Layout title={t("Ticket Details")} color="muted" horizontal>
      <div className="mt-5 pe-3 sm:pe-10 mb-5 sm:mb-20 pt-16">
        <PageHeader title={ticket?.subject || "Loading..."} />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 ltablet:grid-cols-12 mt-4">
          <div className="order-last md:order-1 col-span-1 lg:col-span-8 ltablet:col-span-8">
            <Chat
              messages={ticket?.messages || []}
              handleFileUpload={handleFileUpload}
              messageSide={messageSide}
              user1={ticket?.user}
              user2={ticket?.agent}
              reply={replyToTicket}
              isReplying={isReplying}
              canReply={ticket?.status !== "CLOSED"}
            />
          </div>
          <div className="col-span-1 lg:col-span-4 ltablet:col-span-4">
            <div className="relative">
              <Card shape="smooth" color="contrast">
                <TicketInformation />
                <div className="p-6 ">
                  <h4 className="mb-4 font-sans text-xs font-medium uppercase text-muted-500">
                    {t("Supported by")}
                  </h4>

                  <ul className="inner-list">
                    <li>
                      <ListWidgetItem
                        href="#"
                        avatarSize="xxs"
                        avatar={
                          ticket?.agent?.avatar ||
                          "/img/avatars/placeholder.webp"
                        }
                        title={
                          ticket?.agent
                            ? `${ticket?.agent?.firstName} ${ticket?.agent?.lastName}`
                            : "No agent assigned"
                        }
                        text="Support Agent"
                        itemAction={<></>}
                      />
                    </li>
                  </ul>
                </div>
                {ticket?.status !== "CLOSED" && (
                  <div className="border-t-2 border-dashed border-muted-200 p-6 dark:border-muted-800">
                    <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
                      <Popover placement="top">
                        <PopoverTrigger>
                          <Button
                            color="danger"
                            variant="solid"
                            className="w-full"
                          >
                            {t("Close Ticket")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="relative z-50 flex w-72 gap-2 rounded-lg border border-muted-200 bg-white p-4 shadow-xl shadow-muted-300/30 dark:border-muted-700 dark:bg-muted-800 dark:shadow-muted-800/20">
                          <div className="flex flex-col gap-2 w-full">
                            <h4 className="font-sans text-xs font-medium uppercase text-muted-500">
                              {ticket?.status === "OPEN"
                                ? "Close Ticket"
                                : "Reopen Ticket"}
                            </h4>
                            <p className="text-xs text-muted-400">
                              {ticket?.status === "OPEN"
                                ? "Are you sure you want to close this ticket?"
                                : "Are you sure you want to reopen this ticket?"}
                            </p>
                            <div className="flex gap-2">
                              <PopoverContentClose>
                                <Button
                                  color="success"
                                  variant="solid"
                                  className="w-full"
                                  onClick={() =>
                                    resolveTicket(id as string, "CLOSED")
                                  }
                                >
                                  {t("Confirm")}
                                </Button>
                              </PopoverContentClose>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default TicketDetails;
