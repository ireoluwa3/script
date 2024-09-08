import { Queue, Worker } from "bullmq";
import { models, sequelize } from "@b/db";
import { extensions } from "../..";
import {
  cacheCurrencies,
  updateCurrencyRates,
} from "@b/api/finance/currency/utils";
import { getCurrencies } from "@b/api/exchange/currency/index.get";
import ExchangeManager from "@b/utils/exchange";
import { RedisSingleton } from "@b/utils/redis";
import { logError } from "./logger";
import {
  formatWaitTime,
  handleExchangeError,
  loadBanStatus,
  saveBanStatus,
} from "@b/api/exchange/utils";
import {
  cleanupOldPnlRecords,
  processPendingWithdrawals,
  processSpotPendingDeposits,
  processWalletPnl,
} from "./crons/wallet";
import { processForexInvestments } from "./crons/forex";
import { processIcoPhases } from "./crons/ico";
import { processStakingLogs } from "./crons/staking";
import { processMailwizardCampaigns } from "./crons/mailwizard";
import { processGeneralInvestments } from "./crons/investment";
import { processAiInvestments } from "./crons/aiInvestment";
import { processPendingOrders } from "./crons/order";

const redis = RedisSingleton.getInstance();

type CronJob = {
  name: string;
  title: string;
  period: number;
  description: string;
  function: () => Promise<void>;
  lastRun: number | null;
  lastRunError: string | null;
};

class CronJobManager {
  private static instance: CronJobManager;
  private cronJobs: CronJob[];

  private constructor() {
    this.cronJobs = [
      {
        name: "processGeneralInvestments",
        title: "Process General Investments",
        period: 60 * 60 * 1000,
        description: "Processes active General investments.",
        function: processGeneralInvestments,
        lastRun: null,
        lastRunError: null,
      },
      {
        name: "processPendingOrders",
        title: "Process Pending Orders",
        period: 60 * 60 * 1000,
        description: "Processes pending binary orders.",
        function: processPendingOrders,
        lastRun: null,
        lastRunError: null,
      },
      {
        name: "processCurrenciesPrices",
        title: "Process Currencies Prices",
        period: 2 * 60 * 1000,
        description:
          "Updates the prices of all exchange currencies in the database.",
        function: processCurrenciesPrices,
        lastRun: null,
        lastRunError: null,
      },
      {
        name: "processSpotPendingDeposits",
        title: "Process Pending Spot Deposits",
        period: 15 * 60 * 1000,
        description: "Processes pending spot wallet deposits.",
        function: processSpotPendingDeposits,
        lastRun: null,
        lastRunError: null,
      },
      {
        name: "processPendingWithdrawals",
        title: "Process Pending Withdrawals",
        period: 30 * 60 * 1000,
        description: "Processes pending spot wallet withdrawals.",
        function: processPendingWithdrawals,
        lastRun: null,
        lastRunError: null,
      },
      {
        name: "processWalletPnl",
        title: "Process Wallet PnL",
        period: 24 * 60 * 60 * 1000,
        description: "Processes wallet PnL for all users.",
        function: processWalletPnl,
        lastRun: null,
        lastRunError: null,
      },
      {
        name: "cleanupOldPnlRecords",
        title: "Cleanup Old PnL Records",
        period: 24 * 60 * 60 * 1000,
        description: "Removes old PnL records and zero balance records.",
        function: cleanupOldPnlRecords,
        lastRun: null,
        lastRunError: null,
      },
    ];

    const addonCronJobs = {
      ai_investment: [
        {
          name: "processAiInvestments",
          title: "Process AI Investments",
          period: 60 * 60 * 1000,
          description: "Processes active AI investments.",
          function: processAiInvestments,
          lastRun: null,
          lastRunError: null,
        },
      ],
      forex: [
        {
          name: "processForexInvestments",
          title: "Process Forex Investments",
          period: 60 * 60 * 1000,
          description: "Processes active Forex investments.",
          function: processForexInvestments,
          lastRun: null,
          lastRunError: null,
        },
      ],
      ico: [
        {
          name: "processIcoPhases",
          title: "Process ICO Phases",
          period: 60 * 60 * 1000,
          description: "Processes ICO phases and updates their status.",
          function: processIcoPhases,
          lastRun: null,
          lastRunError: null,
        },
      ],
      staking: [
        {
          name: "processStakingLogs",
          title: "Process Staking Logs",
          period: 60 * 60 * 1000,
          description:
            "Processes staking logs and releases stakes if necessary.",
          function: processStakingLogs,
          lastRun: null,
          lastRunError: null,
        },
      ],
      mailwizard: [
        {
          name: "processMailwizardCampaigns",
          title: "Process Mailwizard Campaigns",
          period: 60 * 60 * 1000,
          description: "Processes Mailwizard campaigns and sends emails.",
          function: processMailwizardCampaigns,
          lastRun: null,
          lastRunError: null,
        },
      ],
    };

    Object.keys(addonCronJobs).forEach((addon) => {
      if (extensions.has(addon)) {
        addonCronJobs[addon].forEach((cronJob) => {
          if (!this.isCronJobPresent(this.cronJobs, cronJob.name)) {
            this.cronJobs.push(cronJob);
          }
        });
      }
    });
  }

  public static getInstance(): CronJobManager {
    if (!CronJobManager.instance) {
      CronJobManager.instance = new CronJobManager();
    }
    return CronJobManager.instance;
  }

  public getCronJobs(): CronJob[] {
    return this.cronJobs;
  }

  public updateJobStatus(
    name: string,
    lastRun: number,
    lastRunError: string | null
  ) {
    const job = this.cronJobs.find((job) => job.name === name);
    if (job) {
      job.lastRun = lastRun;
      job.lastRunError = lastRunError;
    }
  }

  private isCronJobPresent(cronJobs: CronJob[], jobName: string): boolean {
    return cronJobs.some((job) => job.name === jobName);
  }
}
export const createWorker = (
  name: string,
  handler: () => Promise<void>,
  period: number
) => {
  const cronJobManager = CronJobManager.getInstance();
  const queue = new Queue(name, {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  });

  new Worker(
    name,
    async (job) => {
      const startTime = Date.now();
      try {
        await handler();
        cronJobManager.updateJobStatus(name, startTime, null);
      } catch (error) {
        cronJobManager.updateJobStatus(name, startTime, error.message);
        logError("worker", error, __filename);
        throw error;
      }
    },
    {
      connection: {
        host: "127.0.0.1",
        port: 6379,
      },
    }
  );

  queue.add(name, {}, { repeat: { every: period } }).catch((error) => {
    logError("queue", error, __filename);
  });
};

export async function fetchFiatCurrencyPrices() {
  const baseCurrency = "USD";
  const openExchangeRatesApiKey = process.env.APP_OPENEXCHANGERATES_APP_ID;
  const openExchangeRatesUrl = `https://openexchangerates.org/api/latest.json?appId=${openExchangeRatesApiKey}&base=${baseCurrency}`;
  const frankfurterApiUrl = `https://api.frankfurter.app/latest?from=${baseCurrency}`;

  try {
    await fetchWithTimeout(openExchangeRatesUrl);
  } catch (error) {
    logError("fetchFiatCurrencyPrices - OpenExchangeRates", error, __filename);
    try {
      await fetchWithTimeout(frankfurterApiUrl);
    } catch (fallbackError) {
      logError(
        "fetchFiatCurrencyPrices - Frankfurter",
        fallbackError,
        __filename
      );
      throw new Error(
        `Both API calls failed: ${error.message}, ${fallbackError.message}`
      );
    }
  }
}

async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      switch (response.status) {
        case 401:
          throw new Error("Unauthorized: Invalid API key.");
        case 403:
          throw new Error("Forbidden: Access denied.");
        case 429:
          throw new Error("Too Many Requests: Rate limit exceeded.");
        case 500:
          throw new Error(
            "Internal Server Error: The API is currently unavailable."
          );
        default:
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
      }
    }

    const data = await response.json();

    if (data && data.rates) {
      await updateRatesFromData(data.rates);
    } else {
      throw new Error("Invalid data format received from the API");
    }
  } finally {
    clearTimeout(id);
  }
}

async function updateRatesFromData(exchangeRates) {
  const ratesToUpdate = {};

  const currenciesRaw = await redis.get("currencies");
  if (!currenciesRaw) {
    throw new Error("No currencies data available in Redis");
  }

  let currencies;
  try {
    currencies = JSON.parse(currenciesRaw);
  } catch (parseError) {
    throw new Error(`Error parsing currencies data: ${parseError.message}`);
  }

  if (!Array.isArray(currencies)) {
    throw new Error("Currencies data is not an array");
  }

  for (const currency of currencies) {
    if (Object.prototype.hasOwnProperty.call(exchangeRates, currency.id)) {
      ratesToUpdate[currency.id] = exchangeRates[currency.id];
    }
  }

  await updateCurrencyRates(ratesToUpdate);
  await cacheCurrencies();
}

export async function cacheExchangeCurrencies() {
  try {
    const currencies = await getCurrencies();
    await redis.set(
      "exchangeCurrencies",
      JSON.stringify(currencies),
      "EX",
      1800
    );
  } catch (error) {
    logError("cacheExchangeCurrencies", error, __filename);
    throw error;
  }
}

export async function processCurrenciesPrices() {
  let unblockTime = await loadBanStatus();

  try {
    if (Date.now() < unblockTime) {
      const waitTime = unblockTime - Date.now();
      console.log(`Waiting for ${formatWaitTime(waitTime)} until unblock time`);
      return; // Exit the function if we're currently banned
    }

    const exchange = await ExchangeManager.startExchange();
    if (!exchange) return;

    let marketsCache: any[] = [];
    let currenciesCache: any[] = [];

    // Fetch markets from the database
    try {
      marketsCache = await models.exchangeMarket.findAll({
        where: {
          status: true,
        },
        attributes: ["currency", "pair"],
      });
    } catch (err) {
      logError("processCurrenciesPrices - fetch markets", err, __filename);
      throw err;
    }

    // Fetch currencies from the database
    try {
      currenciesCache = await models.exchangeCurrency.findAll({
        attributes: ["currency", "id", "price", "status"],
      });
    } catch (err) {
      logError("processCurrenciesPrices - fetch currencies", err, __filename);
      throw err;
    }

    const marketSymbols = marketsCache.map(
      (market: any) => `${market.currency}/${market.pair}`
    );
    if (!marketSymbols.length) {
      const error = new Error("No market symbols found");
      logError("processCurrenciesPrices - market symbols", error, __filename);
      throw error;
    }

    let markets: any = {};
    try {
      if (exchange.has["fetchLastPrices"]) {
        markets = await exchange.fetchLastPrices(marketSymbols);
      } else {
        markets = await exchange.fetchTickers(marketSymbols);
      }
    } catch (error) {
      const result = await handleExchangeError(error, ExchangeManager);
      if (typeof result === "number") {
        unblockTime = result;
        await saveBanStatus(unblockTime);
        console.log(
          `Ban detected. Blocked until ${new Date(
            unblockTime
          ).toLocaleString()}`
        );
        return; // Exit the function if we've been banned
      }
      logError(
        "processCurrenciesPrices - fetch markets data",
        error,
        __filename
      );
      throw error;
    }

    // Filter symbols with pair "USDT"
    const usdtPairs = Object.keys(markets).filter((symbol) =>
      symbol.endsWith("/USDT")
    );

    // Prepare data for bulk update
    const bulkUpdateData = usdtPairs
      .map((symbol) => {
        const currency = symbol.split("/")[0];
        const market = markets[symbol];

        // Ensure market and necessary properties are defined
        let price;
        if (exchange.has["fetchLastPrices"]) {
          price = market.price;
        } else {
          price = market.last;
        }

        if (!price) {
          console.warn(
            `Market data missing or invalid for symbol: ${symbol}, market data: ${JSON.stringify(
              market
            )}`
          );
          return null;
        }

        const matchingCurrency = currenciesCache.find(
          (dbCurrency) => dbCurrency.currency === currency
        );

        if (matchingCurrency) {
          matchingCurrency.price = parseFloat(price); // update price directly in the object
          return matchingCurrency;
        }
        return null;
      })
      .filter((item) => item !== null);

    // Add USDT with price 1 if it's in the database currencies
    const usdtCurrency = currenciesCache.find(
      (dbCurrency) => dbCurrency.currency === "USDT"
    );
    if (usdtCurrency) {
      usdtCurrency.price = 1;
      bulkUpdateData.push(usdtCurrency);
    }

    try {
      await sequelize.transaction(async (transaction) => {
        for (const item of bulkUpdateData) {
          await item.save({ transaction });
        }
      });
    } catch (error) {
      logError("processCurrenciesPrices - update database", error, __filename);
      throw error;
    }
  } catch (error) {
    logError("processCurrenciesPrices", error, __filename);
    throw error;
  }
}

export async function updateCurrencyPricesBulk(
  data: { id: number; price: number }[]
) {
  try {
    // Start a transaction
    await sequelize.transaction(async (transaction) => {
      // Map through data and update each exchangeCurrency record within the transaction
      for (const item of data) {
        await models.exchangeCurrency.update(
          { price: item.price },
          {
            where: { id: item.id },
            transaction, // Ensure the update is part of the transaction
          }
        );
      }
    });
  } catch (error) {
    logError("updateCurrencyPricesBulk", error, __filename);
    throw error;
  }
}

export default CronJobManager;
