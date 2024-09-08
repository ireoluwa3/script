import { FilterChartsProps } from "./FilterCharts.types";
import React from "react";
import { capitalize } from "lodash";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Card from "@/components/elements/base/card/Card";
import Link from "next/link";
import { AnimatedTooltip } from "@/components/elements/base/tooltips/AnimatedTooltip";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { Icon } from "@iconify/react";
import { themeColors } from "@/components/charts/chart-colors";

const FilterChartsBase = ({
  availableFilters,
  filterResults,
  timeframe,
  cardName,
  modelName,
  timeframes,
}: FilterChartsProps) => {
  return (
    <div className="flex flex-col">
      {Object.keys(availableFilters).map((filterCategory) => {
        const isLastCategory =
          Object.keys(availableFilters).indexOf(filterCategory) ===
          Object.keys(availableFilters).length;

        return (
          <div key={filterCategory}>
            {!isLastCategory && (
              <div className="relative mb-4">
                <hr className="border-muted-200 dark:border-muted-700" />
                <span className="absolute inset-0 -top-2 text-center font-semibold text-xs text-muted-500 dark:text-muted-400">
                  <span className="bg-muted-50 dark:bg-muted-900 px-2">
                    {capitalize(filterCategory)}
                  </span>
                </span>
              </div>
            )}

            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-4`}
            >
              {availableFilters[filterCategory].map((filterOption) => {
                const filterValue = filterOption.value as string;
                const value =
                  filterResults[filterCategory]?.[filterValue] || {};

                const filterChange =
                  value.percentage !== undefined ? (
                    value.percentage > 0 ? (
                      `+${value.percentage.toFixed(1)}%`
                    ) : (
                      `${value.percentage.toFixed(1)}%`
                    )
                  ) : (
                    <Skeleton width={32} height={12} borderRadius={24} />
                  );

                const label = availableFilters[filterCategory].find(
                  (item) => item.value === filterValue
                )?.label;

                return (
                  <Card
                    shape="smooth"
                    color="contrast"
                    className="flex justify-between p-4"
                    key={`${filterCategory}_${filterValue}`}
                  >
                    <div className="relative flex flex-col justify-between items-start">
                      <h4 className="font-sans text-xs font-medium uppercase text-muted-500 dark:text-muted-400">
                        <span
                          className={`text-${filterOption.color}-500 dark:text-${filterOption.color}-400`}
                        >
                          {capitalize(label)}{" "}
                        </span>
                        <span className="text-muted-700 dark:text-muted-200 font-semibold">
                          {cardName}
                        </span>
                      </h4>
                      <span className="font-sans text-2xl font-bold text-muted-800 dark:text-muted-300">
                        {value.count !== undefined ? (
                          value.count
                        ) : (
                          <Skeleton width={40} height={12} borderRadius={24} />
                        )}
                      </span>
                      <Link href={filterOption.path || "#"}>
                        <AnimatedTooltip
                          content={`View ${capitalize(label)} ${modelName}`}
                        >
                          <div className="flex items-center gap-2 pt-2">
                            <IconButton
                              variant="pastel"
                              aria-label="Records"
                              color={(filterOption.color as any) || "primary"}
                              shape="full"
                            >
                              <Icon
                                icon={filterOption.icon}
                                color={filterOption.color}
                                className="h-7 w-7"
                              />
                            </IconButton>
                            <div>
                              <p className="font-sans text-xs text-muted-500 dark:text-muted-400 flex gap-1">
                                <span
                                  className={`font-semibold text-${filterOption.color}-500 dark:text-${filterOption.color}-400`}
                                >
                                  {filterChange}
                                </span>
                                {
                                  timeframes.find(
                                    (item) => item.value === timeframe.value
                                  )?.text
                                }
                              </p>
                            </div>
                          </div>
                        </AnimatedTooltip>
                      </Link>
                    </div>

                    <AnimatedTooltip
                      content={`${
                        value.percentage?.toFixed(2) || 0
                      }% of ${modelName} by ${capitalize(filterCategory)}`}
                    >
                      <div className="relative min-h-[100px] w-2 rounded-full bg-muted-100 dark:bg-muted-800">
                        <div
                          className="animated-bar absolute bottom-0 end-0 z-[1] w-full rounded-full transition-all duration-500 ease-in-out"
                          style={{
                            height: `${value.percentage || 0}%`,
                            backgroundColor: themeColors[filterOption.color],
                          }}
                        ></div>
                      </div>
                    </AnimatedTooltip>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const FilterCharts = FilterChartsBase;
