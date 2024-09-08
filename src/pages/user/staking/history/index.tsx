"use client";
import React, { useEffect, useState } from "react";
import Layout from "@/layouts/Default";
import { DataTable } from "@/components/elements/base/datatable";
import { addDays, format } from "date-fns";
import ActionItem from "@/components/elements/base/dropdown-action/ActionItem";
import { Panel } from "@/components/elements/base/panel";
import Avatar from "@/components/elements/base/avatar/Avatar";
import { MashImage } from "@/components/elements/MashImage";
import Progress from "@/components/elements/base/progress/Progress";
import Card from "@/components/elements/base/card/Card";
import Button from "@/components/elements/base/button/Button";
import { StakeLogInfo } from "@/components/pages/user/staking/StakeLogInfo";
import $fetch from "@/utils/api";
import { useDataTable } from "@/stores/datatable";
import { useTranslation } from "next-i18next";
const api = "/api/ext/staking/log";
const columnConfig: ColumnConfigType[] = [
  {
    field: "pool.name",
    label: "Pool",
    sublabel: "pool.currency",
    type: "text",
    sortable: true,
    sortName: "pool.name",
    hasImage: true,
    imageKey: "pool.icon",
    placeholder: "/img/placeholder.svg",
    className: "rounded-full",
    getValue: (item) => item.pool?.name,
    getSubValue: (item) => item.pool?.currency,
  },
  {
    field: "createdAt",
    label: "Start Date",
    type: "text",
    sortable: true,
    getValue: (item) =>
      item.createdAt
        ? `${format(new Date(item.createdAt), "dd MMM yyyy HH:mm")}`
        : "N/A",
  },
  {
    field: "durationId",
    label: "End Date",
    type: "text",
    sortable: true,
    getValue: (item) =>
      item.createdAt && item.duration
        ? format(
            addDays(new Date(item.createdAt), item.duration.duration),
            "dd MMM yyyy HH:mm"
          )
        : "N/A",
  },
  {
    field: "amount",
    label: "Amount",
    type: "number",
    sortable: true,
  },
  {
    field: "duration.interestRate",
    label: "ROI",
    type: "number",
    sortable: true,
    getValue: (item) =>
      item.duration?.interestRate
        ? `${item.amount * (item.duration?.interestRate / 100)}`
        : "N/A",
  },
  {
    field: "status",
    label: "Status",
    type: "select",
    sortable: true,
    options: [
      { value: "ACTIVE", label: "Active", color: "primary" },
      { value: "RELEASED", label: "Released", color: "info" },
      { value: "COLLECTED", label: "Collected", color: "success" },
    ],
  },
];
type StakingLog = {
  id: string;
  userId: string;
  poolId: string;
  durationId: string;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  pool: {
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
    deletedAt: string;
  };
  duration: {
    id: string;
    duration: number;
    interestRate: number;
  };
};
const StakingLogs = () => {
  const { t } = useTranslation();
  const [selectedItem, setSelectedItem] = useState<StakingLog | null>(null);
  const { fetchData } = useDataTable();
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
  const [isCollectable, setIsCollectable] = useState(false);
  const openStake = async (item) => {
    setSelectedItem(item);
    const durationInDays = item.duration.duration;
    const endDate = addDays(new Date(item.createdAt), durationInDays);
    const countdown = calculateCountdown(item.createdAt, endDate.toISOString());
    setCountdown(countdown);
  };
  useEffect(() => {
    if (selectedItem) {
      const intervalId = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown) {
            const durationInDays = selectedItem.duration.duration;
            const endDate = addDays(
              new Date(prevCountdown.startDate),
              durationInDays
            );
            const newCountdown = calculateCountdown(
              prevCountdown.startDate,
              endDate.toISOString()
            );
            setIsCollectable(newCountdown.progress >= 100);
            return newCountdown;
          }
          return null;
        });
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [selectedItem]);
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
  const collectStake = async (id) => {
    const { error } = await $fetch({
      url: `/api/ext/staking/log/${id}`,
      method: "POST",
    });
    if (!error) {
      setSelectedItem(null);
      fetchData();
    }
  };
  return (
    <Layout title={t("Staking Logs")} color="muted">
      <DataTable
        title={t("Staking Logs")}
        endpoint={api}
        columnConfig={columnConfig}
        isCrud={false}
        hasStructure={false}
        hasAnalytics
        dropdownActionsSlot={(item) => (
          <>
            <ActionItem
              key="showPanel"
              icon="ph:eye"
              text="View"
              subtext="View details"
              onClick={() => {
                openStake(item);
              }}
            />
          </>
        )}
      />
      <Panel
        isOpen={!!selectedItem}
        title={t("Stake")}
        tableName={t("Stake")}
        size="xl"
        onClose={() => setSelectedItem(null)}
      >
        {selectedItem && (
          <div className="flex flex-col justify-between gap-5 text-sm text-muted-800 dark:text-muted-200">
            <div className="contact flex w-full flex-row items-center justify-center gap-3 lg:justify-start">
              <div className="relative">
                <Avatar
                  size="md"
                  src={
                    selectedItem.pool.icon ||
                    `/img/crypto/${selectedItem.pool.currency.toLowerCase()}.webp`
                  }
                />
                <MashImage
                  src={`/img/crypto/${selectedItem.pool.chain}.webp`}
                  width={16}
                  height={16}
                  alt="chain"
                  className="absolute right-0 bottom-0"
                />
              </div>
              <div className="text-start font-sans">
                <h4 className="text-base font-medium leading-tight text-muted-800 dark:text-muted-100">
                  {selectedItem.pool.currency} ({selectedItem.pool.name})
                </h4>
                <p className="font-sans text-xs text-muted-400">
                  {selectedItem.pool.description}
                </p>
              </div>
            </div>

            <StakeLogInfo log={selectedItem} />

            {countdown && (
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

            <Card className="p-2 w-full">
              <Button
                onClick={() => {
                  collectStake(selectedItem.id);
                }}
                color="primary"
                shape="rounded"
                className="w-full"
                disabled={!isCollectable}
              >
                {t("Collect")}
              </Button>
            </Card>
          </div>
        )}
      </Panel>
    </Layout>
  );
};
export default StakingLogs;
