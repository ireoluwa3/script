import { models } from "@b/db";
import { notifyUsersWithPermission, saveNotification } from "./notifications";
import { extensions, settings } from "../..";
import { logError } from "@b/utils/logger";

export async function processRewards(
  userId: string,
  amount: number,
  conditionName: string,
  currency: string
) {
  if (!extensions.has("mlm")) return;

  const mlmSystem = settings.has("mlmSystem")
    ? settings.get("mlmSystem")
    : "DIRECT";

  let mlmSettings = null;
  try {
    mlmSettings = settings.has("mlmSettings")
      ? JSON.parse(settings.get("mlmSettings"))
      : null;
  } catch (error) {
    logError("mlmSettings", error, __filename);
    return;
  }

  if (!mlmSettings) {
    logError("mlmSettings", new Error("MLM settings not found"), __filename);
    return; // MLM settings not found
  }

  // Validate transaction type and currency
  if (!isValidTransaction(conditionName, amount, currency)) {
    logError(
      "transaction",
      new Error("Invalid transaction type or currency"),
      __filename
    );
    return;
  }

  const { mlmReferralCondition } = models;

  try {
    const condition = await mlmReferralCondition.findOne({
      where: { name: conditionName, status: true },
    });

    if (!condition) {
      logError(
        "condition",
        new Error("Invalid referral condition"),
        __filename
      );
      return;
    }

    let rewardsProcessed = false; // Flag to indicate if rewards were successfully processed

    switch (mlmSystem) {
      case "DIRECT":
        rewardsProcessed = await processDirectRewards(
          condition,
          userId,
          amount
        );
        break;
      case "BINARY":
        rewardsProcessed = await processBinaryRewards(
          condition,
          userId,
          amount,
          mlmSettings
        );
        break;
      case "UNILEVEL":
        rewardsProcessed = await processUnilevelRewards(
          condition,
          userId,
          amount,
          mlmSettings
        );
        break;
      default:
        logError("mlmSystem", new Error("Invalid MLM system type"), __filename);
        break;
    }

    if (rewardsProcessed) {
      // Notify the user about their reward
      await saveNotification(
        userId, // Assuming userId is a string and needs to be converted to a number. Adjust as needed.
        "Reward Processed",
        `Your reward for ${conditionName} of ${amount} ${currency} has been successfully processed.`,
        NotificationType.SYSTEM
      );

      // Notify users with the "View MLM Rewards" permission about the reward process
      await notifyUsersWithPermission(
        "View MLM Rewards",
        "MLM Reward Processed",
        `A reward for ${conditionName} of ${amount} ${currency} was processed for user ${userId}.`,
        NotificationType.SYSTEM
      );
    }
  } catch (error) {
    logError("processRewards", error, __filename);
  }
}

function isValidTransaction(conditionName, amount, currency) {
  switch (conditionName) {
    case "WELCOME_BONUS":
      return currency === "USDT" && amount >= 100;
    case "MONTHLY_TRADE_VOLUME":
      return currency === "USDT" && amount > 1000;
    case "TRADE_COMMISSION":
    case "INVESTMENT":
    case "AI_INVESTMENT":
    case "FOREX_INVESTMENT":
    case "ICO_CONTRIBUTION":
    case "STAKING_LOYALTY":
    case "ECOMMERCE_PURCHASE":
    case "P2P_TRADE":
      return true;
    default:
      return false;
  }
}

async function processDirectRewards(condition, referredId, amount) {
  try {
    // Find the referral record
    const referral = await models.mlmReferral.findOne({
      where: { referredId },
    });

    if (!referral) return false;

    // Check for existing reward
    const count = await models.mlmReferralReward.count({
      where: {
        referrerId: referral.referrerId,
        conditionId: condition.id,
      },
    });

    if (count > 0) return false;

    // Calculate reward amount
    const rewardAmount =
      condition.rewardType === "PERCENTAGE"
        ? amount * (condition.reward / 100)
        : condition.reward;

    // Create the reward record
    await models.mlmReferralReward.create({
      referrerId: referral.referrerId,
      conditionId: condition.id,
      reward: rewardAmount,
    });

    return true;
  } catch (error) {
    logError("processDirectRewards", error, __filename);
    return false;
  }
}

// Helper function to find uplines
async function findUplines(userId, systemType, levels) {
  const uplines: { level: number; referrerId: any }[] = [];
  let currentUserId = userId;

  // Assume model names for binary and unilevel systems
  const model =
    systemType === "BINARY" ? models.mlmBinaryNode : models.mlmUnilevelNode;

  for (let i = 0; i < levels; i++) {
    try {
      const referral = await models.mlmReferral.findOne({
        where: { referredId: currentUserId },
        include: [
          {
            model: model,
            as: systemType === "BINARY" ? "node" : "unilevelNode",
            required: true,
          },
        ],
      });

      if (!referral || !referral.referrerId) {
        logError(
          "findUplines",
          new Error(
            `User ${currentUserId} is not associated to ${
              systemType === "BINARY" ? "mlmBinaryNode" : "mlmUnilevelNode"
            }!`
          ),
          __filename
        );
        break;
      }

      uplines.push({
        level: i + 1,
        referrerId: referral.referrerId,
      });

      currentUserId = referral.referrerId;
    } catch (error) {
      logError("findUplines", error, __filename);
      break;
    }
  }

  return uplines;
}

// Common function to create reward record
async function createRewardRecord(referrerId, rewardAmount, conditionId) {
  try {
    await models.mlmReferralReward.create({
      referrerId,
      reward: rewardAmount,
      conditionId: conditionId,
    });
  } catch (error) {
    logError("createRewardRecord", error, __filename);
  }
}

// Binary Rewards Processing
async function processBinaryRewards(
  condition,
  userId,
  depositAmount,
  mlmSettings
) {
  try {
    const binaryLevels = mlmSettings.binary.levels;
    const uplines = await findUplines(userId, "BINARY", binaryLevels);

    if (!uplines.length) {
      return false;
    }

    // Distribute rewards starting from the closest upline
    for (let i = uplines.length - 1; i >= 0; i--) {
      const upline: { level: number; referrerId: any } = uplines[i];
      const levelIndex = binaryLevels - i; // Reverse the index for percentage lookup
      const levelRewardPercentage = mlmSettings.binary.levelsPercentage.find(
        (l) => l.level === levelIndex
      )?.value;

      if (levelRewardPercentage === undefined) {
        continue;
      }

      // Calculate base reward using the level's percentage
      const baseReward = depositAmount * (levelRewardPercentage / 100);

      // Then apply the condition's reward percentage to the base reward
      const finalReward = baseReward * (condition.reward / 100);

      await createRewardRecord(upline.referrerId, finalReward, condition.id);
    }

    return true;
  } catch (error) {
    logError("processBinaryRewards", error, __filename);
    return false;
  }
}

// Unilevel Rewards Processing
async function processUnilevelRewards(
  condition,
  userId,
  depositAmount,
  mlmSettings
) {
  try {
    const unilevelLevels = mlmSettings.unilevel.levels;
    const uplines = await findUplines(userId, "UNILEVEL", unilevelLevels);

    if (!uplines.length) {
      return false;
    }

    // Distribute rewards starting from the closest upline
    for (let i = uplines.length - 1; i >= 0; i--) {
      const upline: { level: number; referrerId: any } = uplines[i];
      const levelIndex = unilevelLevels - i; // Reverse the index for percentage lookup
      const levelRewardPercentage = mlmSettings.unilevel.levelsPercentage.find(
        (l) => l.level === levelIndex
      )?.value;

      if (levelRewardPercentage === undefined) {
        continue;
      }

      // Calculate base reward using the level's percentage
      const baseReward = depositAmount * (levelRewardPercentage / 100);

      // Then apply the condition's reward percentage to the base reward
      const finalReward = baseReward * (condition.reward / 100);

      await createRewardRecord(upline.referrerId, finalReward, condition.id);
    }

    return true;
  } catch (error) {
    logError("processUnilevelRewards", error, __filename);
    return false;
  }
}

export const handleReferralRegister = async (refId, userId) => {
  try {
    const referrer = await models.user.findByPk(refId);

    if (referrer) {
      const referral = await models.mlmReferral.create({
        referrerId: referrer.id,
        referredId: userId,
        status: "PENDING",
      });

      const mlmSystem = settings.has("mlmSystem")
        ? settings.get("mlmSystem")
        : null;

      if (mlmSystem && mlmSystem.value === "BINARY") {
        await handleBinaryMlmReferralRegister(
          referral.referrerId,
          referral.id,
          models.mlmBinaryNode
        );
      } else if (mlmSystem && mlmSystem.value === "UNILEVEL") {
        await handleUnilevelMlmReferralRegister(
          referral.referrerId,
          referral.id,
          models.mlmUnilevelNode
        );
      }
    }
  } catch (error) {
    logError("handleReferralRegister", error, __filename);
  }
};

const handleBinaryMlmReferralRegister = async (
  referrerId,
  referralId,
  mlmBinaryNode
) => {
  try {
    const referrerNode = await mlmBinaryNode.findOne({
      where: { referralId: referrerId },
    });

    const placement =
      referrerNode && referrerNode.leftChildId ? "right" : "left";

    await mlmBinaryNode.create({
      referralId: referralId,
      parentId: referrerNode ? referrerNode.id : null,
      [`${placement}ChildId`]: referrerNode ? referrerNode.id : null,
    });
  } catch (error) {
    logError("handleBinaryMlmReferralRegister", error, __filename);
  }
};

const handleUnilevelMlmReferralRegister = async (
  referrerId,
  referralId,
  mlmUnilevelNode
) => {
  try {
    const referrerUnilevelNode = await mlmUnilevelNode.findOne({
      where: { referralId: referrerId },
    });

    await mlmUnilevelNode.create({
      referralId: referralId,
      parentId: referrerUnilevelNode ? referrerUnilevelNode.id : null,
    });
  } catch (error) {
    logError("handleUnilevelMlmReferralRegister", error, __filename);
  }
};
