// /api/admin/transactions/[id]/update.put.ts
import { updateRecordResponses } from "@b/utils/query";
import { models, sequelize } from "@b/db";
import { transactionUpdateSchema } from "@b/api/finance/transaction/utils";
import {
  sendForexTransactionEmail,
  sendIcoContributionEmail,
  sendTransactionStatusUpdateEmail,
} from "@b/utils/emails";
import ExchangeManager from "@b/utils/exchange";
import { RedisSingleton } from "@b/utils/redis";
import { getLastCandles } from "@b/utils/eco/scylla/queries";

export const metadata = {
  summary: "Updates an existing transaction",
  operationId: "updateTransaction",
  tags: ["Admin", "Wallets", "Transactions"],
  parameters: [
    {
      index: 0,
      name: "id",
      in: "path",
      description: "The ID of the transaction to update",
      required: true,
      schema: {
        type: "string",
      },
    },
  ],
  requestBody: {
    required: true,
    description: "Updated data for the transaction",
    content: {
      "application/json": {
        schema: transactionUpdateSchema,
      },
    },
  },
  responses: updateRecordResponses("Transaction"),
  requiresAuth: true,
  permission: "Access Transaction Management",
};

export default async (data: Handler) => {
  const { body, params } = data;
  const { id } = params;
  const {
    status,
    amount,
    fee,
    description,
    referenceId,
    metadata: requestMetadata,
  } = body;

  return await sequelize.transaction(async (t) => {
    const transaction = await models.transaction.findOne({
      where: { id },
      transaction: t,
    });

    if (!transaction) throw new Error("Transaction not found");

    if (transaction.status !== "PENDING") {
      throw new Error("Only pending transactions can be updated");
    }

    transaction.amount = amount;
    transaction.fee = fee;
    transaction.description = description;
    transaction.referenceId = referenceId;

    if (["FOREX_WITHDRAW", "FOREX_DEPOSIT"].includes(transaction.type)) {
      await handleForexTransaction(transaction, status, requestMetadata, t);
    } else if (["DEPOSIT", "WITHDRAW"].includes(transaction.type)) {
      await handleWalletTransaction(transaction, status, requestMetadata, t);
    } else if (transaction.type === "INCOMING_TRANSFER") {
      await handleIncomingTransfer(transaction, status, requestMetadata, t);
    } else if (transaction.type === "ICO_CONTRIBUTION") {
      await handleIcoContribution(transaction, status, requestMetadata, t);
    }

    transaction.status = status;
    await transaction.save({ transaction: t });

    return { message: "Transaction updated successfully" };
  });
};

function parseMetadata(metadataString) {
  let metadata: any = {};

  try {
    metadataString = metadataString.replace(/\\/g, "");
    metadata = JSON.parse(metadataString) || {};
  } catch (e) {
    console.error("Invalid JSON in metadata:", metadataString);
  }
  return metadata;
}

async function handleIncomingTransfer(transaction, status, rejection, t) {
  const metadata: any = parseMetadata(transaction.metadata);

  const wallet = await models.wallet.findOne({
    where: { id: transaction.walletId },
    transaction: t,
  });
  if (!wallet) throw new Error("Wallet not found");

  let price = 1; // Default price for USDT
  const fromCurrency = metadata.fromCurrency;
  const toCurrency = metadata.toCurrency;
  const descriptionParts = transaction.description.split(" ");
  const fromType = descriptionParts[2]; // "SPOT", "ECO", "FIAT"

  if (fromType === "FIAT") {
    const currency = await models.currency.findOne({
      where: { id: fromCurrency },
      transaction: t,
    });
    if (!currency) throw new Error("Currency not found");
    if (currency.price === null || typeof currency.price === "undefined")
      throw new Error("Currency price not found");

    price = currency.price;
  } else if (fromType === "SPOT") {
    if (fromCurrency !== "USDT") {
      const redis = RedisSingleton.getInstance();
      const cachedData = await redis.get("exchange:tickers");
      const tickers = cachedData ? JSON.parse(cachedData) : {};

      if (!tickers[fromCurrency]) {
        const exchange = await ExchangeManager.startExchange();
        const ticker = await exchange.fetchTicker(`${fromCurrency}/USDT`);
        if (!ticker || !ticker.last) {
          throw new Error("Unable to fetch current market price");
        }
        price = ticker.last;
      } else {
        price = tickers[fromCurrency].last;
      }
    }
  } else if (fromType === "ECO") {
    const candles = await getLastCandles();
    const candle = candles.find((c) => c.symbol === fromCurrency);
    if (!candle)
      throw new Error("Unable to fetch candle data for the currency");
    price = candle.close;
  }

  const amountToAdd = Number(transaction.amount) * price;

  let walletBalance = Number(wallet.balance);
  walletBalance += amountToAdd;
  await models.wallet.update(
    { balance: walletBalance },
    { where: { id: wallet.id }, transaction: t }
  );

  if (rejection) {
    metadata.message = rejection.message;
  }

  transaction.metadata = JSON.stringify(metadata);
}

async function handleForexTransaction(transaction, status, rejection, t) {
  const metadata: any = parseMetadata(transaction.metadata);

  const cost = Number(transaction.amount) * Number(metadata.price);

  if (transaction.status === "PENDING") {
    const account = await models.forexAccount.findOne({
      where: { userId: transaction.userId, type: "LIVE" },
      transaction: t,
    });
    if (!account) throw new Error("Account not found");

    const wallet = await models.wallet.findOne({
      where: { id: transaction.walletId },
      transaction: t,
    });
    if (!wallet) throw new Error("Wallet not found");

    if (status === "REJECTED") {
      await handleForexRejection(transaction, account, wallet, cost, t);
    } else if (status === "COMPLETED") {
      await handleForexCompletion(transaction, account, wallet, cost, t);
    }

    const user = await models.user.findOne({
      where: { id: transaction.userId },
    });
    if (user) {
      await sendForexTransactionEmail(
        user,
        transaction,
        account,
        wallet.currency,
        transaction.type as "FOREX_DEPOSIT" | "FOREX_WITHDRAW"
      );
    }
  }

  if (rejection) {
    metadata.message = rejection.message;
  }

  transaction.metadata = JSON.stringify(metadata);
}

async function handleWalletTransaction(transaction, status, rejection, t) {
  const metadata = parseMetadata(transaction.metadata);

  const wallet = await models.wallet.findOne({
    where: { id: transaction.walletId },
    transaction: t,
  });
  if (!wallet) throw new Error("Wallet not found");

  if (transaction.status === "PENDING") {
    if (status === "REJECTED") {
      await handleWalletRejection(transaction, wallet, t);
    } else if (status === "COMPLETED") {
      await handleWalletCompletion(transaction, wallet, t);
    }

    const user = await models.user.findOne({
      where: { id: transaction.userId },
    });
    if (user) {
      await sendTransactionStatusUpdateEmail(
        user,
        transaction,
        wallet,
        wallet.balance,
        metadata.message || null
      );
    }
  }

  if (rejection) {
    metadata.message = rejection.message;
  }

  transaction.metadata = JSON.stringify(metadata);
}

async function handleForexRejection(transaction, account, wallet, cost, t) {
  if (transaction.type === "FOREX_WITHDRAW") {
    await updateForexAccountBalance(account, cost, true, t);
  } else if (transaction.type === "FOREX_DEPOSIT") {
    await updateWalletBalance(wallet, cost, true, t);
  }
}

async function handleForexCompletion(transaction, account, wallet, cost, t) {
  if (transaction.type === "FOREX_DEPOSIT") {
    await updateForexAccountBalance(account, cost, false, t);
  } else if (transaction.type === "FOREX_WITHDRAW") {
    await updateWalletBalance(wallet, cost, false, t);
  }
}

async function handleWalletRejection(transaction, wallet, t) {
  let balance = Number(wallet.balance);
  if (transaction.type === "WITHDRAW") {
    balance += Number(transaction.amount);
  }
  if (wallet.balance !== balance) {
    await models.wallet.update(
      { balance },
      { where: { id: wallet.id }, transaction: t }
    );
  }
}

async function handleWalletCompletion(transaction, wallet, t) {
  let balance = Number(wallet.balance);
  if (transaction.type === "DEPOSIT") {
    balance += Number(transaction.amount) - Number(transaction.fee);
  } else if (transaction.type === "WITHDRAW") {
    balance -= Number(transaction.amount);
    if (balance < 0) throw new Error("Insufficient wallet balance");
  }
  if (wallet.balance !== balance) {
    await models.wallet.update(
      { balance },
      { where: { id: wallet.id }, transaction: t }
    );
  }
}

async function updateForexAccountBalance(account, cost, refund, t) {
  let balance = Number(account.balance);
  balance = refund ? balance + cost : balance - cost;

  if (balance < 0) throw new Error("Insufficient forex account balance");

  await models.forexAccount.update(
    { balance },
    { where: { id: account.id }, transaction: t }
  );

  return models.forexAccount.findOne({
    where: { id: account.id },
    transaction: t,
  });
}

async function updateWalletBalance(wallet, cost, refund, t) {
  let walletBalance = Number(wallet.balance);
  walletBalance = refund ? walletBalance + cost : walletBalance - cost;

  if (walletBalance < 0) throw new Error("Insufficient wallet balance");

  await models.wallet.update(
    { balance: walletBalance },
    { where: { id: wallet.id }, transaction: t }
  );

  return wallet;
}

async function handleIcoContribution(transaction, status, rejection, t) {
  const metadata = parseMetadata(transaction.metadata);

  const contribution = await models.icoContribution.findOne({
    where: { id: transaction.referenceId },
    transaction: t,
  });
  if (!contribution) throw new Error("ICO Contribution not found");

  if (transaction.status === "PENDING") {
    if (status === "REJECTED") {
      await handleIcoContributionRejection(contribution, transaction, t);
    } else if (status === "COMPLETED") {
      await handleIcoContributionCompletion(contribution, transaction, t);
    }

    const user = await models.user.findOne({
      where: { id: transaction.userId },
    });
    const phase = (await models.icoPhase.findByPk(contribution.phaseId, {
      include: [{ model: models.icoToken, as: "token" }],
      transaction: t,
    })) as any;

    if (user && phase) {
      await sendIcoContributionEmail(
        user,
        contribution,
        phase.token,
        phase,
        "IcoContributionPaid",
        transaction.id
      );
    }
  }

  if (rejection) {
    metadata.message = rejection.message;
  }

  transaction.metadata = JSON.stringify(metadata);
}

async function handleIcoContributionRejection(contribution, transaction, t) {
  // Logic to handle ICO contribution rejection, such as refunding the amount
  const wallet = await models.wallet.findOne({
    where: { id: transaction.walletId },
    transaction: t,
  });
  if (!wallet) throw new Error("Wallet not found");

  wallet.balance += Number(transaction.amount);
  await wallet.save({ transaction: t });

  contribution.status = "REJECTED";
  await contribution.save({ transaction: t });
}

async function handleIcoContributionCompletion(contribution, transaction, t) {
  // Logic to handle ICO contribution completion, such as updating the token allocation
  contribution.status = "COMPLETED";
  await contribution.save({ transaction: t });

  // Additional logic for processing token allocation, etc.
}
