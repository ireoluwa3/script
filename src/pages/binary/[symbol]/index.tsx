import React, { memo, useEffect } from "react";
import { Orders } from "@/components/pages/binary/orders";
import {
  layoutNotPushedClasses,
  layoutPushedClasses,
} from "@/components/layouts/styles";
import { BinaryNav } from "@/components/pages/binary/nav";
import useMarketStore from "@/stores/trade/market";
import { Chart } from "@/components/pages/trade/chart";
import { Order } from "@/components/pages/binary/order";
import { useRouter } from "next/router";

const binaryStatus = Boolean(process.env.NEXT_PUBLIC_BINARY_STATUS || true);

const BinaryTradePageBase = () => {
  const router = useRouter();
  const { setWithEco } = useMarketStore();

  useEffect(() => {
    if (!binaryStatus) {
      router.push("/404");
    } else {
      setWithEco(false);
    }
  }, [router, setWithEco]);

  return (
    <div className="w-full h-full bg-white dark:bg-muted-900 ">
      <div className="sticky top-0 z-50 bg-white dark:bg-muted-900 w-[99%]">
        <BinaryNav />
      </div>

      <div
        className={`top-navigation-wrapper relative min-h-screen transition-all duration-300 dark:bg-muted-1000/[0.96] pt-16 lg:pt-4 pb-20 ${
          false
            ? "is-pushed " + layoutPushedClasses["top-navigation"]
            : layoutNotPushedClasses["top-navigation"]
        } bg-muted-50/[0.96] !pb-0 !pe-0 !pt-0`}
      >
        {/* <LayoutSwitcher /> */}
        <div
          className={`"max-w-full flex h-full min-h-screen flex-col [&>div]:h-full [&>div]:min-h-screen`}
        >
          <div className="relative grid grid-cols-1 md:grid-cols-12 gap-1 mt-1">
            <div className="border-thin col-span-1 md:col-span-10 lg:col-span-11 min-h-[55vh] md:min-h-[calc(100vh_-_120px)] bg-white dark:bg-muted-900">
              <Chart />
            </div>
            <div className="border-thin col-span-1 md:col-span-2 lg:col-span-1 h-full bg-white dark:bg-muted-900">
              <Order />
            </div>
            <div className="border-thin col-span-1 md:col-span-12 min-h-[40vh] bg-white dark:bg-muted-900">
              <Orders />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BinaryTradePage = memo(BinaryTradePageBase);
export default BinaryTradePage;
