import React, { memo, useEffect, useState } from "react";
import { Tab } from "@/components/elements/base/tab";
import { formatDate } from "date-fns";
import useFuturesMarketStore from "@/stores/futures/market";
import { useDashboardStore } from "@/stores/dashboard";
import useWebSocketStore from "@/stores/trade/ws";
import { useRouter } from "next/router";
import { useFuturesOrderStore } from "@/stores/futures/order";
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

const OrdersBase = () => {
  const { profile } = useDashboardStore();
  const tabs = [
    { value: "OPEN", label: "Open Orders" },
    { value: "HISTORY", label: "Orders History" },
    { value: "OPEN_POSITIONS", label: "Open Positions" },
    { value: "POSITIONS_HISTORY", label: "Positions History" },
  ];
  const { market } = useFuturesMarketStore();
  const getPrecision = (type: string) => Number(market?.precision?.[type] || 8);

  const {
    subscribe,
    unsubscribe,
    addMessageHandler,
    removeMessageHandler,
    futuresOrdersConnection,
  } = useWebSocketStore();

  const {
    ordersTab,
    setOrdersTab,
    positions,
    openPositions,
    orders,
    openOrders,
    fetchPositions,
    fetchOrders,
    setPositions,
    setOpenPositions,
    setOrders,
    setOpenOrders,
    handleOrderMessage,
    loading,
    cancelOrder,
    closePosition,
  } = useFuturesOrderStore();
  const router = useRouter();

  useEffect(() => {
    if (router.isReady && profile?.id && market) {
      const handleOpen = () => {
        subscribe("futuresOrdersConnection", "orders", { userId: profile.id });
      };

      const handleClose = () => {
        unsubscribe("futuresOrdersConnection", "orders", {
          userId: profile.id,
        });
      };

      if (futuresOrdersConnection.isConnected) {
        handleOpen();
      } else {
        addMessageHandler(
          "futuresOrdersConnection",
          handleOpen,
          (msg) => msg.type === "open"
        );
      }

      return () => {
        removeMessageHandler("futuresOrdersConnection", handleOpen);
        handleClose();
      };
    }
  }, [router.isReady, profile?.id, futuresOrdersConnection.isConnected]);

  useEffect(() => {
    if (market && router.isReady && profile?.id) {
      subscribe("futuresOrdersConnection", "orders", { userId: profile.id });

      return () => {
        unsubscribe("futuresOrdersConnection", "orders", {
          userId: profile.id,
        });
      };
    }
  }, [market, router.isReady, profile?.id]);

  useEffect(() => {
    if (!futuresOrdersConnection?.isConnected) return;

    addMessageHandler(
      "futuresOrdersConnection",
      handleOrderMessage,
      (message) => message.stream === "openOrders"
    );

    return () => {
      removeMessageHandler("futuresOrdersConnection", handleOrderMessage);
      setPositions([]);
      setOpenPositions([]);
      setOrders([]);
      setOpenOrders([]);
    };
  }, [futuresOrdersConnection?.isConnected]);

  const debouncedFetchPositions = debounce(fetchPositions, 100);
  const debouncedFetchOrders = debounce(fetchOrders, 100);

  useEffect(() => {
    if (market && router.isReady && ordersTab) {
      if (ordersTab === "OPEN_POSITIONS" || ordersTab === "POSITIONS_HISTORY") {
        debouncedFetchPositions(market.currency, market.pair);
      } else {
        debouncedFetchOrders(market.currency, market.pair);
      }
    }
  }, [market, router.isReady, ordersTab]);

  const commonOrdersColumnConfig = [
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

  const ordersColumnConfig = [
    ...commonOrdersColumnConfig,
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
              market.currency,
              market.pair,
              row.createdAt
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

  const commonPositionsColumnConfig = [
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
      field: "entryPrice",
      label: "Entry Price",
      type: "number",
      sortable: true,
      getValue: (row) => row.entryPrice?.toFixed(getPrecision("price")),
    },
    {
      field: "amount",
      label: "Amount",
      type: "number",
      sortable: true,
      getValue: (row) => row.amount?.toFixed(getPrecision("amount")),
    },
    {
      field: "leverage",
      label: "Leverage",
      type: "number",
      sortable: true,
      getValue: (row) => row.leverage?.toFixed(getPrecision("amount")),
    },
    {
      field: "unrealizedPnl",
      label: "Unrealized PnL",
      type: "number",
      sortable: true,
      getValue: (row) => row.unrealizedPnl?.toFixed(getPrecision("amount")),
    },
    {
      field: "stopLossPrice",
      label: "Stop Loss Price",
      type: "number",
      sortable: true,
      getValue: (row) =>
        row.stopLossPrice?.toFixed(getPrecision("price")) || "N/A",
    },
    {
      field: "takeProfitPrice",
      label: "Take Profit Price",
      type: "number",
      sortable: true,
      getValue: (row) =>
        row.takeProfitPrice?.toFixed(getPrecision("price")) || "N/A",
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

  const positionsColumnConfig = [
    ...commonPositionsColumnConfig,
    {
      field: "actions",
      label: "Actions",
      type: "actions",
      sortable: false,
      actions: [
        {
          icon: "mdi:close",
          color: "danger",
          onClick: async (row) => {
            await closePosition(row.id, market.currency, market.pair, row.side);
          },
          size: "sm",
          loading,
          disabled: loading,
          tooltip: "Close Position",
        },
      ],
    },
  ];

  const getColumnConfig: (tab: string) => any = (tab) => {
    if (tab === "OPEN") return ordersColumnConfig;
    if (tab === "HISTORY") return commonOrdersColumnConfig;
    if (tab === "OPEN_POSITIONS") return positionsColumnConfig;
    if (tab === "POSITIONS_HISTORY") return commonPositionsColumnConfig;
  };

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
          columnConfig={getColumnConfig("OPEN")}
          shape="straight"
          size="xs"
          border={false}
        />
      )}
      {ordersTab === "HISTORY" && (
        <ObjectTable
          items={orders}
          setItems={setOrders}
          columnConfig={getColumnConfig("HISTORY")}
          shape="straight"
          size="xs"
          border={false}
        />
      )}
      {ordersTab === "OPEN_POSITIONS" && market?.currency && market?.pair && (
        <ObjectTable
          items={openPositions}
          setItems={setOpenPositions}
          columnConfig={getColumnConfig("OPEN_POSITIONS")}
          shape="straight"
          size="xs"
          border={false}
        />
      )}
      {ordersTab === "POSITIONS_HISTORY" && (
        <ObjectTable
          items={positions}
          setItems={setPositions}
          columnConfig={getColumnConfig("POSITIONS_HISTORY")}
          shape="straight"
          size="xs"
          border={false}
        />
      )}
    </div>
  );
};

export const Orders = memo(OrdersBase);
