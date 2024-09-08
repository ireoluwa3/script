import React, { memo, useEffect, useState } from "react";
import { Tab } from "@/components/elements/base/tab";
import { formatDate } from "date-fns";
import useMarketStore from "@/stores/trade/market";
import { useDashboardStore } from "@/stores/dashboard";
import useWebSocketStore from "@/stores/trade/ws";
import { useRouter } from "next/router";
import { useOrderStore } from "@/stores/trade/order";
import { ObjectTable } from "@/components/elements/base/object-table";
import { debounce } from "lodash";

const statusClass = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "text-primary-500";
    case "OPEN":
      return "text-warning-500";
    case "CLOSED":
      return "text-success-500";
    case "CANCELED":
      return "text-danger-500";
    case "EXPIRED":
    case "REJECTED":
    default:
      return "text-muted-500";
  }
};

const resultClass = (result: string) => {
  switch (result) {
    case "WIN":
      return "text-success-500";
    case "LOSS":
      return "text-danger-500";
    case "DRAW":
      return "text-muted-500";
    default:
      return "text-warning-500";
  }
};

const OrdersBase = () => {
  const { profile } = useDashboardStore();
  const tabs = [
    { value: "OPEN", label: "Open Orders" },
    { value: "HISTORY", label: "Order History" },
    { value: "AI", label: "AI Investments" },
  ];
  const { market } = useMarketStore();
  const getPrecision = (type: string) => Number(market?.precision?.[type] || 8);

  const {
    subscribe,
    unsubscribe,
    addMessageHandler,
    removeMessageHandler,
    ordersConnection,
  } = useWebSocketStore();

  const {
    ordersTab,
    setOrdersTab,
    orders,
    openOrders,
    fetchOrders,
    setOrders,
    setOpenOrders,
    handleOrderMessage,
    loading,
    cancelOrder,
    aiInvestments,
    cancelAiInvestmentOrder,
    fetchAiInvestments,
    setAiInvestments,
  } = useOrderStore();
  const router = useRouter();

  useEffect(() => {
    if (router.isReady && profile?.id && market && !market.isEco) {
      const handleOpen = () => {
        subscribe("ordersConnection", "orders", { userId: profile.id });
      };

      const handleClose = () => {
        unsubscribe("ordersConnection", "orders", { userId: profile.id });
      };

      if (ordersConnection.isConnected) {
        handleOpen();
      } else {
        addMessageHandler(
          "ordersConnection",
          handleOpen,
          (msg) => msg.type === "open"
        );
      }

      return () => {
        removeMessageHandler("ordersConnection", handleOpen);
        handleClose();
      };
    }
  }, [
    router.isReady,
    profile?.id,
    market?.isEco,
    subscribe,
    unsubscribe,
    ordersConnection.isConnected,
    addMessageHandler,
    removeMessageHandler,
  ]);

  const debouncedFetchOrders = debounce(fetchOrders, 100);

  useEffect(() => {
    if (market && router.isReady && ordersTab) {
      if (ordersTab === "AI") {
        fetchAiInvestments();
      } else {
        const { isEco } = market;
        debouncedFetchOrders(isEco, market.currency, market.pair);
      }
    }
  }, [market, router.isReady, ordersTab]);

  const columnConfig: ColumnConfigType[] = [
    {
      field: "createdAt",
      label: "Date",
      type: "date",
      sortable: true,
      filterable: false,
      getValue: (row) =>
        formatDate(new Date(row.createdAt), "yyyy-MM-dd HH:mm"),
    },
    {
      field: "type",
      label: "Type",
      type: "text",
      sortable: true,
    },
    {
      field: "side",
      label: "Side",
      type: "text",
      sortable: true,
      getValue: (row) => (
        <span
          className={
            row.side === "BUY" ? "text-success-500" : "text-danger-500"
          }
        >
          {row.side}
        </span>
      ),
    },
    {
      field: "price",
      label: "Price",
      type: "number",
      sortable: true,
      getValue: (row) => row.price?.toFixed(getPrecision("price")),
    },
    {
      field: "amount",
      label: "Amount",
      type: "number",
      sortable: true,
      getValue: (row) => row.amount?.toFixed(getPrecision("amount")),
    },
    {
      field: "filled",
      label: "Filled",
      type: "number",
      sortable: true,
      getValue: (row) => row.filled?.toFixed(getPrecision("amount")),
    },
    {
      field: "remaining",
      label: "Remaining",
      type: "number",
      sortable: true,
      getValue: (row) => row.remaining?.toFixed(getPrecision("amount")),
    },
    {
      field: "cost",
      label: "Cost",
      type: "number",
      sortable: true,
      getValue: (row) => row.cost?.toFixed(getPrecision("price")),
    },
    {
      field: "status",
      label: "Status",
      type: "text",
      sortable: true,
      getValue: (row) => (
        <span className={statusClass(row.status)}>{row.status}</span>
      ),
    },
  ];

  const openColumnConfig: ColumnConfigType[] = [
    ...columnConfig,
    {
      field: "actions",
      label: "Actions",
      type: "actions",
      sortable: false,
      actions: [
        {
          icon: "mdi:cancel",
          color: "danger",
          onClick: async (row) => {
            await cancelOrder(
              row.id,
              market.isEco,
              market.currency,
              market.pair,
              market.isEco ? row.createdAt : undefined
            );
          },
          size: "sm",
          loading,
          disabled: loading,
          tooltip: "Cancel Order",
        },
      ],
    },
  ];

  const aiColumnConfig: ColumnConfigType[] = [
    {
      field: "plan",
      label: "Plan",
      type: "text",
      sortable: true,
      getValue: (row) => row.plan.title,
    },
    {
      field: "createdAt",
      label: "Start Date",
      type: "date",
      sortable: true,
      filterable: false,
      getValue: (row) =>
        formatDate(new Date(row.createdAt), "yyyy-MM-dd HH:mm"),
    },
    {
      field: "duration",
      label: "Ends in",
      type: "text",
      sortable: true,
      getValue: (row) => {
        const { duration, timeframe } = row.duration;
        const startDate = new Date(row.createdAt);
        const endDate = new Date(startDate);
        switch (timeframe) {
          case "HOUR":
            endDate.setHours(startDate.getHours() + duration);
            break;
          case "DAY":
            endDate.setDate(startDate.getDate() + duration);
            break;
          case "WEEK":
            endDate.setDate(startDate.getDate() + duration * 7);
            break;
          case "MONTH":
            endDate.setMonth(startDate.getMonth() + duration);
            break;
          default:
            endDate.setDate(startDate.getDate() + duration);
        }

        return formatDate(endDate, "yyyy-MM-dd HH:mm");
      },
    },
    {
      field: "amount",
      label: "Amount",
      type: "number",
      sortable: true,
      getValue: (row) => row.amount?.toFixed(getPrecision("amount")),
    },
    {
      field: "profit",
      label: "Profit",
      type: "number",
      sortable: true,
      getValue: (row) => (
        <span className={resultClass(row.result)}>
          {row.profit?.toFixed(getPrecision("price")) || "PENDING"}
        </span>
      ),
    },
    {
      field: "result",
      label: "Result",
      type: "text",
      sortable: true,
      getValue: (row) => (
        <span className={resultClass(row.result)}>
          {row.result || "PENDING"}
        </span>
      ),
    },
    {
      field: "status",
      label: "Status",
      type: "text",
      sortable: true,
      getValue: (row) => (
        <span className={statusClass(row.status)}>{row.status}</span>
      ),
    },
    {
      field: "actions",
      label: "Actions",
      type: "actions",
      sortable: false,
      actions: [
        {
          icon: "mdi:cancel",
          color: "danger",
          onClick: async (row) => {
            await cancelAiInvestmentOrder(
              row.id,
              market.isEco,
              market.currency,
              market.pair
            );
          },
          size: "sm",
          loading,
          disabled: loading,
          tooltip: "Cancel Investment",
          condition: (row) => row.status !== "ACTIVE",
        },
      ],
    },
  ];

  useEffect(() => {
    if (!market || !router.isReady || !profile?.id) return;

    const { isEco } = market;
    const path = isEco
      ? `/api/ext/ecosystem/market/${market?.symbol}?userId=${profile?.id}`
      : `/api/exchange/order?userId=${profile?.id}`;

    subscribe("ordersConnection", "orders", { userId: profile.id });

    return () => {
      unsubscribe("ordersConnection", "orders", { userId: profile.id });
    };
  }, [market, router.isReady, profile?.id, subscribe, unsubscribe]);

  useEffect(() => {
    if (!ordersConnection?.isConnected) return;

    addMessageHandler(
      "ordersConnection",
      handleOrderMessage,
      (message) => message.stream === "openOrders"
    );

    return () => {
      removeMessageHandler("ordersConnection", handleOrderMessage);
      setOrders([]);
      setOpenOrders([]);
    };
  }, [
    ordersConnection?.isConnected,
    addMessageHandler,
    removeMessageHandler,
    "ordersConnection",
  ]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex gap-2 border-b border-muted-200 dark:border-muted-800 md:overflow-x-auto">
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            label={tab.label}
            tab={ordersTab}
            setTab={setOrdersTab}
            color="warning"
          />
        ))}
      </div>
      {ordersTab === "OPEN" && market?.currency && market?.pair && (
        <ObjectTable
          items={openOrders}
          setItems={setOpenOrders}
          columnConfig={openColumnConfig}
          shape="straight"
          size="xs"
          border={false}
        />
      )}
      {ordersTab === "HISTORY" && (
        <ObjectTable
          items={orders}
          setItems={setOrders}
          columnConfig={columnConfig}
          shape="straight"
          size="xs"
          border={false}
        />
      )}
      {ordersTab === "AI" && (
        <ObjectTable
          items={aiInvestments}
          setItems={setAiInvestments}
          columnConfig={aiColumnConfig}
          shape="straight"
          size="xs"
          border={false}
        />
      )}
    </div>
  );
};

export const Orders = memo(OrdersBase);
