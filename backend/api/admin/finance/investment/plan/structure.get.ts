// /api/admin/investmentPlans/structure.get.ts

import { models } from "@b/db";
import { structureSchema } from "@b/utils/constants";
import { imageStructure } from "@b/utils/schema/structure";
import { extensions } from "../../../../../..";

export const metadata = {
  summary: "Get form structure for Investment Plans",
  operationId: "getInvestmentPlanStructure",
  tags: ["Admin", "Investment Plans"],
  responses: {
    200: {
      description: "Form structure for managing Investment Plans",
      content: structureSchema,
    },
  },
  permission: "Access Investment Plan Management",
};

export const investmentPlanStructure = async () => {
  const name = {
    type: "input",
    label: "Name",
    name: "name",
    placeholder: "Enter the name of the plan",
  };

  const title = {
    type: "input",
    label: "Title",
    name: "title",
    component: "InfoBlock",
    icon: "material-symbols-light:title",
    placeholder: "Enter the title of the plan",
  };

  const description = {
    type: "textarea",
    label: "Description",
    name: "description",
    placeholder: "Enter a description for the plan",
  };

  const minProfit = {
    type: "input",
    label: "Minimum Profit",
    name: "minProfit",
    placeholder: "Minimum expected profit",
    ts: "number",
  };

  const maxProfit = {
    type: "input",
    label: "Maximum Profit",
    name: "maxProfit",
    placeholder: "Maximum expected profit",
    ts: "number",
  };

  const minAmount = {
    type: "input",
    label: "Minimum Amount",
    name: "minAmount",
    placeholder: "Minimum investable amount",
    ts: "number",
  };

  const maxAmount = {
    type: "input",
    label: "Maximum Amount",
    name: "maxAmount",
    placeholder: "Maximum investable amount",
    ts: "number",
  };

  const invested = {
    type: "input",
    label: "Invested",
    name: "invested",
    placeholder: "Total invested amount",
    ts: "number",
  };

  const profitPercentage = {
    type: "input",
    label: "Profit Percentage",
    name: "profitPercentage",
    placeholder: "Profit percentage of the plan",
    ts: "number",
  };

  const defaultProfit = {
    type: "input",
    label: "Default Profit",
    name: "defaultProfit",
    placeholder: "Default profit for calculations",
    ts: "number",
  };

  const defaultResult = {
    type: "select",
    label: "Default Result",
    name: "defaultResult",
    options: [
      { value: "WIN", label: "Win" },
      { value: "LOSS", label: "Loss" },
      { value: "DRAW", label: "Draw" },
    ],
    placeholder: "Default result for the plan",
  };

  const status = {
    type: "select",
    label: "Status",
    name: "status",
    placeholder: "Select the status of the plan",
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
    ts: "boolean",
  };

  const trending = {
    type: "select",
    label: "Trending",
    name: "trending",
    placeholder: "Is the plan trending?",
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
    ts: "boolean",
  };

  const durations = await models.investmentDuration.findAll({
    attributes: ["id", "duration", "timeframe"],
  });

  const durationIds = {
    type: "select",
    label: "Durations",
    name: "durations",
    multiple: true,
    structure: {
      value: "id",
      label: "duration.' '.timeframe",
    },
    options: durations.map((d) => ({
      value: d.id,
      label: `${d.duration} ${d.timeframe}`,
    })),
    placeholder: "Select the durations for the plan",
  };

  const walletType = {
    type: "select",
    label: "Wallet Type",
    name: "walletType",
    options: [
      { value: "FIAT", label: "Fiat" },
      { value: "SPOT", label: "Spot" },
    ],
    placeholder: "Select wallet type",
  };

  const fiatCurrency = await models.currency.findAll({
    where: { status: true },
    attributes: ["id"],
  });
  const spotCurrency = await models.exchangeCurrency.findAll({
    where: { status: true },
    attributes: ["currency"],
  });

let fundingCurrency: any = [];
if (extensions.has("ecosystem")) {
  walletType.options.push({ value: "ECO", label: "Funding" });
  const allFundingCurrencies = await models.ecosystemToken.findAll({
    where: { status: true },
    attributes: ["currency"],
  });

  // Use a Set to store unique currencies
  const uniqueCurrencies = new Set(allFundingCurrencies.map((c) => c.currency));
  fundingCurrency = Array.from(uniqueCurrencies);
}


  const currency = {
    type: "select",
    label: "Currency",
    name: "currency",
    options: [],
    conditions: {
      walletType: {
        FIAT: fiatCurrency.map((c) => ({ value: c.id, label: c.id })),
        SPOT: spotCurrency.map((c) => ({
          value: c.currency,
          label: c.currency,
        })),
        ECO: fundingCurrency.map((c) => ({
          value: c.currency,
          label: c.currency,
        })),
      },
    },
  };

  return {
    name,
    title,
    description,
    minProfit,
    maxProfit,
    minAmount,
    maxAmount,
    invested,
    profitPercentage,
    status,
    defaultProfit,
    defaultResult,
    trending,
    durationIds,
    currency,
    walletType,
  };
};

export default async () => {
  const {
    name,
    title,
    description,
    minProfit,
    maxProfit,
    minAmount,
    maxAmount,
    invested,
    profitPercentage,
    status,
    defaultProfit,
    defaultResult,
    trending,
    durationIds,
    currency,
    walletType,
  } = await investmentPlanStructure();

  return {
    get: [
      {
        fields: [
          {
            ...imageStructure,
            width: imageStructure.width / 4,
            height: imageStructure.width / 4,
          },
          {
            fields: [title],
            grid: "column",
          },
        ],
        className: "card-dashed mb-3 items-center",
      },
      description,
      [walletType, currency],
      [minProfit, maxProfit],
      [minAmount, maxAmount],
      [invested, profitPercentage],
      [defaultProfit, defaultResult],
      {
        type: "tags",
        label: "Durations",
        name: "durations",
      },
      [trending, status],
    ],
    set: [
      imageStructure,
      [name, title],
      description,
      [walletType, currency],
      [minProfit, maxProfit],
      [minAmount, maxAmount],
      [invested, profitPercentage],
      [defaultProfit, defaultResult],
      durationIds,
      [status, trending],
    ],
  };
};
