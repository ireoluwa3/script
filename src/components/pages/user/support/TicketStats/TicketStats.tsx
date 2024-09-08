import { memo, useState } from "react";
import { TicketStatsProps } from "./TicketStats.types";
import Card from "@/components/elements/base/card/Card";
import Button from "@/components/elements/base/button/Button";
import { useTranslation } from "next-i18next";
const TicketStatsBase = ({}: TicketStatsProps) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");
  return (
    <div className="mb-6">
      <Card color="contrast" className="relative overflow-hidden">
        <div className="border-b border-muted-200 bg-muted-100 px-6 dark:border-muted-800 dark:bg-muted-900/40">
          <div className="-mb-px flex flex-col md:flex-row items-center justify-between">
            <div className="flex gap-6">
              <button
                type="button"
                className={`appearance-none border-b-2 py-4 text-sm transition-colors duration-300
              ${
                activeTab === "overview"
                  ? "border-primary-500 text-muted-800 dark:text-muted-100"
                  : "border-transparent text-muted-400 hover:text-muted-500 dark:text-muted-600 dark:hover:text-muted-300"
              }
            `}
                onClick={() => setActiveTab("overview")}
              >
                {t("Overview")}
              </button>
              <button
                type="button"
                className={`appearance-none border-b-2 py-4 text-sm transition-colors duration-300
              ${
                activeTab === "severity"
                  ? "border-primary-500 text-muted-800 dark:text-muted-100"
                  : "border-transparent text-muted-400 hover:text-muted-500 dark:text-muted-600 dark:hover:text-muted-300"
              }
            `}
                onClick={() => setActiveTab("severity")}
              >
                {t("Severity")}
              </button>
              <button
                type="button"
                className={`appearance-none border-b-2 py-4 text-sm transition-colors duration-300
              ${
                activeTab === "statistics"
                  ? "border-primary-500 text-muted-800 dark:text-muted-100"
                  : "border-transparent text-muted-400 hover:text-muted-500 dark:text-muted-600 dark:hover:text-muted-300"
              }
            `}
                onClick={() => setActiveTab("statistics")}
              >
                {t("Statistics")}
              </button>
            </div>
            <div className="flex items-center gap-2 py-6 md:py-0">
              <Button type="button" size="sm" shape="full" className="w-12">
                {t("1m")}
              </Button>
              <Button type="button" size="sm" shape="full" className="w-12">
                {t("1d")}
              </Button>
              <Button type="button" size="sm" shape="full" className="w-12">
                {t("1w")}
              </Button>
              <Button
                type="button"
                size="sm"
                shape="full"
                color="primary"
                className="w-12"
              >
                {t("1y")}
              </Button>
            </div>
          </div>
        </div>
        <div>
          {activeTab === "overview" ? (
            <div className="grid grid-cols-1 divide-y md:divide-y-0 md:divide-x divide-muted-200 py-6 dark:divide-muted-800 md:grid-cols-2 lg:grid-cols-4 ltablet:grid-cols-4">
              <div className="px-8 py-8 ltablet:py-2 lg:py-2 text-center flex flex-col items-center justify-center h-full">
                <div className="relative">
                  <div className="mb-2">
                    <p className="relative text-4xl font-normal text-muted-800 dark:text-muted-100">
                      <span>21</span>
                      <span className="absolute -top-2 -end-2 h-2.5 w-2.5 rounded-full bg-success-500"></span>
                    </p>
                  </div>
                  <div className="text-xs uppercase tracking-wide text-muted-500 dark:text-muted-400">
                    {t("Open Tickets")}
                  </div>
                </div>
              </div>
              <div className="px-8 py-8 ltablet:py-2 lg:py-2 text-center flex flex-col items-center justify-center h-full">
                <div className="relative">
                  <div className="mb-2">
                    <p className="relative text-4xl font-normal text-muted-800 dark:text-muted-100">
                      <span>1279</span>
                      <span className="absolute -top-2 -end-2 h-2.5 w-2.5 rounded-full bg-muted-300 dark:bg-muted-600"></span>
                    </p>
                  </div>
                  <div className="text-xs uppercase tracking-wide text-muted-500 dark:text-muted-400">
                    {t("Active Customers")}
                  </div>
                </div>
              </div>
              <div className="px-8 py-8 ltablet:py-2 lg:py-2 text-center flex flex-col items-center justify-center h-full">
                <div className="relative">
                  <div className="mb-2">
                    <p className="relative text-4xl font-normal text-muted-800 dark:text-muted-100">
                      <span>2</span>
                      <span className="absolute -top-2 -end-2 h-2.5 w-2.5 rounded-full bg-danger-500"></span>
                    </p>
                  </div>
                  <div className="text-xs uppercase tracking-wide text-muted-500 dark:text-muted-400">
                    {t("Escalated Tickets")}
                  </div>
                </div>
              </div>
              <div className="px-8 py-8 ltablet:py-2 lg:py-2 text-center flex flex-col items-center justify-center h-full">
                <div className="relative">
                  <div className="mb-2">
                    <p className="relative text-4xl font-normal text-muted-800 dark:text-muted-100">
                      <span>
                        9.7
                        <span className="ps-2 text-base text-muted-400">
                          {t("agent")}
                        </span>
                      </span>
                    </p>
                  </div>
                  <div className="text-xs uppercase tracking-wide text-muted-500 dark:text-muted-400">
                    {t("Tickets per day")}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          {activeTab === "severity" ? (
            <div className="grid grid-cols-1 divide-y md:divide-y-0 md:divide-x divide-muted-200 py-6 dark:divide-muted-800 md:grid-cols-2 lg:grid-cols-4 ltablet:grid-cols-4">
              <div className="px-8 py-8 ltablet:py-2 lg:py-2 text-center flex flex-col items-center justify-center h-full">
                <div className="relative">
                  <div className="mb-2">
                    <p className="relative text-4xl font-normal text-muted-800 dark:text-muted-100">
                      <span>176</span>
                      <span className="absolute -top-2 -end-2 h-2.5 w-2.5 rounded-full bg-success-500"></span>
                    </p>
                  </div>
                  <div className="text-xs uppercase tracking-wide text-muted-500 dark:text-muted-400">
                    {t("Low Severity")}
                  </div>
                </div>
              </div>
              <div className="px-8 py-8 ltablet:py-2 lg:py-2 text-center flex flex-col items-center justify-center h-full">
                <div className="relative">
                  <div className="mb-2">
                    <p className="relative text-4xl font-normal text-muted-800 dark:text-muted-100">
                      <span>679</span>
                      <span className="absolute -top-2 -end-2 h-2.5 w-2.5 rounded-full bg-yellow-400"></span>
                    </p>
                  </div>
                  <div className="text-xs uppercase tracking-wide text-muted-500 dark:text-muted-400">
                    {t("Medium Severity")}
                  </div>
                </div>
              </div>
              <div className="px-8 py-8 ltablet:py-2 lg:py-2 text-center flex flex-col items-center justify-center h-full">
                <div className="relative">
                  <div className="mb-2">
                    <p className="relative text-4xl font-normal text-muted-800 dark:text-muted-100">
                      <span>212</span>
                      <span className="absolute -top-2 -end-2 h-2.5 w-2.5 rounded-full bg-danger-500"></span>
                    </p>
                  </div>
                  <div className="text-xs uppercase tracking-wide text-muted-500 dark:text-muted-400">
                    {t("High Severity")}
                  </div>
                </div>
              </div>
              <div className="px-8 py-8 ltablet:py-2 lg:py-2 text-center flex flex-col items-center justify-center h-full">
                <div className="relative">
                  <div className="mb-2">
                    <p className="relative text-4xl font-normal text-muted-800 dark:text-muted-100">
                      <span>
                        2.1
                        <span className="ps-2 text-base text-muted-400">%</span>
                      </span>
                    </p>
                  </div>
                  <div className="text-xs uppercase tracking-wide text-muted-500 dark:text-muted-400">
                    {t("Escalation")}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          {activeTab === "statistics" ? (
            <div className="grid grid-cols-1 divide-y md:divide-y-0 md:divide-x divide-muted-200 py-6 dark:divide-muted-800 md:grid-cols-2 lg:grid-cols-4 ltablet:grid-cols-4">
              <div className="px-8 py-8 ltablet:py-2 lg:py-2 text-center flex flex-col items-center justify-center h-full">
                <div className="relative">
                  <div className="mb-2">
                    <p className="relative text-4xl font-normal text-muted-800 dark:text-muted-100">
                      <span>971</span>
                      <span className="absolute -top-2 -end-2 h-2.5 w-2.5 rounded-full bg-success-500"></span>
                    </p>
                  </div>
                  <div className="text-xs uppercase tracking-wide text-muted-500 dark:text-muted-400">
                    {t("Tickets Opened")}
                  </div>
                </div>
              </div>
              <div className="px-8 py-8 ltablet:py-2 lg:py-2 text-center flex flex-col items-center justify-center h-full">
                <div className="relative">
                  <div className="mb-2">
                    <p className="relative text-4xl font-normal text-muted-800 dark:text-muted-100">
                      <span>876</span>
                      <span className="absolute -top-2 -end-2 h-2.5 w-2.5 rounded-full bg-muted-300 dark:bg-muted-600"></span>
                    </p>
                  </div>
                  <div className="text-xs uppercase tracking-wide text-muted-500 dark:text-muted-400">
                    {t("Tickets Closed")}
                  </div>
                </div>
              </div>
              <div className="px-8 py-8 ltablet:py-2 lg:py-2 text-center flex flex-col items-center justify-center h-full">
                <div className="relative">
                  <div className="mb-2">
                    <p className="relative text-4xl font-normal text-muted-800 dark:text-muted-100">
                      <span>29</span>
                      <span className="absolute -top-2 -end-2 h-2.5 w-2.5 rounded-full bg-danger-500"></span>
                    </p>
                  </div>
                  <div className="text-xs uppercase tracking-wide text-muted-500 dark:text-muted-400">
                    {t("Tickets Escalated")}
                  </div>
                </div>
              </div>
              <div className="px-8 py-8 ltablet:py-2 lg:py-2 text-center flex flex-col items-center justify-center h-full">
                <div className="relative">
                  <div className="mb-2">
                    <p className="relative text-4xl font-normal text-muted-800 dark:text-muted-100">
                      <span>
                        4.3
                        <span className="ps-2 text-base text-muted-400">
                          {t("hours")}
                        </span>
                      </span>
                    </p>
                  </div>
                  <div className="text-xs uppercase tracking-wide text-muted-500 dark:text-muted-400">
                    {t("Response Time")}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </Card>
    </div>
  );
};
export const TicketStats = memo(TicketStatsBase);
