import { models, sequelize } from "@b/db";
import {
  notFoundMetadataResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from "@b/utils/query";
import { createError } from "@b/utils/error";
import { getWalletByUserIdAndCurrency } from "@b/utils/eco/wallet";
import {
  sendIncomingTransferEmail,
  sendOutgoingTransferEmail,
} from "@b/utils/emails";
import { updatePrivateLedger } from "./utils";

export const metadata: OperationObject = {
  summary: "Performs a transfer transaction",
  description:
    "Initiates a transfer transaction for the currently authenticated user",
  operationId: "createTransfer",
  tags: ["Finance", "Transfer"],
  requiresAuth: true,
  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            fromType: {
              type: "string",
              description: "The type of wallet to transfer from",
            },
            toType: {
              type: "string",
              description: "The type of wallet to transfer to",
            },
            fromCurrency: {
              type: "string",
              description: "The currency to transfer from",
            },
            toCurrency: {
              type: "string",
              description: "The currency to transfer to",
              nullable: true,
            },
            amount: { type: "number", description: "Amount to transfer" },
            transferType: {
              type: "string",
              description: "Type of transfer: client or wallet",
            },
            clientId: {
              type: "string",
              description: "Client UUID for client transfers",
              nullable: true,
            },
          },
          required: [
            "fromType",
            "toType",
            "amount",
            "fromCurrency",
            "transferType",
          ],
        },
      },
    },
  },
  responses: {
    200: {
      description: "Transfer transaction initiated successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              message: { type: "string", description: "Success message" },
            },
          },
        },
      },
    },
    401: unauthorizedResponse,
    404: notFoundMetadataResponse("Withdraw Method"),
    500: serverErrorResponse,
  },
};

export default async (data: Handler) => {
  const { user, body } = data;
  if (!user?.id)
    throw createError({ statusCode: 401, message: "Unauthorized" });

  const {
    fromType,
    toType,
    amount,
    transferType,
    clientId,
    fromCurrency,
    toCurrency,
  } = body;

  if (toCurrency === "Select a currency") {
    throw createError({
      statusCode: 400,
      message: "Please select a target currency",
    });
  }

  const userPk = await models.user.findByPk(user.id);
  if (!userPk)
    throw createError({ statusCode: 404, message: "User not found" });

  const fromWallet = await models.wallet.findOne({
    where: {
      userId: user.id,
      currency: fromCurrency,
      type: fromType,
    },
  });
  if (!fromWallet)
    throw createError({ statusCode: 404, message: "Wallet not found" });

  let toWallet: any = null;
  let toUser: any = null;

  if (transferType === "client") {
    ({ toWallet, toUser } = await handleClientTransfer(
      clientId,
      fromCurrency,
      fromType
    ));
  } else {
    toWallet = await handleWalletTransfer(
      user.id,
      fromType,
      toType,
      toCurrency
    );
  }

  const parsedAmount = parseFloat(amount);
  if (fromWallet.balance < parsedAmount)
    throw createError(400, "Insufficient balance");

  const currencyData = await getCurrencyData(fromType, fromCurrency);
  if (!currencyData) throw createError(400, "Invalid wallet type");

  const transaction = await performTransaction(
    transferType,
    fromWallet,
    toWallet,
    parsedAmount,
    fromCurrency,
    toCurrency,
    user.id,
    toUser?.id,
    fromType,
    toType,
    currencyData
  );

  if (transferType === "client") {
    await sendTransferEmails(
      user,
      toUser,
      fromWallet,
      toWallet,
      parsedAmount,
      transaction
    );
  }

  return {
    message: "Transfer initiated successfully",
    fromTransfer: transaction.fromTransfer,
    toTransfer: transaction.toTransfer,
    fromType,
    toType,
    fromCurrency: fromCurrency,
    toCurrency: toCurrency,
  };
};

async function handleWalletTransfer(
  userId: string,
  fromType: "FIAT" | "SPOT" | "ECO" | "FUTURES",
  toType: "FIAT" | "SPOT" | "ECO" | "FUTURES",
  toCurrency: string
) {
  if (fromType === toType)
    throw createError(400, "Cannot transfer to the same wallet type");

  const validTransfers = {
    FIAT: ["SPOT", "ECO"],
    SPOT: ["FIAT", "ECO"],
    ECO: ["FIAT", "SPOT", "FUTURES"],
    FUTURES: ["ECO"],
  };

  if (!validTransfers[fromType] || !validTransfers[fromType].includes(toType))
    throw createError(400, "Invalid wallet type transfer");

  let toWallet = await models.wallet.findOne({
    where: { userId, currency: toCurrency, type: toType },
  });
  if (!toWallet) {
    toWallet = await models.wallet.create({
      userId,
      currency: toCurrency,
      type: toType,
      status: true,
    });
  }

  return toWallet;
}

async function performTransaction(
  transferType: string,
  fromWallet: any,
  toWallet: any,
  parsedAmount: number,
  fromCurrency: string,
  toCurrency: string,
  userId: string,
  clientId: string | null,
  fromType: string,
  toType: string,
  currencyData: any
) {
  return await sequelize.transaction(async (t) => {
    const shouldCompleteTransfer = requiresPrivateLedgerUpdate(
      transferType,
      fromType,
      toType
    );
    const fromTransferStatus = shouldCompleteTransfer ? "COMPLETED" : "PENDING";
    const toTransferStatus = shouldCompleteTransfer ? "COMPLETED" : "PENDING";

    if (shouldCompleteTransfer) {
      await handlePrivateLedgerUpdate(
        fromWallet,
        toWallet,
        parsedAmount,
        fromCurrency,
        t
      );
    } else {
      const newFromBalance = parseFloat(
        (fromWallet.balance - parsedAmount).toFixed(
          currencyData.precision || (fromType === "FIAT" ? 2 : 8)
        )
      );
      await fromWallet.update({ balance: newFromBalance }, { transaction: t });
      // Do not update toWallet balance for pending transactions
    }

    const fromTransfer = await createTransferTransaction(
      userId,
      fromWallet.id,
      "OUTGOING_TRANSFER",
      parsedAmount,
      fromCurrency,
      fromWallet.id,
      toWallet.id,
      `Transfer to ${toType} wallet`,
      fromTransferStatus,
      t
    );
    const toTransfer = await createTransferTransaction(
      transferType === "client" ? clientId! : userId,
      toWallet.id,
      "INCOMING_TRANSFER",
      parsedAmount,
      toCurrency,
      fromWallet.id,
      toWallet.id,
      `Transfer from ${fromType} wallet`,
      toTransferStatus,
      t
    );

    return { fromTransfer, toTransfer };
  });
}

async function handleClientTransfer(
  clientId: string,
  currency: string,
  fromType: "FIAT" | "SPOT" | "ECO" | "FUTURES"
) {
  if (!clientId)
    throw createError({ statusCode: 400, message: "Client ID is required" });

  const toUser = await models.user.findByPk(clientId);
  if (!toUser)
    throw createError({ statusCode: 404, message: "Target user not found" });

  let toWallet = await getWalletByUserIdAndCurrency(clientId, currency);
  if (!toWallet) {
    toWallet = await models.wallet.create({
      userId: clientId,
      currency,
      type: fromType,
      status: true,
    });
  }

  return { toWallet, toUser };
}

async function getCurrencyData(fromType: string, currency: string) {
  switch (fromType) {
    case "FIAT":
      return await models.currency.findOne({ where: { id: currency } });
    case "SPOT":
      return await models.exchangeCurrency.findOne({ where: { currency } });
    case "ECO":
    case "FUTURES":
      return await models.ecosystemToken.findOne({ where: { currency } });
  }
}

function requiresPrivateLedgerUpdate(
  transferType: string,
  fromType: string,
  toType: string
) {
  return (
    transferType === "client" ||
    (fromType === "ECO" && toType === "FUTURES") ||
    (fromType === "FUTURES" && toType === "ECO")
  );
}

async function handlePrivateLedgerUpdate(
  fromWallet: any,
  toWallet: any,
  parsedAmount: number,
  currency: string,
  t: any
) {
  const fromAddresses = parseAddresses(fromWallet.address);
  const toAddresses = parseAddresses(toWallet.address);

  let remainingAmount = parsedAmount;

  for (const chain in fromAddresses) {
    if (
      fromAddresses.hasOwnProperty(chain) &&
      fromAddresses[chain].balance > 0
    ) {
      const transferableAmount = Math.min(
        fromAddresses[chain].balance,
        remainingAmount
      );
      fromAddresses[chain].balance -= transferableAmount;
      toAddresses[chain] = {
        ...toAddresses[chain],
        ...fromAddresses[chain],
        balance: (toAddresses[chain]?.balance || 0) + transferableAmount,
      };

      await updatePrivateLedger(
        fromWallet.id,
        0,
        currency,
        chain,
        -transferableAmount
      );
      await updatePrivateLedger(
        toWallet.id,
        0,
        currency,
        chain,
        transferableAmount
      );

      remainingAmount -= transferableAmount;
      if (remainingAmount <= 0) break;
    }
  }

  if (remainingAmount > 0)
    throw createError(
      400,
      "Insufficient chain balance to complete the transfer"
    );

  await fromWallet.update(
    {
      address: JSON.stringify(fromAddresses) as any,
      balance: fromWallet.balance - parsedAmount,
    },
    { transaction: t }
  );
  await toWallet.update(
    {
      address: JSON.stringify(toAddresses),
      balance: toWallet.balance + parsedAmount,
    },
    { transaction: t }
  );
}

function parseAddresses(address: any) {
  return typeof address === "string" ? JSON.parse(address) : address || {};
}

async function createTransferTransaction(
  userId: string,
  walletId: string,
  type: "INCOMING_TRANSFER" | "OUTGOING_TRANSFER",
  amount: number,
  currency: string,
  fromWalletId: string,
  toWalletId: string,
  description: string,
  status: "PENDING" | "COMPLETED",
  transaction: any
) {
  return await models.transaction.create(
    {
      userId,
      walletId,
      type,
      amount,
      fee: 0,
      status,
      metadata: JSON.stringify({
        currency,
        fromWallet: fromWalletId,
        toWallet: toWalletId,
      }),
      description,
    },
    { transaction }
  );
}

async function sendTransferEmails(
  user: any,
  toUser: any,
  fromWallet: any,
  toWallet: any,
  amount: number,
  transaction: any
) {
  try {
    await sendOutgoingTransferEmail(
      user,
      toUser,
      fromWallet,
      amount,
      transaction.fromTransfer.id
    );
    await sendIncomingTransferEmail(
      toUser,
      user,
      toWallet,
      amount,
      transaction.toTransfer.id
    );
  } catch (error) {
    console.log("Error sending transfer email: ", error);
  }
}
