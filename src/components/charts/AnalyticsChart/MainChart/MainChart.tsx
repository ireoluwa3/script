import Card from "@/components/elements/base/card/Card";
import { MainChartProps } from "./MainChart.types";
import ListBox from "@/components/elements/form/listbox/Listbox";
import Button from "@/components/elements/base/button/Button";
import { ApexOptions } from "apexcharts";
import { themeColors } from "@/components/charts/chart-colors";
import dynamic from "next/dynamic";
import { useTranslation } from "next-i18next";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
const MainChartBase = ({
  availableFilters,
  filters,
  handleFilterChange,
  data,
  color,
  timeframe,
  setTimeframe,
  timeframes,
}: MainChartProps) => {
  const { t } = useTranslation();
  const chartOptions: ApexOptions = {
    series: [
      {
        name: "Count",
        data: data.map((item) => item.count),
      },
    ],
    chart: {
      height: 300,
      type: "area",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    colors: [
      themeColors[
        availableFilters["status"]?.find(
          (item) => item.value === filters["status"]
        )?.color || color
      ],
    ],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [2, 2, 2],
      curve: "smooth",
    },
    fill: {
      type: "gradient",
    },
    grid: {
      row: {
        colors: ["transparent", "transparent"],
        opacity: 0.5,
      },
    },
    tooltip: {
      x: {
        formatter: (val) => data[val - 1]?.date || "", // Display date directly
      },
    },
    xaxis: {
      categories: data.map((item, idx) => idx + 1), // Maintain numerical labeling
    },
  };
  const { series, ...options } = chartOptions;
  return (
    <Card shape="smooth" color="contrast" className="p-4">
      <div className="px-4 flex justify-between items-center flex-col md:flex-row gap-5">
        <div className="flex gap-2 flex-col sm:flex-row w-full">
          {Object.keys(availableFilters).map((key) => (
            <ListBox
              key={key}
              selected={
                filters[key]
                  ? availableFilters[key].find(
                      (item) => item.value === filters[key]
                    )
                  : { value: "", label: "All" }
              }
              setSelected={(selection) => handleFilterChange(key, selection)}
              options={[{ value: "", label: "All" }, ...availableFilters[key]]}
              label={`Select ${key.toUpperCase()}`}
              classNames="max-w-full md:max-w-[200px]"
            />
          ))}
        </div>
        <div className="flex gap-1 flex-col pt-2">
          <span className="font-sans text-xs font-medium text-muted-500 dark:text-muted-400">
            {t("Timeframe")}
          </span>
          <div className="flex gap-2 ">
            {timeframes.map(({ value, label }) => (
              <Button
                key={value}
                variant="outlined"
                shape={"rounded"}
                color={timeframe.value === value ? "primary" : "muted"}
                onClick={() => setTimeframe({ value, label })}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <Chart
        type="area"
        series={series}
        options={options}
        height={options.chart?.height}
        width={options.chart?.width}
      />
    </Card>
  );
};
export const MainChart = MainChartBase;
