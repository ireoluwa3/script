import React, { memo, useEffect } from "react";
import Layout from "@/layouts/Nav";
import { Orderbook } from "@/components/pages/futures/orderbook/Orderbook";
import { Trades } from "@/components/pages/futures/trades";
import { Chart } from "@/components/pages/futures/chart";
import { Markets } from "@/components/pages/futures/markets";
import { Ticker } from "@/components/pages/futures/ticker";
import { Order } from "@/components/pages/futures/order";
import { Orders } from "@/components/pages/futures/orders";
import useFuturesMarketStore from "@/stores/futures/market";

const TradePage = () => {
  const { market } = useFuturesMarketStore();

  return (
    <Layout
      title={market?.symbol || "Connecting..."}
      color="muted"
      horizontal
      darker
    >
      <div className="relative grid grid-cols-1 md:grid-cols-12 gap-1 mt-1 mb-5">
        <div className="col-span-1 md:col-span-12 lg:col-span-9 grid grid-cols-1 md:grid-cols-9 gap-1">
          <div className="border-thin col-span-1 md:col-span-9 min-h-[8vh] order-1 bg-white dark:bg-muted-900">
            <Ticker />
          </div>
          <div className="border-thin col-span-1 md:col-span-3 min-h-[50vh] md:min-h-[100vh] order-3 md:order-2 bg-white dark:bg-muted-900">
            <Orderbook />
          </div>
          <div className="w-full h-full col-span-1 md:col-span-6 flex flex-col gap-1 order-2 md:order-3">
            <div className="border-thin h-full min-h-[60vh] bg-white dark:bg-muted-900">
              <Chart />
            </div>
            <div className="border-thin h-full min-h-[40vh] bg-white dark:bg-muted-900">
              <Order />
            </div>
          </div>
        </div>
        <div className="col-span-1 md:col-span-12 lg:col-span-3 flex flex-col sm:flex-row lg:flex-col gap-1 order-4">
          <div className="border-thin h-full min-h-[55vh] w-full bg-white dark:bg-muted-900">
            <Markets />
          </div>
          <div className="border-thin h-full min-h-[45vh] w-full min-w-[220px] bg-white dark:bg-muted-900">
            <Trades />
          </div>
        </div>
        <div className="border-thin col-span-1 md:col-span-12 min-h-[40vh] order-5 bg-white dark:bg-muted-900">
          <Orders />
        </div>
      </div>
    </Layout>
  );
};

export default memo(TradePage);
