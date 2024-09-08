import { AnalyticsChartProps } from "./AnalyticsChart.types";
import React, { useState, useEffect } from "react";
import $fetch from "@/utils/api";
import { FilterCharts } from "./FilterCharts";
import { MainChart } from "./MainChart";
import { Header } from "./Header";

const timeframes = [
  { value: "d", label: "D", text: "Today" },
  { value: "w", label: "W", text: "This Week" },
  { value: "m", label: "M", text: "This Month" },
  { value: "6m", label: "6M", text: "These 6 Months" },
  { value: "y", label: "Y", text: "This Year" },
];

const removeEmptyFilters = (obj: {
  [key: string]: any;
}): { [key: string]: any } => {
  // Filter recursively and remove empty entries
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];

    if (typeof value === "object" && value !== null) {
      const nested = removeEmptyFilters(value);

      if (Object.keys(nested).length > 0) {
        acc[key] = nested;
      }
    } else if (value !== "" && value !== undefined) {
      acc[key] = value;
    }

    return acc;
  }, {} as { [key: string]: any });
};

const AnalyticsChartBase = ({
  model,
  modelName,
  postTitle,
  cardName = modelName,
  availableFilters = {},
  color = "primary",
  params,
  path,
  pathModel,
}: AnalyticsChartProps) => {
  const [data, setData] = useState<{ date: string; count: number }[]>([]);
  const [filterResults, setFilterResults] = useState<{
    [key: string]: {
      [filterValue: string]: {
        count: number;
        change: number;
        percentage: number;
      };
    };
  }>({});
  const [timeframe, setTimeframe] = useState({ value: "m", label: "Month" });
  const [filters, setFilters] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchData = async () => {
      const effectiveFilters = removeEmptyFilters(filters); // Filter directly

      const { data, error } = await $fetch({
        url: path || "/api/admin/analysis",
        method: "POST",
        params: {
          ...params,
          ...(path ? (pathModel ? { model } : {}) : { model }),
          timeframe: timeframe.value,
          ...(Object.keys(effectiveFilters).length
            ? { filter: JSON.stringify(effectiveFilters) }
            : {}),
        },
        body: {
          availableFilters,
        },
        silent: true,
      });

      if (!error) {
        setData(data.chartData);
        setFilterResults(data.filterResults);
      }
    };
    fetchData();
  }, [timeframe, filters, model]);

  const handleFilterChange = (key: string, selection: { value: string }) => {
    setFilters((prev) => {
      const updated = {
        ...prev,
        [key]: selection.value || undefined, // Set directly or remove
      };

      return removeEmptyFilters(updated); // Apply filtering
    });
  };

  return (
    <>
      <Header modelName={modelName} postTitle={postTitle} />

      <FilterCharts
        availableFilters={availableFilters}
        filterResults={filterResults}
        timeframe={timeframe}
        cardName={cardName}
        modelName={modelName}
        timeframes={timeframes}
      />

      <MainChart
        filters={filters}
        handleFilterChange={handleFilterChange}
        data={data}
        color={color}
        timeframe={timeframe}
        setTimeframe={setTimeframe}
        timeframes={timeframes}
        availableFilters={availableFilters}
      />
    </>
  );
};

export const AnalyticsChart = AnalyticsChartBase;
