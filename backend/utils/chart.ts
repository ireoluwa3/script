import { Sequelize, Model, ModelStatic, WhereOptions, Op } from "sequelize";
import {
  add,
  format,
  startOfDay,
  startOfWeek,
  startOfMonth,
  sub,
  startOfYear,
} from "date-fns";
import { logError } from "@b/utils/logger";

interface ChartParams {
  model: ModelStatic<Model<any, any>>;
  timeframe: string;
  filter?: string | string[];
  availableFilters?: { [key: string]: any };
  customStatusHandler?: (status: { [key: string]: any }) => WhereOptions;
  where?: WhereOptions;
}

const timeframeGrouping: Record<
  string,
  { interval: string; unit: string; count: number; frame?: number }
> = {
  d: { interval: "day", unit: "hours", count: 24 },
  w: { interval: "week", unit: "days", count: 7 },
  m: { interval: "month", unit: "days", count: 30 },
  "6m": { interval: "month", unit: "months", count: 6 },
  y: { interval: "year", unit: "months", count: 12 },
};

function dateFormatForUnit(unit: string) {
  switch (unit) {
    case "hours":
      return "yyyy-MM-dd HH";
    case "days":
      return "yyyy-MM-dd";
    case "months":
      return "yyyy-MM";
  }
}

function dateFormatForSequelize(unit: string) {
  switch (unit) {
    case "hours":
      return "%Y-%m-%d %H";
    case "days":
      return "%Y-%m-%d";
    case "months":
      return "%Y-%m";
  }
}

function parseFilterParam(filterParam: string | string[]): {
  [key: string]: any;
} {
  if (!filterParam) return {};

  try {
    const parsedFilter =
      typeof filterParam === "string" ? JSON.parse(filterParam) : {};
    return convertStringsToBooleans(parsedFilter);
  } catch (error) {
    logError("parseFilterParam", error, __filename);
    return {};
  }
}

function convertStringsToBooleans(filterObject: { [key: string]: any }): {
  [key: string]: any;
} {
  const convertedFilter: { [key: string]: any } = {};
  for (const key in filterObject) {
    const value = filterObject[key];
    if (value === "true") {
      convertedFilter[key] = true;
    } else if (value === "false") {
      convertedFilter[key] = false;
    } else {
      convertedFilter[key] = value;
    }
  }
  return convertedFilter;
}

function toUTC(date: Date): Date {
  return new Date(date.toISOString());
}

export async function getChartData({
  model,
  timeframe = "h",
  filter = "",
  availableFilters,
  customStatusHandler,
  where,
}: ChartParams): Promise<{
  chartData: { date: string; count: number }[];
  filterResults: {
    [key: string]: {
      [filterValue: string]: {
        count: number;
        change: number;
        percentage: number;
      };
    };
  };
}> {
  try {
    const rawFilter = parseFilterParam(filter);
    let whereClause: WhereOptions = customStatusHandler
      ? customStatusHandler(rawFilter)
      : rawFilter;

    const grouping = timeframeGrouping[timeframe];
    if (!grouping) {
      throw new Error(`Invalid timeframe: ${timeframe}`);
    }

    const unit = grouping.unit;
    const count = grouping.count;

    const now = toUTC(new Date());
    const startTime =
      timeframe === "y"
        ? startOfYear(now)
        : grouping.interval === "day"
        ? startOfDay(now)
        : grouping.interval === "week"
        ? startOfWeek(now)
        : startOfMonth(now);
    const endTime = add(startTime, { [unit]: count });
    const lastStartTime = sub(startTime, { [unit]: count });
    const lastEndTime = sub(endTime, { [unit]: count });

    if (where) whereClause = { ...whereClause, ...where };
    const data = await model.findAll({
      where: {
        ...whereClause,
        createdAt: { [Op.between]: [startTime, endTime] },
      },
      attributes: [
        [
          Sequelize.fn(
            "DATE_FORMAT",
            Sequelize.col("createdAt"),
            dateFormatForSequelize(unit)
          ),
          "time",
        ],
        [Sequelize.fn("COUNT", "*"), "count"],
      ],
      group: ["time"],
    });

    const groupedData = data.reduce<{ [key: string]: number }>(
      (acc, item: { get: (attr: string) => any }) => {
        const time = item.get("time") || "";
        const count = item.get("count") || 0;
        acc[time] = count;
        return acc;
      },
      {}
    );

    const organizedData: { date: string; count: number }[] = [];

    for (
      let date = startTime;
      date < endTime;
      date = add(date, { [unit]: 1 })
    ) {
      const dateKey = format(date, dateFormatForUnit(unit) as string);

      const count = groupedData[dateKey] || 0;
      organizedData.push({ date: dateKey, count });
    }

    const filterResults: {
      [key: string]: {
        [filterValue: string]: {
          count: number;
          change: number;
          percentage: number;
        };
      };
    } = {};

    for (const filterKey in availableFilters) {
      filterResults[filterKey] = {};

      let totalCountForFilterKey = 0;

      for (const filter of availableFilters[filterKey]) {
        const convertedValue =
          filter.value === "true"
            ? true
            : filter.value === "false"
            ? false
            : filter.value;
        let whereClause = customStatusHandler
          ? customStatusHandler({ [filterKey]: convertedValue })
          : { [filterKey]: convertedValue };

        if (where) whereClause = { ...whereClause, ...where };
        const currentCount = await model.count({
          where: {
            ...whereClause,
            createdAt: { [Op.between]: [startTime, endTime] },
          },
        });

        totalCountForFilterKey += currentCount;

        const previousCount = await model.count({
          where: {
            ...whereClause,
            createdAt: { [Op.between]: [lastStartTime, lastEndTime] },
          },
        });

        const change = currentCount - previousCount;

        filterResults[filterKey][filter.value] = {
          count: currentCount,
          change,
          percentage: 0,
        };
      }

      // Calculate percentages for each filter value under this filter key
      for (const filterValue in filterResults[filterKey]) {
        const statusData = filterResults[filterKey][filterValue];
        statusData.percentage =
          totalCountForFilterKey > 0
            ? (statusData.count / totalCountForFilterKey) * 100
            : 0;
      }
    }

    return { chartData: organizedData, filterResults };
  } catch (error) {
    logError("getChartData", error, __filename);
    throw error;
  }
}
