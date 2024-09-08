import { Op } from "sequelize";
import ExchangeManager from "@b/utils/exchange";
import { sendMessageToRoute } from "@b/handler/Websocket";
import { createError } from "@b/utils/error";
import { processRewards } from "@b/utils/affiliate";
import { getUserById } from "@b/api/user/profile/index.get";
import { sendSpotWalletDepositConfirmationEmail } from "@b/utils/emails";
import { models } from "@b/db";
import { walletAttributes } from "@db/wallet";
import { updateTransaction } from "../../utils";
import { handleNotification } from "@b/utils/notifications";
import { settings } from "../../../../..";

const path = "/api/finance/deposit/spot";
export const metadata = {};
export const spotVerificationIntervals: Map<string, NodeJS.Timeout> = new Map();

export default async (data: Handler, message) => {
  const { user } = data;

  if (!user?.id) throw createError(401, "Unauthorized");
  if (typeof message === "string") {
    message = JSON.parse(message);
  }

  const { trx } = message.payload;

  const transaction = await models.transaction.findOne({
    where: { referenceId: trx, userId: user.id, type: "DEPOSIT" },
  });

  if (!transaction) {
    return sendMessage(message.payload, {
      status: 404,
      message: "Transaction not found",
    });
  }

  startSpotVerificationSchedule(transaction.id, user.id, trx);
};

const sendMessage = (payload, data) => {
  try {
    sendMessageToRoute(path, payload, {
      stream: "verification",
      data: data,
    });
  } catch (error) {
    console.error(`Failed to send message: ${error}`);
  }
};

export function startSpotVerificationSchedule(
  transactionId: string,
  userId: string,
  trx: string
) {
  const payload = {
    trx,
  };
  // Clear any existing interval for this transaction (if any)
  const existingInterval = spotVerificationIntervals.get(transactionId);
  if (existingInterval) {
    clearInterval(existingInterval);
  }

  // Schedule the verifyTransaction function to run every 30 seconds
  const interval = setInterval(async () => {
    try {
      await verifyTransaction(userId, trx, payload);
    } catch (error) {
      console.error(`Error verifying transaction: ${error.message}`);
      stopVerificationSchedule(transactionId);
    }
  }, 15000);

  // Store the interval in the map
  spotVerificationIntervals.set(transactionId, interval);

  // Stop the verification schedule after 30 minutes
  setTimeout(() => {
    stopVerificationSchedule(transactionId);
  }, 1800000); // 30 minutes in milliseconds
}

export function stopVerificationSchedule(transactionId: string) {
  const interval = spotVerificationIntervals.get(transactionId);
  if (interval) {
    clearInterval(interval);
    spotVerificationIntervals.delete(transactionId);
  }
}

function isValidJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

function unescapeString(str) {
  return str.replace(/\\\"/g, '"').replace(/\\\\/g, "\\");
}

export async function verifyTransaction(
  userId: string,
  trx: string,
  payload: any
) {
  const transaction = await getTransactionQuery(userId, trx);

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  const wallet = await models.wallet.findByPk(transaction.walletId);
  if (!wallet) {
    throw new Error("Wallet not found");
  }

  let metadata;
  if (transaction.metadata) {
    try {
      // Unescape the string if it's not valid JSON
      let metadataStr = transaction.metadata;
      if (!isValidJSON(metadataStr)) {
        metadataStr = unescapeString(metadataStr);
      }
      // Parse the unescaped string
      metadata = JSON.parse(metadataStr);

      // If the parsed metadata is still a string, parse it again
      if (typeof metadata === "string") {
        try {
          metadata = JSON.parse(metadata.trim());
        } catch (error) {
          console.error(
            "Error parsing transaction metadata on second attempt:",
            metadata,
            error.message
          );
          throw new Error("Invalid transaction metadata on second attempt");
        }
      }
    } catch (error) {
      console.error(
        "Error parsing transaction metadata on first attempt:",
        transaction.metadata,
        error.message
      );
      throw new Error("Invalid transaction metadata on first attempt");
    }
  } else {
    metadata = {};
  }

  if (transaction.status === "COMPLETED") {
    sendMessage(payload, {
      status: 201,
      message: "Transaction already completed",
      transaction,
      balance: wallet.balance,
      currency: wallet.currency,
      chain: metadata.chain,
      method: "Wallet Transfer",
    });
    stopVerificationSchedule(transaction.id);
    return;
  }

  // Initialize exchange
  const exchange = await ExchangeManager.startExchange();
  if (!exchange) {
    throw new Error("Exchange not found");
  }
  const provider = await ExchangeManager.getProvider();
  if (!provider) {
    throw new Error("Provider not found");
  }

  try {
    await ExchangeManager.testExchangeCredentials(provider);
  } catch (error) {
    console.error(`Error testing exchange credentials: ${error.message}`);
    return;
  }

  let deposits: any[] = []; // Initialize to an empty array
  try {
    if (exchange.has["fetchDeposits"]) {
      deposits = await exchange.fetchDeposits(wallet.currency);
    } else if (exchange.has["fetchTransactions"]) {
      deposits = await exchange.fetchTransactions();
    }
  } catch (error) {
    console.error("Error fetching deposits or transactions:", error);
    return; // Exit the function if we can't fetch deposits
  }

  // Now, deposits is guaranteed to be an array (possibly empty)
  const deposit = deposits.find((d) => d.txid === transaction.referenceId);

  if (!deposit) {
    return;
  }

  if (deposit.status !== "ok") {
    return;
  }

  const amount = deposit.amount;
  const fee = deposit.fee?.cost || 0;

  if (
    ["kucoin", "binance", "okx"].includes(provider) &&
    wallet.currency !== deposit.currency
  ) {
    sendMessage(payload, {
      status: 400,
      message: "Invalid deposit currency",
    });
    stopVerificationSchedule(transaction.id);
    await deleteTransaction(transaction.id);
    return;
  }

  if (transaction.status === "COMPLETED") {
    sendMessage(payload, {
      status: 201,
      message: "Transaction already completed",
      transaction,
      balance: wallet.balance,
      currency: wallet.currency,
      chain: metadata.chain,
      method: "Wallet Transfer",
    });
    stopVerificationSchedule(transaction.id);
    return;
  }

  if (
    settings.has("depositExpiration") &&
    settings.get("depositExpiration").value === "true"
  ) {
    const createdAt = deposit.timestamp / 1000;
    const transactionCreatedAt =
      new Date(transaction.createdAt).getTime() / 1000;
    const currentTime = Date.now() / 1000;
    const timeDiff = (currentTime - createdAt) / 60; // Difference in minutes

    if (
      createdAt < transactionCreatedAt - 900 ||
      createdAt > transactionCreatedAt + 900 ||
      timeDiff > 45
    ) {
      sendMessage(payload, {
        status: 400,
        message: "Deposit expired",
      });
      stopVerificationSchedule(transaction.id);
      await updateTransaction(transaction.id, {
        status: "TIMEOUT",
        description: "Deposit expired. Please try again.",
        amount: amount,
      });
      return;
    }
  }

  // update the amount and fee of the transaction using the deposit data
  const updatedTransaction = await updateTransaction(transaction.id, {
    status: "COMPLETED",
    description: `Deposit of ${amount} ${wallet.currency} to wallet`,
    amount: amount,
    fee: fee,
  });

  // Update the wallet balance
  const updatedWallet = (await updateSpotWalletBalance(
    userId,
    wallet.currency,
    amount,
    fee,
    "DEPOSIT"
  )) as walletAttributes;

  if (!updatedWallet) {
    sendMessage(payload, {
      status: 500,
      message: "Failed to update wallet balance",
    });
    stopVerificationSchedule(updatedTransaction.id);
    return;
  }

  // Transfer the amount from main to trade account within KuCoin
  if (provider === "kucoin") {
    try {
      // Transferring the amount from main to trade account within KuCoin
      await exchange.transfer(wallet.currency, deposit.amount, "main", "trade");
    } catch (error) {
      console.error(`Transfer failed: ${error.message}`);
    }
  }

  const userData = await getUserById(userId);
  try {
    await sendSpotWalletDepositConfirmationEmail(
      userData,
      updatedTransaction,
      updatedWallet,
      metadata.chain
    );
    await handleNotification({
      userId: userId,
      type: "ACTIVITY",
      title: "Deposit Confirmation",
      message: `Your deposit of ${amount} ${wallet.currency} has been confirmed.`,
    });
  } catch (error) {
    console.error(`Deposit confirmation email failed: ${error.message}`);
  }

  try {
    await processRewards(userData.id, amount, "WELCOME_BONUS", wallet.currency);
  } catch (error) {
    console.error(`Error processing rewards: ${error.message}`);
  }

  sendMessage(payload, {
    status: 200,
    message: "Transaction completed",
    transaction: updatedTransaction,
    balance: updatedWallet.balance,
    currency: updatedWallet.currency,
    chain: metadata.chain,
    method: "Wallet Transfer",
  });
  stopVerificationSchedule(updatedTransaction.id);
}

export async function getTransactionQuery(userId: string, trx: string) {
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

  const transaction = await models.transaction.findOne({
    where: {
      referenceId: trx,
      userId: userId,
      type: "DEPOSIT",
      createdAt: {
        [Op.gte]: thirtyMinutesAgo,
      },
    },
    include: [
      {
        model: models.wallet,
        as: "wallet",
        attributes: ["id", "currency"],
      },
      {
        model: models.user,
        as: "user",
        attributes: ["firstName", "lastName", "email", "avatar"],
      },
    ],
  });

  if (!transaction) {
    throw new Error("Transaction not found");
  }

  return transaction.get({ plain: true }) as unknown as Transaction;
}

export async function deleteTransaction(id: string) {
  await models.transaction.destroy({
    where: {
      id,
    },
  });
}

export async function updateSpotWalletBalance(
  userId: string,
  currency: string,
  amount: number,
  fee: number,
  type: "DEPOSIT" | "WITHDRAWAL" | "REFUND_WITHDRAWAL"
) {
  const wallet = await models.wallet.findOne({
    where: {
      userId: userId,
      currency: currency,
      type: "SPOT",
    },
  });

  if (!wallet) {
    return new Error("Wallet not found");
  }

  let balance;
  switch (type) {
    case "WITHDRAWAL":
      balance = wallet.balance - (amount + fee);
      break;
    case "DEPOSIT":
      balance = wallet.balance + (amount - fee);
      break;
    case "REFUND_WITHDRAWAL":
      balance = wallet.balance + amount + fee;
      break;
    default:
      break;
  }

  if (balance < 0) {
    throw new Error("Insufficient balance");
  }

  await models.wallet.update(
    {
      balance: balance,
    },
    {
      where: {
        id: wallet.id,
      },
    }
  );

  const updatedWallet = await models.wallet.findByPk(wallet.id);

  if (!updatedWallet) {
    throw new Error("Wallet not found");
  }

  return updatedWallet.get({ plain: true });
}
