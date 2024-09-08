import ExchangeManager from "@b/utils/exchange";
import { models } from "@b/db";
import { logError } from "../logger";
import { Op } from "sequelize";
import { MatchingEngine } from "../eco/matchingEngine";
import { add, format, subDays } from "date-fns";
import {
  spotVerificationIntervals,
  startSpotVerificationSchedule,
  updateSpotWalletBalance,
} from "@b/api/finance/deposit/spot/index.ws";
import { updateTransaction } from "@b/api/finance/utils";
import { handleNotification } from "../notifications";
import { walletPnlTaskQueue } from "./walletTask";

export async function processWalletPnl() {
  try {
    const users = await models.user.findAll({ attributes: ["id"] });

    // Process users by adding tasks to the wallet PnL queue
    for (const user of users) {
      walletPnlTaskQueue.add(() => handlePnl(user));
    }
  } catch (error) {
    logError("processWalletPnl", error, __filename);
    throw error;
  }
}

const handlePnl = async (user: any) => {
  try {
    const wallets = await models.wallet.findAll({
      where: { userId: user.id },
      attributes: ["currency", "balance", "type"], // Fetch only necessary fields
    });

    if (!wallets.length) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const uniqueCurrencies = Array.from(
      new Set(wallets.map((w) => w.currency))
    );

    const [todayPnl, currencyPrices, exchangePrices, engine] =
      await Promise.all([
        models.walletPnl.findOne({
          where: {
            userId: user.id,
            createdAt: {
              [Op.gte]: today,
            },
          },
          attributes: ["id", "balances"], // Fetch only necessary fields
        }),
        models.currency.findAll({
          where: { id: uniqueCurrencies },
          attributes: ["id", "price"], // Fetch only necessary fields
        }),
        models.exchangeCurrency.findAll({
          where: { currency: uniqueCurrencies },
          attributes: ["currency", "price"], // Fetch only necessary fields
        }),
        MatchingEngine.getInstance(), // Await this separately
      ]);

    const tickers = await engine.getTickers(); // Await the call to getTickers after getting the instance

    const currencyMap = new Map(
      currencyPrices.map((item) => [item.id, item.price])
    );
    const exchangeMap = new Map(
      exchangePrices.map((item) => [item.currency, item.price])
    );

    const balances = { FIAT: 0, SPOT: 0, ECO: 0 };
    for (const wallet of wallets) {
      let price;
      if (wallet.type === "FIAT") {
        price = currencyMap.get(wallet.currency);
      } else if (wallet.type === "SPOT") {
        price = exchangeMap.get(wallet.currency);
      } else if (wallet.type === "ECO") {
        price = tickers[wallet.currency]?.last || 0;
      }
      if (price) {
        balances[wallet.type] += price * wallet.balance;
      }
    }

    if (Object.values(balances).some((balance) => balance > 0)) {
      if (todayPnl) {
        await todayPnl.update({ balances });
      } else {
        await models.walletPnl.create({
          userId: user.id,
          balances,
          createdAt: today,
        });
      }
    }
  } catch (error) {
    logError(`handlePnl`, error, __filename);
    throw error;
  }
};

export async function cleanupOldPnlRecords() {
  try {
    const oneMonthAgo = subDays(new Date(), 30);
    const yesterday = subDays(new Date(), 1);
    const zeroBalanceString = '{"FIAT":0,"SPOT":0,"ECO":0}';
    const zeroBalanceObject = { FIAT: 0, SPOT: 0, ECO: 0 };

    await models.walletPnl.destroy({
      where: {
        createdAt: {
          [Op.lt]: oneMonthAgo,
        },
      },
    });

    await models.walletPnl.destroy({
      where: {
        createdAt: {
          [Op.lt]: yesterday,
        },
        [Op.or]: [
          { balances: zeroBalanceString },
          { balances: zeroBalanceObject },
        ],
      },
    });
    console.log("PnL records cleanup completed");
  } catch (error) {
    logError("cleanupOldPnlRecords", error, __filename);
  }
}

export async function processSpotPendingDeposits() {
  try {
    const transactions = await getPendingSpotTransactionsQuery("DEPOSIT");

    for (const transaction of transactions) {
      const transactionId = transaction.id;
      const userId = transaction.userId;
      const trx = transaction.referenceId;

      if (!trx) {
        continue;
      }

      // Only start a new verification schedule if it's not already running
      if (!spotVerificationIntervals.has(transactionId)) {
        startSpotVerificationSchedule(transactionId, userId, trx);
      }
    }
  } catch (error) {
    logError("processSpotPendingDeposits", error, __filename);
    throw error;
  }
}

export async function getPendingSpotTransactionsQuery(type) {
  try {
    return await models.transaction.findAll({
      where: {
        status: "PENDING",
        type: type,
        [Op.and]: [
          {
            referenceId: { [Op.ne]: null }, // Not equal to null
          },
          {
            referenceId: { [Op.ne]: "" }, // Not equal to empty string
          },
        ],
      },
      include: [
        {
          model: models.wallet,
          as: "wallet",
          attributes: ["id", "currency"], // Specify the fields to include from the wallet model
        },
      ],
    });
  } catch (error) {
    logError("getPendingSpotTransactionsQuery", error, __filename);
    throw error;
  }
}

export async function processPendingWithdrawals() {
  try {
    const transactions = (await getPendingSpotTransactionsQuery(
      "WITHDRAW"
    )) as unknown as Transaction[];

    for (const transaction of transactions) {
      const userId = transaction.userId;
      const trx = transaction.referenceId;
      if (!trx) continue;

      const exchange = await ExchangeManager.startExchange();
      try {
        const withdrawals = await exchange.fetchWithdrawals(
          transaction.wallet?.currency
        );
        const withdrawData = withdrawals.find((w) => w.id === trx);
        let withdrawStatus: any = "PENDING";
        if (withdrawData) {
          switch (withdrawData.status) {
            case "ok":
              withdrawStatus = "COMPLETED";
              break;
            case "canceled":
              withdrawStatus = "CANCELLED";
              break;
            case "failed":
              withdrawStatus = "FAILED";
          }
        }
        if (!withdrawStatus) {
          continue;
        }
        if (transaction.status === withdrawStatus) {
          continue;
        }
        await updateTransaction(transaction.id, { status: withdrawStatus });
        if (withdrawStatus === "FAILED" || withdrawStatus === "CANCELLED") {
          await updateSpotWalletBalance(
            userId,
            transaction.wallet?.currency,
            Number(transaction.amount),
            Number(transaction.fee),
            "REFUND_WITHDRAWAL"
          );
          await handleNotification({
            userId,
            title: "Withdrawal Failed",
            message: `Your withdrawal of ${transaction.amount} ${transaction.wallet?.currency} has failed.`,
            type: "ACTIVITY",
          });
        }
      } catch (error) {
        logError(
          `processPendingWithdrawals - transaction ${transaction.id}`,
          error,
          __filename
        );
        continue;
      }
    }
  } catch (error) {
    logError("processPendingWithdrawals", error, __filename);
    throw error;
  }
}
