import React, { type FC, useState, useEffect } from "react";
import Avatar from "@/components/elements/base/avatar/Avatar";
import Button from "@/components/elements/base/button/Button";
import ButtonLink from "@/components/elements/base/button-link/ButtonLink";
import Card from "@/components/elements/base/card/Card";
import Tag from "@/components/elements/base/tag/Tag";
import Table from "@/components/elements/base/table/Table";
import TH from "@/components/elements/base/table/TH";
import TD from "@/components/elements/base/table/TD";
import Pagination from "@/components/elements/base/pagination/Pagination";
import Select from "@/components/elements/form/select/Select";
import $fetch from "@/utils/api";
import { formatDate } from "date-fns";
import { useTranslation } from "next-i18next";
interface TicketsTableProps {
  title?: string;
}
const TicketsTable: FC<TicketsTableProps> = ({ title = "Recent Tickets" }) => {
  const { t } = useTranslation();
  const [items, setItems] = useState<SupportTicket[]>([]);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    currentPage: 1,
    perPage: 10,
    totalPages: 0,
  });
  // Function to fetch tickets
  const fetchTickets = async () => {
    try {
      const { data, error } = await $fetch({
        url: "/api/user/support/ticket",
        silent: true,
      });
      if (!error) {
        setItems(data.items);
        setPagination(data.pagination);
      } else {
        console.error("Failed to fetch tickets:", error);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };
  // Use effect to fetch tickets on component mount
  useEffect(() => {
    fetchTickets();
  }, []);
  const tagStatusMap = {
    OPEN: "primary",
    CLOSED: "muted",
    PENDING: "warning",
    REPLIED: "info",
  };
  const importanceStatusMap = (importance: string, status: string) => {
    if (status === "CLOSED") return "bg-muted-200 dark:bg-muted-800";
    if (importance === "LOW" && ["OPEN", "PENDING", "REPLIED"].includes(status))
      return "bg-success-500";
    if (
      importance === "MEDIUM" &&
      ["OPEN", "PENDING", "REPLIED"].includes(status)
    )
      return "bg-yellow-400";
    if (
      importance === "HIGH" &&
      ["OPEN", "PENDING", "REPLIED"].includes(status)
    )
      return "bg-danger-500";
    return "";
  };
  return (
    <div className="w-full">
      <Card shape="smooth" color="contrast" className="overflow-x-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-sans text-base font-medium leading-tight tracking-wider text-muted-800 dark:text-white">
            {title}
          </h3>
          <div className="flex">
            <Button
              color="primary"
              size="sm"
              className="!h-9 !min-w-[64px] !rounded-e-none"
            >
              {t("All")}
            </Button>
            <Button size="sm" className="!h-9 !min-w-[64px] !rounded-s-none">
              {t("Open")}
            </Button>
          </div>
        </div>
        <Table className="font-sans">
          <thead>
            <tr>
              <TH>{t("Title")}</TH>
              <TH>{t("Status")}</TH>
              <TH>{t("Priority")}</TH>
              <TH className="min-w-[180px]">{t("Customer")}</TH>
              <TH>{t("Date")}</TH>
              <TH className="ltablet:hidden">{t("Assignees")}</TH>
              <TH>{t("Action")}</TH>
            </tr>
          </thead>
          <tbody>
            {items.map((ticket, index) => (
              <tr
                key={index}
                className="transition-colors duration-300 hover:bg-muted-50 dark:hover:bg-muted-900"
              >
                <TD className="text-sm font-medium text-muted-800 dark:text-muted-100">
                  <span className="line-clamp-1">{ticket.subject}</span>
                </TD>
                <TD className="text-sm font-medium text-muted-500 dark:text-muted-400">
                  <Tag
                    color={(tagStatusMap[ticket.status] as any) || "default"}
                    variant={"pastel"}
                  >
                    {ticket.status}
                  </Tag>
                </TD>
                <TD className="text-sm font-medium text-muted-500 dark:text-muted-400">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full
                      ${importanceStatusMap(ticket.importance, ticket.status)}
                    `}
                    ></div>
                    <span className="font-sans text-sm text-muted-500 dark:text-muted-400">
                      {ticket.importance}
                    </span>
                  </div>
                </TD>
                <TD className="text-sm font-medium text-muted-800 dark:text-muted-100">
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={
                        ticket.user?.avatar || "/img/avatars/placeholder.webp"
                      }
                      size="xxs"
                    />
                    <div className="font-sans">
                      <p className="leading-none text-sm text-muted-800 dark:text-muted-100">
                        {ticket.user?.firstName} {ticket.user?.lastName}
                      </p>
                      <span className="block text-xs text-muted-400">
                        {ticket.user?.email}
                      </span>
                    </div>
                  </div>
                </TD>
                <TD className="text-xs font-medium text-muted-500 dark:text-muted-400">
                  {formatDate(new Date(ticket.createdAt), "MMM dd, yyyy")}
                </TD>
                <TD className="ltablet:hidden">
                  <div className="flex items-center">
                    <Avatar
                      size="xxs"
                      overlaps
                      src={
                        ticket.chat?.agent?.avatar ||
                        "/img/avatars/placeholder.webp"
                      }
                      alt="product image"
                    />
                  </div>
                </TD>
                <TD className="text-sm font-medium text-muted-500 dark:text-muted-400">
                  <ButtonLink href="#" size="sm">
                    {t("Details")}
                  </ButtonLink>
                </TD>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
      <div className="mt-4 flex items-center justify-between gap-6">
        <div className="max-w-[180px]">
          <Select
            color="contrast"
            name="pageSize"
            value={pagination.perPage}
            options={[
              {
                value: "5",
                label: "5 per page",
              },
              {
                value: "10",
                label: "10 per page",
              },
              {
                value: "15",
                label: "15 per page",
              },
              {
                value: "20",
                label: "20 per page",
              },
            ]}
            onChange={(e) => {
              const pageSize = parseInt(e.target.value);
              setPagination({ ...pagination, perPage: pageSize });
            }}
          />
        </div>
        <div>
          <Pagination
            buttonSize="sm"
            currentPage={pagination.currentPage}
            totalCount={pagination.totalItems}
            pageSize={pagination.perPage}
            onPageChange={(page) => {
              setPagination({ ...pagination, currentPage: page });
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default TicketsTable;
