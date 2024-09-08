import { models } from "@b/db";
import { addDays, isPast } from "date-fns";
import { sendStakingRewardEmail } from "../emails";
import { handleNotification } from "../notifications";
import { processRewards } from "../affiliate";
import { logError } from "../logger";

export async function processStakingLogs() {
  try {
    const stakingLogsToRelease = (await models.stakingLog.findAll({
      where: {
        status: "ACTIVE",
      },
      include: [
        {
          model: models.stakingPool,
          as: "pool",
          attributes: ["name", "currency", "chain", "type"],
        },
        {
          model: models.user,
          as: "user",
          attributes: ["id", "email", "firstName", "lastName"],
        },
        {
          model: models.stakingDuration,
          as: "duration",
          attributes: ["duration", "interestRate"],
        },
      ],
    })) as any;

    for (const log of stakingLogsToRelease) {
      if (!log.createdAt || !log.duration) continue;
      const endDate = addDays(new Date(log.createdAt), log.duration.duration);
      if (isPast(endDate)) {
        try {
          const interest = (log.amount * log.duration.interestRate) / 100;
          const releaseDate = new Date(); // Assuming release date is now
          log.releaseDate = releaseDate; // Set the release date
          await log.save(); // Save the updated log with the release date

          await releaseStake(log.id);
          await sendStakingRewardEmail(
            log.user,
            log,
            log.pool,
            interest // Assuming this is the reward structure in your schema
          );

          await handleNotification({
            userId: log.user.id,
            title: "Staking Reward",
            message: `You have received a staking reward of ${interest} ${log.pool.currency}`,
            type: "ACTIVITY",
          });

          await processRewards(
            log.user.id,
            log.amount,
            "STAKING_LOYALTY",
            log.pool.currency
          );
        } catch (error) {
          logError(`processStakingLogs`, error, __filename);
        }
      }
    }
  } catch (error) {
    logError("processStakingLogs", error, __filename);
    throw error;
  }
}

export async function releaseStake(stakeId) {
  try {
    await models.stakingLog.update(
      { status: "RELEASED" },
      { where: { id: stakeId } }
    );
  } catch (error) {
    logError(`releaseStake`, error, __filename);
    throw error;
  }
}
