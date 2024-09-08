import * as ccxt from "ccxt";
import { sleep } from "./system";
import { models } from "@b/db";
import { logError } from "@b/utils/logger";
import {
  loadBanStatus,
  saveBanStatus,
  handleBanStatus,
} from "@b/api/exchange/utils";

class ExchangeManager {
  static readonly instance = new ExchangeManager();
  private readonly exchangeCache = new Map<string, any>();
  private provider: string | null = null;
  private exchange: any = null;
  private exchangeProvider: any = null;
  private lastAttemptTime: number | null = null;
  private attemptCount: number = 0;

  private constructor() {}

  private async fetchActiveProvider(): Promise<string | null> {
    try {
      const provider = await models.exchange.findOne({
        where: {
          status: true,
        },
      });
      if (!provider) {
        return null;
      }
      return provider.name;
    } catch (error) {
      logError("exchange", error, __filename);
      return null;
    }
  }

  private async initializeExchange(
    provider: string,
    retries = 3
  ): Promise<any> {
    if (await handleBanStatus(await loadBanStatus())) {
      return null;
    }

    if (this.exchangeCache.has(provider)) {
      return this.exchangeCache.get(provider);
    }

    const now = Date.now();
    if (
      this.attemptCount >= 3 &&
      this.lastAttemptTime &&
      now - this.lastAttemptTime < 30 * 60 * 1000
    ) {
      return null;
    }

    const apiKey = process.env[`APP_${provider.toUpperCase()}_API_KEY`];
    const apiSecret = process.env[`APP_${provider.toUpperCase()}_API_SECRET`];
    const apiPassphrase =
      process.env[`APP_${provider.toUpperCase()}_API_PASSPHRASE`];

    if (!apiKey || !apiSecret || apiKey === "" || apiSecret === "") {
      logError(
        "exchange",
        new Error(`API credentials for ${provider} are missing.`),
        __filename
      );
      this.attemptCount += 1;
      this.lastAttemptTime = now;
      return null;
    }

    try {
      let exchange = new ccxt.pro[provider]({
        apiKey,
        secret: apiSecret,
        password: apiPassphrase,
      });

      const credentialsValid = await exchange.checkRequiredCredentials();
      if (!credentialsValid) {
        logError(
          "exchange",
          new Error(`API credentials for ${provider} are invalid.`),
          __filename
        );
        await exchange.close();
        exchange = new ccxt.pro[provider]();
      }

      try {
        await exchange.loadMarkets();
      } catch (error) {
        if (this.isRateLimitError(error)) {
          await this.handleRateLimitError(provider);
          return this.initializeExchange(provider, retries);
        } else {
          logError(
            "exchange",
            new Error(`Failed to load markets: ${error.message}`),
            __filename
          );
          await exchange.close();
          exchange = new ccxt.pro[provider]();
        }
      }

      this.exchangeCache.set(provider, exchange);
      this.attemptCount = 0;
      this.lastAttemptTime = null;
      return exchange;
    } catch (error) {
      logError("exchange", error, __filename);
      this.attemptCount += 1;
      this.lastAttemptTime = now;

      if (
        retries > 0 &&
        (this.attemptCount < 3 || now - this.lastAttemptTime >= 30 * 60 * 1000)
      ) {
        await sleep(5000);
        return this.initializeExchange(provider, retries - 1);
      }
      return null;
    }
  }

  private isRateLimitError(error: any): boolean {
    return error instanceof ccxt.RateLimitExceeded || error.code === -1003;
  }

  private async handleRateLimitError(provider: string): Promise<void> {
    const banTime = Date.now() + 60000; // Ban for 1 minute
    await saveBanStatus(banTime);
    await sleep(60000); // Wait for 1 minute
  }

  public async startExchange(): Promise<any> {
    if (await handleBanStatus(await loadBanStatus())) {
      return null;
    }

    if (this.exchange) {
      return this.exchange;
    }

    this.provider = this.provider || (await this.fetchActiveProvider());
    if (!this.provider) {
      return null;
    }

    this.exchange =
      this.exchangeCache.get(this.provider) ||
      (await this.initializeExchange(this.provider));
    return this.exchange;
  }

  public async startExchangeProvider(provider: string): Promise<any> {
    if (await handleBanStatus(await loadBanStatus())) {
      return null;
    }

    if (!provider) {
      throw new Error("Provider is required to start exchange provider.");
    }

    this.exchangeProvider =
      this.exchangeCache.get(provider) ||
      (await this.initializeExchange(provider));
    return this.exchangeProvider;
  }

  public removeExchange(provider: string): void {
    if (!provider) {
      throw new Error("Provider is required to remove exchange.");
    }

    this.exchangeCache.delete(provider);
    if (this.provider === provider) {
      this.exchange = null;
      this.provider = null;
    }
  }

  public async getProvider(): Promise<string | null> {
    if (!this.provider) {
      this.provider = await this.fetchActiveProvider();
    }
    return this.provider;
  }

  public async testExchangeCredentials(
    provider: string
  ): Promise<{ status: boolean; message: string }> {
    if (await handleBanStatus(await loadBanStatus())) {
      return {
        status: false,
        message: "Service temporarily unavailable. Please try again later.",
      };
    }

    try {
      const apiKey = process.env[`APP_${provider.toUpperCase()}_API_KEY`];
      const apiSecret = process.env[`APP_${provider.toUpperCase()}_API_SECRET`];
      const apiPassphrase =
        process.env[`APP_${provider.toUpperCase()}_API_PASSPHRASE`];

      if (!apiKey || !apiSecret || apiKey === "" || apiSecret === "") {
        return {
          status: false,
          message: "API credentials are missing",
        };
      }

      const exchange = new ccxt.pro[provider]({
        apiKey,
        secret: apiSecret,
        password: apiPassphrase,
      });

      await exchange.loadMarkets();
      const balance = await exchange.fetchBalance();
      if (balance) {
        return {
          status: true,
          message: "API credentials are valid",
        };
      } else {
        return {
          status: false,
          message: "Failed to fetch balance with the provided credentials",
        };
      }
    } catch (error) {
      logError("exchange", error, __filename);
      return {
        status: false,
        message: `Error testing API credentials: ${error.message}`,
      };
    }
  }

  public async stopExchange(): Promise<void> {
    if (this.exchange) {
      await this.exchange.close();
      this.exchange = null;
    }
  }
}

export default ExchangeManager.instance;

export function mapChainNameToChainId(chainName: string) {
  const chainMap: { [key: string]: string } = {
    BEP20: "bsc",
    BEP2: "bnb",
    ERC20: "eth",
    TRC20: "trx",
    "KAVA EVM CO-CHAIN": "kavaevm",
    "LIGHTNING NETWORK": "lightning",
    "BTC-SEGWIT": "btc",
    "ASSET HUB(POLKADOT)": "polkadot",
  };

  return chainMap[chainName] || chainName;
}
