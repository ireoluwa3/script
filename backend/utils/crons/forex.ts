import { models, sequelize } from "@b/db";
import { logError } from "../logger";
import { addDays, addHours, isPast } from "date-fns";
import { sendInvestmentEmail } from "../emails";
import { handleNotification } from "../notifications";
import { processRewards } from "../affiliate";

export async function processForexInvestments() {
  try {
    const activeInvestments = await getActiveForexInvestments();

    for (const investment of activeInvestments) {
      try {
        await processForexInvestment(investment);
      } catch (error) {
        logError(
          `processForexInvestments - Error processing Forex investment ${investment.id}`,
          error,
          __filename
        );
        continue;
      }
    }
  } catch (error) {
    logError("processForexInvestments", error, __filename);
    throw error;
  }
}

export async function getActiveForexInvestments() {
  try {
    return await models.forexInvestment.findAll({
      where: {
        status: "ACTIVE",
      },
      include: [
        {
          model: models.forexPlan,
          as: "plan",
          attributes: [
            "id",
            "name",
            "title",
            "description",
            "defaultProfit",
            "defaultResult",
            "currency",
            "walletType",
          ],
        },
        {
          model: models.forexDuration,
          as: "duration",
          attributes: ["id", "duration", "timeframe"],
        },
      ],
      order: [
        ["status", "ASC"], // 'ASC' for ascending or 'DESC' for descending
        ["createdAt", "ASC"], // 'ASC' for oldest first, 'DESC' for newest first
      ],
    });
  } catch (error) {
    logError("getActiveForexInvestments", error, __filename);
    throw error;
  }
}
export async function processForexInvestment(investment) {
  try {
    if (investment.status === "COMPLETED") {
      return null;
    }

    const user = await fetchUser(investment.userId);
    if (!user) return null;

    const roi = calculateRoi(investment);
    const investmentResult = determineInvestmentResult(investment);

    if (shouldProcessInvestment(investment, roi, investmentResult)) {
      const updatedInvestment = await handleInvestmentUpdate(
        investment,
        user,
        roi,
        investmentResult
      );
      if (updatedInvestment) {
        await postProcessInvestment(user, investment, updatedInvestment);
      }
      return updatedInvestment;
    }

    return null;
  } catch (error) {
    logError(`processForexInvestment - General`, error, __filename);
    throw error;
  }
}

async function fetchUser(userId) {
  try {
    const user = await models.user.findByPk(userId);
    if (!user) {
      logError(`fetchUser`, new Error(`User not found: ${userId}`), __filename);
    }
    return user;
  } catch (error) {
    logError(`fetchUser`, error, __filename);
    throw error;
  }
}

function calculateRoi(investment) {
  const roi = investment.profit || investment.plan.defaultProfit;
  return roi;
}

function determineInvestmentResult(investment) {
  const result = investment.result || investment.plan.defaultResult;
  return result;
}

function shouldProcessInvestment(investment, roi, investmentResult) {
  const endDate = calculateEndDate(investment);
  const shouldProcess = isPast(endDate);
  return shouldProcess;
}

function calculateEndDate(investment) {
  let endDate;
  const createdAt = new Date(investment.createdAt);
  switch (investment.duration.timeframe) {
    case "HOUR":
      endDate = addHours(createdAt, investment.duration.duration);
      break;
    case "DAY":
      endDate = addDays(createdAt, investment.duration.duration);
      break;
    case "WEEK":
      endDate = addDays(createdAt, investment.duration.duration * 7);
      break;
    case "MONTH":
      endDate = addDays(createdAt, investment.duration.duration * 30);
      break;
    default:
      endDate = addHours(createdAt, investment.duration.duration);
      break;
  }
  return endDate;
}

async function handleInvestmentUpdate(investment, user, roi, investmentResult) {
  let updatedInvestment;
  const transaction = await sequelize.transaction();

  try {
    const wallet = await fetchWallet(
      user.id,
      investment.plan.currency,
      investment.plan.walletType,
      transaction
    );
    if (!wallet) return null;

    const newBalance = calculateNewBalance(
      wallet.balance,
      investment.amount,
      roi,
      investmentResult
    );

    await updateWalletBalance(wallet.id, newBalance, transaction);

    updatedInvestment = await updateInvestmentStatus(
      investment.id,
      investmentResult,
      roi,
      transaction
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();

    if (error.name === "SequelizeValidationError") {
      logError(
        `Validation error in handleInvestmentUpdate: ${JSON.stringify(
          error.errors
        )}`,
        error,
        __filename
      );
    } else {
      logError(`handleInvestmentUpdate`, error, __filename);
    }

    return null;
  }

  return updatedInvestment;
}

async function updateInvestmentStatus(investmentId, result, roi, transaction) {
  try {
    await models.forexInvestment.update(
      {
        status: "COMPLETED",
        result,
        profit: roi,
      },
      {
        where: { id: investmentId },
        transaction,
      }
    );

    const updatedInvestment = await models.forexInvestment.findByPk(
      investmentId,
      {
        include: [
          { model: models.forexPlan, as: "plan" },
          { model: models.forexDuration, as: "duration" },
        ],
        transaction,
      }
    );

    return updatedInvestment;
  } catch (error) {
    logError(`updateInvestmentStatus`, error, __filename);
    throw error;
  }
}

async function fetchWallet(userId, currency, walletType, transaction) {
  try {
    const wallet = await models.wallet.findOne({
      where: { userId, currency, type: walletType },
      transaction,
    });
    if (!wallet) throw new Error("Wallet not found");
    return wallet;
  } catch (error) {
    logError(`fetchWallet`, error, __filename);
    throw error;
  }
}

function calculateNewBalance(balance, amount, roi, result) {
  switch (result) {
    case "WIN":
      return balance + amount + roi;
    case "LOSS":
      return balance - amount + roi;
    case "DRAW":
      return balance + amount;
    default:
      throw new Error(`Unexpected investment result: ${result}`);
  }
}

async function updateWalletBalance(walletId, newBalance, transaction) {
  try {
    await models.wallet.update(
      { balance: newBalance },
      { where: { id: walletId }, transaction }
    );
  } catch (error) {
    logError(`updateWalletBalance`, error, __filename);
    throw error;
  }
}

async function postProcessInvestment(user, investment, updatedInvestment) {
  try {
    await sendInvestmentEmail(
      user,
      investment.plan,
      investment.duration,
      updatedInvestment,
      "ForexInvestmentCompleted"
    );

    await handleNotification({
      userId: user.id,
      title: "Forex Investment Completed",
      message: `Your Forex investment of ${investment.amount} ${investment.plan.currency} has been completed with a status of ${updatedInvestment.result}`,
      type: "ACTIVITY",
    });

    await processRewards(
      user.id,
      investment.amount,
      "FOREX_INVESTMENT",
      investment.plan.currency
    );
  } catch (error) {
    logError(`postProcessInvestment`, error, __filename);
  }
}
