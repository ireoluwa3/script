// /api/admin/exchangeMarkets/structure.get.ts

import { structureSchema } from "@b/utils/constants";

export const metadata = {
  summary: "Get form structure for Ecosystem Markets",
  operationId: "getEcosystemMarketStructure",
  tags: ["Admin", "Ecosystem Markets"],
  responses: {
    200: {
      description: "Form structure for managing Ecosystem Markets",
      content: structureSchema,
    },
  },
  permission: "Access Exchange Market Management",
};

export const exchangeMarketStructure = async () => {
  const metadata = {
    type: "object",
    name: "metadata",
    label: "Metadata",
    fields: [
      [
        {
          type: "input",
          label: "Taker Fee",
          name: "taker",
          placeholder: "Enter the taker fee percentage",
          ts: "number",
        },
        {
          type: "input",
          label: "Maker Fee",
          name: "maker",
          placeholder: "Enter the maker fee percentage",
          ts: "number",
        },
      ],
      {
        type: "object",
        label: "Precision",
        name: "precision",
        fields: [
          [
            {
              type: "input",
              label: "Amount",
              name: "amount",
              placeholder: "Enter the amount precision (decimals)",
              ts: "number",
            },
            {
              type: "input",
              label: "Price",
              name: "price",
              placeholder: "Enter the price precision (decimals)",
              ts: "number",
            },
          ],
        ],
      },
      {
        type: "object",
        label: "Limits",
        name: "limits",
        fields: [
          [
            {
              type: "object",
              label: "Amount",
              name: "amount",
              fields: [
                {
                  type: "input",
                  label: "Min",
                  name: "min",
                  placeholder: "Enter the minimum amount",
                  ts: "number",
                },
                {
                  type: "input",
                  label: "Max",
                  name: "max",
                  placeholder: "Enter the maximum amount",
                  ts: "number",
                },
              ],
            },
            {
              type: "object",
              label: "Price",
              name: "price",
              fields: [
                {
                  type: "input",
                  label: "Min",
                  name: "min",
                  placeholder: "Enter the minimum price",
                  ts: "number",
                },
                {
                  type: "input",
                  label: "Max",
                  name: "max",
                  placeholder: "Enter the maximum price",
                  ts: "number",
                },
              ],
            },
          ],
          [
            {
              type: "object",
              label: "Cost",
              name: "cost",
              fields: [
                {
                  type: "input",
                  label: "Min",
                  name: "min",
                  placeholder: "Enter the minimum cost",
                  ts: "number",
                },
                {
                  type: "input",
                  label: "Max",
                  name: "max",
                  placeholder: "Enter the maximum cost",
                  ts: "number",
                },
              ],
            },
            {
              type: "object",
              label: "Leverage",
              name: "leverage",
              fields: [
                {
                  type: "input",
                  label: "Value",
                  name: "value",
                  placeholder: "Enter the leverage value",
                  ts: "number",
                },
              ],
            },
          ],
        ],
      },
    ],
  };

  // isTrending and isHot are boolean fields
  const isTrending = {
    type: "select",
    label: "Trending",
    name: "isTrending",
    options: [
      { value: true, label: "Yes", color: "success" },
      { value: false, label: "No", color: "danger" },
    ],
    ts: "boolean",
  };

  const isHot = {
    type: "select",
    label: "Hot",
    name: "isHot",
    options: [
      { value: true, label: "Yes", color: "success" },
      { value: false, label: "No", color: "danger" },
    ],
    ts: "boolean",
  };

  return {
    metadata,
    isTrending,
    isHot,
  };
};

export default async () => {
  const { metadata, isTrending, isHot } = await exchangeMarketStructure();

  return {
    get: [],
    set: [],
    edit: [[isTrending, isHot], metadata],
  };
};
