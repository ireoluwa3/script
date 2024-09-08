import { models, sequelize } from "@b/db";
import { logError } from "../logger";
import { addDays, addHours, isPast } from "date-fns";
import { getTransactionByRefId } from "@b/api/finance/transaction/[id]/index.get";
import { getWalletById } from "@b/api/finance/wallet/utils";
import { sendAiInvestmentEmail } from "../emails";
import { handleNotification } from "../notifications";
import { processRewards } from "../affiliate";

export async function processAiInvestments() {
  try {
    const activeInvestments = await getActiveInvestments();

    for (const investment of activeInvestments) {
      try {
        await processAiInvestment(investment);
      } catch (error) {
        logError(
          `processAiInvestments - investment ${investment.id}`,
          error,
          __filename
        );
        continue;
      }
    }
  } catch (error) {
    logError("processAiInvestments", error, __filename);
    throw error;
  }
}

export async function getActiveInvestments() {
  try {
    return await models.aiInvestment.findAll({
      where: {
        status: "ACTIVE",
      },
      include: [
        {
          model: models.aiInvestmentPlan,
          as: "plan",
          attributes: [
            "id",
            "name",
            "title",
            "description",
            "defaultProfit",
            "defaultResult",
          ],
        },
        {
          model: models.aiInvestmentDuration,
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
    logError("getActiveInvestments", error, __filename);
    throw error;
  }
}

export async function processAiInvestment(investment) {
  const { id, duration, createdAt, amount, profit, result, plan, status } =
    investment;

  if (status === "COMPLETED") {
    return null;
  }

  try {
    const user = await models.user.findByPk(investment.userId);
    if (!user) {
      logError(`processAiInvestment`, new Error("User not found"), __filename);
      return null;
    }
    const roi = profit || plan.defaultProfit;
    const investmentResult = result || plan.defaultResult;

    let endDate;
    switch (duration.timeframe) {
      case "HOUR":
        endDate = addHours(new Date(createdAt), duration.duration);
        break;
      case "DAY":
        endDate = addDays(new Date(createdAt), duration.duration);
        break;
      case "WEEK":
        endDate = addDays(new Date(createdAt), duration.duration * 7);
        break;
      case "MONTH":
        endDate = addDays(new Date(createdAt), duration.duration * 30);
        break;
      default:
        endDate = addHours(new Date(createdAt), duration.duration);
        break;
    }

    if (isPast(endDate)) {
      let updatedInvestment, wallet;
      try {
        const transaction = await getTransactionByRefId(id);
        if (!transaction) {
          logError(
            `processAiInvestment`,
            new Error("Transaction not found"),
            __filename
          );
          await models.aiInvestment.destroy({
            where: { id },
          });
          return null;
        }

        wallet = await getWalletById(transaction.walletId);
        if (!wallet) throw new Error("Wallet not found");

        let newBalance = wallet.balance;
        if (investmentResult === "WIN") {
          newBalance += amount + roi;
        } else if (investmentResult === "LOSS") {
          newBalance += amount - roi;
        } else {
          newBalance += amount;
        }

        // Update Wallet
        updatedInvestment = await sequelize.transaction(async (transaction) => {
          await models.wallet.update(
            {
              balance: newBalance,
            },
            {
              where: { id: wallet.id },
              transaction,
            }
          );

          await models.transaction.create(
            {
              userId: wallet.userId,
              walletId: wallet.id,
              amount:
                investmentResult === "WIN"
                  ? roi
                  : investmentResult === "LOSS"
                  ? -roi
                  : 0,
              description: `Investment ROI: Plan "${investment.plan.title}" | Duration: ${investment.duration.duration} ${investment.duration.timeframe}`,
              status: "COMPLETED",
              type: "AI_INVESTMENT_ROI",
            },
            { transaction }
          );

          await models.aiInvestment.update(
            {
              status: "COMPLETED",
              result: investmentResult,
              profit: roi,
            },
            {
              where: { id },
              transaction,
            }
          );

          return await models.aiInvestment.findByPk(id, {
            include: [
              { model: models.aiInvestmentPlan, as: "plan" },
              { model: models.aiInvestmentDuration, as: "duration" },
            ],
            transaction,
          });
        });
      } catch (error) {
        logError(`processAiInvestment`, error, __filename);
        return null;
      }

      if (updatedInvestment) {
        try {
          if (!updatedInvestment) throw new Error("Investment not found");

          await sendAiInvestmentEmail(
            user,
            plan,
            duration,
            updatedInvestment,
            "AiInvestmentCompleted"
          );

          await handleNotification({
            userId: user.id,
            title: "AI Investment Completed",
            message: `Your AI investment of ${amount} ${wallet.currency} has been completed with a status of ${investmentResult}`,
            type: "ACTIVITY",
          });
        } catch (error) {
          logError(`processAiInvestment`, error, __filename);
        }

        try {
          await processRewards(
            user.id,
            amount,
            "AI_INVESTMENT",
            wallet?.currency
          );
        } catch (error) {
          logError(`processAiInvestment`, error, __filename);
        }
      }
      return updatedInvestment;
    }
  } catch (error) {
    logError(`processAiInvestment`, error, __filename);
    throw error;
  }
}
