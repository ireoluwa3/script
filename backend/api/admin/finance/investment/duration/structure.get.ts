// /api/admin/investmentDurations/structure.get.ts

import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for Investment Durations",
  operationId: "getInvestmentDurationStructure",
  tags: ["Admin", "Investment Durations"],
  responses: {
    200: {
      description: "Form structure for managing Investment Durations",
      content: structureSchema,
    },
  },
  permission: "Access Investment Duration Management"
};

export const investmentDurationStructure = () => {
  const duration = {
    type: "input",
    label: "Duration",
    name: "duration",
    placeholder: "Enter duration number",
    ts: "number",
  };

  const timeframe = {
    type: "select",
    label: "Timeframe",
    name: "timeframe",
    options: [
      { value: "HOUR", label: "Hour" },
      { value: "DAY", label: "Day" },
      { value: "WEEK", label: "Week" },
      { value: "MONTH", label: "Month" },
    ],
    placeholder: "Select a timeframe",
  };

  return {
    duration,
    timeframe,
  };
};

export default (): object => {
  const { duration, timeframe } = investmentDurationStructure();

  return {
    get: [duration, timeframe],
    set: [[duration, timeframe]],
  };
};
