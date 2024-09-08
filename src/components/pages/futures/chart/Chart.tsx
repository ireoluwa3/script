import { memo, useEffect, useRef, useState } from "react";
import { ChartProps } from "./Chart.types";
import useWebSocketStore from "@/stores/trade/ws";
import {
  LanguageCode,
  ResolutionString,
  ThemeName,
  Timezone,
  TradingTerminalFeatureset,
  widget,
} from "@/data/charting_library/charting_library";
import $fetch from "@/utils/api";
import {
  intervalDurations,
  intervals,
  resolutionMap,
  resolutionMap_provider,
} from "@/utils/chart";
import { useMediaQuery } from "react-responsive";
import { breakpoints } from "@/utils/breakpoints";
import { useDashboardStore } from "@/stores/dashboard";
import useFuturesMarketStore from "@/stores/futures/market";

interface Bar {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  time: string;
}

const ChartBase = ({}: ChartProps) => {
  const [chartReady, setChartReady] = useState(false);
  const { unsubscribe, subscribe, addMessageHandler, removeMessageHandler } =
    useWebSocketStore();
  const [tvWidget, setTvWidget] = useState<any>(null);
  const { market } = useFuturesMarketStore();

  const disabled_features: TradingTerminalFeatureset[] = [
    "header_compare",
    "symbol_search_hot_key",
    "header_symbol_search",
    "border_around_the_chart",
    "popup_hints",
    "timezone_menu",
  ];
  const enabled_features: TradingTerminalFeatureset[] = [
    "save_chart_properties_to_local_storage",
    "use_localstorage_for_settings",
    "dont_show_boolean_study_arguments",
    "hide_last_na_study_output",
    "constraint_dialogs_movement",
    "countdown",
    "insert_indicator_dialog_shortcut",
    "shift_visible_range_on_new_bar",
    "hide_image_invalid_symbol",
    "pre_post_market_sessions",
    "use_na_string_for_not_available_values",
    "create_volume_indicator_by_default",
    "determine_first_data_request_size_using_visible_range",
    "end_of_period_timescale_marks",
    "secondary_series_extend_time_scale",
    "shift_visible_range_on_new_bar",
  ];
  const isMobile = useMediaQuery({ maxWidth: parseInt(breakpoints.sm) - 1 });
  if (isMobile) {
    disabled_features.push("left_toolbar");
    disabled_features.push("header_fullscreen_button");
    disabled_features.push("timeframes_toolbar");
  } else {
    enabled_features.push("chart_style_hilo");
    enabled_features.push("chart_style_hilo_last_price");
    enabled_features.push("side_toolbar_in_fullscreen_mode");
  }

  const [interval, setInterval] = useState<string | null>("1h");
  const subscribers = useRef<any>({});

  const DataFeed = function () {
    if (!market) return console.error("Currency and pair are required");

    const historyPath = `/api/ext/futures/chart`;

    const pricescale = Math.pow(10, market.precision?.price || 8);
    return {
      async onReady(callback) {
        setTimeout(() => {
          callback({
            exchanges: [],
            symbols_types: [],
            supported_resolutions: intervals,
          });
        }, 0);
      },

      async resolveSymbol(
        symbolName,
        onSymbolResolvedCallback,
        onResolveErrorCallback
      ) {
        setTimeout(() => {
          onSymbolResolvedCallback({
            data_status: "streaming",
            pricescale,
            name: symbolName,
            full_name: symbolName,
            description: symbolName,
            ticker: symbolName,
            type: "crypto",
            session: "24x7",
            format: "price",
            exchange: process.env.NEXT_PUBLIC_SITE_NAME,
            listed_exchange: process.env.NEXT_PUBLIC_SITE_NAME,
            timezone: "Etc/UTC",
            volume_precision: market?.precision?.amount || 8,
            supported_resolutions: intervals,
            minmov: 1,
            has_intraday: true,
            visible_plots_set: false,
          });
        }, 0);
      },

      async getBars(
        symbolInfo,
        resolution,
        periodParams,
        onHistoryCallback,
        onErrorCallback
      ) {
        const duration = intervalDurations[resolution] || 0;

        const from = periodParams.from * 1000;
        const to = periodParams.to * 1000;

        try {
          // Fetch historical data from your API
          const response = await $fetch({
            url: historyPath,
            silent: true,
            params: {
              symbol: `${market?.symbol}`,
              interval: resolutionMap_provider["native"][resolution],
              from: from,
              to: to,
              duration: duration,
            },
          });

          // Parse the data from the response
          const data = await response.data;

          // Check if data was returned
          if (data && data.length) {
            // Convert data to the format required by TradingView
            const bars = data.map((item) => ({
              time: item[0],
              open: item[1],
              high: item[2],
              low: item[3],
              close: item[4],
              volume: item[5],
            }));

            // Sort the bars by time
            bars.sort((a, b) => a.time - b.time);

            onHistoryCallback(bars);
          } else {
            onHistoryCallback([], { noData: true });
          }
        } catch (error) {
          onErrorCallback(new Error("Failed to fetch historical data"));
          return;
        }
      },

      subscribeBars(
        symbolInfo,
        resolution,
        onRealtimeCallback,
        subscribeUID,
        onResetCacheNeededCallback
      ) {
        if (interval && interval !== resolutionMap[resolution]) {
          unsubscribe("futuresTradesConnection", "ohlcv", {
            interval: interval,
            symbol: symbolInfo.ticker,
          });
        }

        // Store the subscriber's callback and symbol information in a global map
        const subscriberInfo = {
          callback: onRealtimeCallback,
          symbolInfo: symbolInfo,
          resolution: resolution,
        };

        subscribers.current[subscribeUID] = subscriberInfo;

        // Subscribe to the trades connection
        subscribe("futuresTradesConnection", "ohlcv", {
          interval: resolutionMap[resolution],
          symbol: symbolInfo.ticker,
        });

        // Update the current interval
        setInterval(resolution);
      },

      unsubscribeBars(subscriberUID) {
        if (!subscribers.current[subscriberUID]) return;
        // Remove the subscriber from the global map
        const { symbolInfo, resolution } = subscribers.current[subscriberUID];
        delete subscribers.current[subscriberUID];

        unsubscribe("futuresTradesConnection", "ohlcv", {
          interval: resolutionMap[resolution],
          symbol: symbolInfo.ticker,
        });
        removeMessageHandler("futuresTradesConnection", handleBarsMessage);

        // Reset the interval if it's the same as the unsubscribed one
        if (interval === resolution) {
          setInterval(null);
        }
      },
    };
  };

  useEffect(() => {
    if (market?.symbol) {
      initTradingView();
    }
  }, [market?.symbol]);

  const handleBarsMessage = (message: any) => {
    const { data } = message;
    if (!data) return;
    // Data processing

    const bar = data[0];

    const newBar: Bar = {
      time: bar[0],
      open: bar[1],
      high: bar[2],
      low: bar[3],
      close: bar[4],
      volume: bar[5],
    };

    // Update the subscriber's chart with the new bar
    Object.keys(subscribers.current).forEach((key) => {
      const subscriber = subscribers.current[key];
      if (subscriber.callback) {
        subscriber.callback(newBar);
      }
    });
  };

  useEffect(() => {
    if (!market || !chartReady) return;

    const messageFilter = (message: any) =>
      message.stream && message.stream.startsWith("ohlcv");

    addMessageHandler(
      "futuresTradesConnection",
      handleBarsMessage,
      messageFilter
    );

    return () => {
      removeMessageHandler("futuresTradesConnection", handleBarsMessage);
    };
  }, [market, chartReady]);

  const { isDark } = useDashboardStore();

  useEffect(() => {
    if (
      chartReady &&
      tvWidget?._ready &&
      typeof tvWidget.changeTheme === "function"
    ) {
      tvWidget.changeTheme((isDark ? "Dark" : "Light") as ThemeName);
    }
  }, [isDark, chartReady]);

  async function initTradingView() {
    // cleanup
    if (tvWidget) {
      tvWidget.remove();
      setTvWidget(null);
    }

    if (!market) return console.error("Currency and pair are required");
    const datafeed = (await DataFeed()) as any;
    if (!datafeed) return;
    const widgetOptions = {
      fullscreen: false,
      autosize: true,
      symbol: market?.symbol,
      interval: "60" as ResolutionString,
      container: "tv_chart_container",
      datafeed: datafeed,
      library_path: "/lib/chart/charting_library/",
      locale: "en" as LanguageCode,
      theme: (isDark ? "Dark" : "Light") as ThemeName,
      timezone: "Etc/UTC" as Timezone,
      client_id: "chart",
      disabled_features: disabled_features,
      enabled_features: enabled_features,
      overrides: {
        "mainSeriesProperties.showCountdown": true,
        "highLowAvgPrice.highLowPriceLinesVisible": true,
        "mainSeriesProperties.highLowAvgPrice.highLowPriceLabelsVisible": true,
        "mainSeriesProperties.showPriceLine": true,
        "paneProperties.background": isDark ? "#18181b" : "#ffffff",
        "paneProperties.backgroundType": "solid",
      },
      custom_css_url: "/lib/chart/themed.css",
    };

    const tv = new widget(widgetOptions);
    setTvWidget(tv);

    tv.onChartReady(() => {
      setChartReady(true);
    });
  }

  return <div id="tv_chart_container" className="w-full h-full"></div>;
};

export const Chart = memo(ChartBase);
