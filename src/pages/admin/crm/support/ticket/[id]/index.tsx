import React, { useEffect, useState } from "react";
import Layout from "@/layouts/Default";
import Avatar from "@/components/elements/base/avatar/Avatar";
import Button from "@/components/elements/base/button/Button";
import Card from "@/components/elements/base/card/Card";
import DropdownAction from "@/components/elements/base/dropdown-action/DropdownAction";
import ActionItem from "@/components/elements/base/dropdown-action/ActionItem";
import ListWidgetItem from "@/components/widgets/ListWidgetItem";
import { useRouter } from "next/router";
import $fetch from "@/utils/api";
import { PageHeader } from "@/components/elements/base/page-header";
import { formatDate } from "date-fns";
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
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    if (router.isReady) {
      setIsSupport(true);
      fetchTicket(id as string);
      setIsReady(true);
      return () => {
        setIsReady(false);
      };
    }
  }, [router.isReady]);
  useEffect(() => {
    if (isReady) {
      initializeWebSocket(id as string);
      return () => {
        disconnectWebSocket();
      };
    }
  }, [isReady]);
  const handleDeleteTicket = async () => {
    const { error } = await $fetch({
      url: `/api/admin/crm/support/ticket/${id}`,
      method: "DELETE",
      silent: true,
    });
    if (!error) {
      router.push("/admin/crm/support");
    }
  };
  const messageSide = (userId) => {
    return userId === profile?.id ? "right" : "left";
  };
  return (
    <Layout title={t("Ticket Details")} color="muted" horizontal={true}>
      <div className="pt-20 pe-5">
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
                <div className="border-b-2 border-dashed border-muted-200 p-6 dark:border-muted-800">
                  <div className="flex items-center gap-2">
                    <Avatar
                      size="sm"
                      className="bg-muted-100 dark:bg-muted-900"
                      src={
                        ticket?.user?.avatar || "/img/avatars/placeholder.webp"
                      }
                      alt="User photo"
                    />
                    <div className="relative font-sans">
                      <h3 className="font-semibold leading-tight text-muted-800 dark:text-muted-100">
                        {ticket?.user?.firstName} {ticket?.user?.lastName}
                      </h3>
                      <p className="text-xs text-muted-400">
                        {t("Opened on")}{" "}
                        {formatDate(
                          new Date(ticket?.createdAt || new Date()),
                          "MMM dd, yyyy"
                        )}
                      </p>
                    </div>
                    <div className="ms-auto">
                      <DropdownAction orientation="end">
                        <div className="py-2">
                          <ActionItem
                            icon="ph:trash-duotone"
                            text="Delete"
                            subtext="Delete this ticket"
                            onClick={handleDeleteTicket}
                          />
                        </div>
                      </DropdownAction>
                    </div>
                  </div>
                </div>

                <TicketInformation />
                <div className="border-b-2 border-dashed border-muted-200 p-6 dark:border-muted-800">
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
                <div className="p-6">
                  <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
                    <Popover placement="top">
                      <PopoverTrigger>
                        {ticket?.status === "OPEN" ? (
                          <Button
                            color="danger"
                            variant="solid"
                            className="w-full"
                          >
                            {t("Close Ticket")}
                          </Button>
                        ) : (
                          <Button
                            color="success"
                            variant="solid"
                            className="w-full"
                          >
                            {t("Reopen Ticket")}
                          </Button>
                        )}
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
                                onClick={
                                  ticket?.status === "OPEN"
                                    ? () =>
                                        resolveTicket(id as string, "CLOSED")
                                    : () => resolveTicket(id as string, "OPEN")
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
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default TicketDetails;
export const permission = "Access Support Ticket Management";
