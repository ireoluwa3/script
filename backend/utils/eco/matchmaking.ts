import { models } from "@b/db";
import {
  BigIntReplacer,
  fromBigInt,
  fromBigIntMultiply,
  removeTolerance,
} from "./blockchain";
import type { Order, OrderBook } from "./scylla/queries";
import { updateWalletBalance } from "./wallet";
import { walletAttributes } from "@db/wallet";
import { handleTradesBroadcast } from "./ws";
import { logError } from "@b/utils/logger";

const SCALING_FACTOR = BigInt(10 ** 18);

export const matchAndCalculateOrders = async (
  orders: Order[],
  currentOrderBook: OrderBook
) => {
  const matchedOrders: Order[] = [];
  const bookUpdates: OrderBook = { bids: {}, asks: {} };
  const processedOrders: Set<string> = new Set();

  const buyOrders = filterAndSortOrders(orders, "BUY", true);
  const sellOrders = filterAndSortOrders(orders, "SELL", false);

  let buyIndex = 0,
    sellIndex = 0;

  while (buyIndex < buyOrders.length && sellIndex < sellOrders.length) {
    const buyOrder = buyOrders[buyIndex];
    const sellOrder = sellOrders[sellIndex];

    if (processedOrders.has(buyOrder.id) || processedOrders.has(sellOrder.id)) {
      if (processedOrders.has(buyOrder.id)) buyIndex++;
      if (processedOrders.has(sellOrder.id)) sellIndex++;
      continue;
    }

    let matchFound = false;

    if (buyOrder.type === "LIMIT" && sellOrder.type === "LIMIT") {
      matchFound =
        (buyOrder.side === "BUY" && buyOrder.price >= sellOrder.price) ||
        (buyOrder.side === "SELL" && sellOrder.price >= buyOrder.price);
    } else if (buyOrder.type === "MARKET" || sellOrder.type === "MARKET") {
      matchFound = true;
    }

    if (matchFound) {
      processedOrders.add(buyOrder.id);
      processedOrders.add(sellOrder.id);

      try {
        await processMatchedOrders(
          buyOrder,
          sellOrder,
          currentOrderBook,
          bookUpdates
        );
      } catch (error) {
        logError("match_calculate_orders", error, __filename);
        console.error(`Failed to process matched orders: ${error}`);
      }

      matchedOrders.push(buyOrder, sellOrder);

      if (buyOrder.type === "LIMIT" && buyOrder.remaining === BigInt(0)) {
        buyIndex++;
      }
      if (sellOrder.type === "LIMIT" && sellOrder.remaining === BigInt(0)) {
        sellIndex++;
      }

      if (buyOrder.type === "MARKET" && buyOrder.remaining > BigInt(0)) {
        processedOrders.delete(buyOrder.id);
      }
      if (sellOrder.type === "MARKET" && sellOrder.remaining > BigInt(0)) {
        processedOrders.delete(sellOrder.id);
      }
    } else {
      if (
        buyOrder.type !== "MARKET" &&
        BigInt(buyOrder.price) < BigInt(sellOrder.price)
      ) {
        buyIndex++;
      }
      if (
        sellOrder.type !== "MARKET" &&
        BigInt(sellOrder.price) > BigInt(buyOrder.price)
      ) {
        sellIndex++;
      }
    }
  }

  return { matchedOrders, bookUpdates };
};

export const processMatchedOrders = async (
  buyOrder: Order,
  sellOrder: Order,
  currentOrderBook: OrderBook,
  bookUpdates: OrderBook
) => {
  const amountToFill =
    BigInt(buyOrder.remaining) < BigInt(sellOrder.remaining)
      ? BigInt(buyOrder.remaining)
      : BigInt(sellOrder.remaining);

  updateOrderBook(bookUpdates, buyOrder, currentOrderBook, amountToFill);
  updateOrderBook(bookUpdates, sellOrder, currentOrderBook, amountToFill);

  [buyOrder, sellOrder].forEach((order) => {
    order.filled += amountToFill;
    order.remaining -= amountToFill;
    order.status = order.remaining === BigInt(0) ? "CLOSED" : "OPEN";
  });

  const [currency, pair] = buyOrder.symbol.split("/");

  try {
    const buyerWallet = await getUserEcosystemWalletByCurrency(
      buyOrder.userId,
      currency
    );
    const sellerWallet = await getUserEcosystemWalletByCurrency(
      sellOrder.userId,
      pair
    );

    if (buyerWallet && sellerWallet) {
      const cost =
        (amountToFill * BigInt(buyOrder.price)) / BigInt(SCALING_FACTOR);
      const fee =
        (cost * BigInt(sellOrder.fee)) / (BigInt(100) * BigInt(SCALING_FACTOR));

      await updateWalletBalance(
        buyerWallet,
        fromBigInt(removeTolerance(amountToFill)),
        "add"
      );
      await updateWalletBalance(
        sellerWallet,
        fromBigInt(removeTolerance(cost - fee)),
        "add"
      );
    }
  } catch (error) {
    logError("process_matched_orders", error, __filename);
    console.error(`Failed to update wallet balances: ${error}`);
  }

  const finalPrice =
    buyOrder.type === "MARKET"
      ? sellOrder.price
      : sellOrder.type === "MARKET"
      ? buyOrder.price
      : buyOrder.price;

  const buyTradeDetail: TradeDetail = {
    id: `${buyOrder.id}`,
    amount: fromBigInt(amountToFill),
    price: fromBigInt(finalPrice),
    cost: fromBigIntMultiply(amountToFill, finalPrice),
    side: buyOrder.side as EcosystemOrderSide,
    timestamp: Date.now(),
  };

  const sellTradeDetail: TradeDetail = {
    id: `${sellOrder.id}`,
    amount: fromBigInt(amountToFill),
    price: fromBigInt(finalPrice),
    cost: fromBigIntMultiply(amountToFill, finalPrice),
    side: sellOrder.side as EcosystemOrderSide,
    timestamp: Date.now(),
  };

  addTradeToOrder(buyOrder, buyTradeDetail);
  addTradeToOrder(sellOrder, sellTradeDetail);

  const trades = [buyTradeDetail, sellTradeDetail];
  handleTradesBroadcast(buyOrder.symbol, trades);
};

export function addTradeToOrder(order: Order, trade: TradeDetail) {
  let trades: TradeDetail[] = [];

  if (order.trades) {
    try {
      if (typeof order.trades === "string") {
        trades = JSON.parse(order.trades);
        if (!Array.isArray(trades) && typeof trades === "string") {
          trades = JSON.parse(trades);
        }
      } else if (Array.isArray(order.trades)) {
        trades = order.trades;
      } else {
        logError(
          "add_trade_to_order",
          new Error("Invalid trades format"),
          __filename
        );
        console.error("Invalid trades format, resetting trades:", order.trades);
        trades = [];
      }
    } catch (e) {
      logError("add_trade_to_order", e, __filename);
      console.error("Error parsing trades", e);
      trades = [];
    }
  }

  const mergedTrades = [...trades, trade].sort(
    (a, b) => a.timestamp - b.timestamp
  );

  order.trades = JSON.stringify(mergedTrades, BigIntReplacer);
  return order.trades;
}

const updateOrderBook = (
  bookUpdates: OrderBook,
  order: Order,
  currentOrderBook: OrderBook,
  amount: bigint
) => {
  const priceStr = order.price.toString();
  const bookSide = order.side === "BUY" ? "bids" : "asks";

  if (currentOrderBook[bookSide][priceStr]) {
    currentOrderBook[bookSide][priceStr] -= amount;
  }

  bookUpdates[bookSide][priceStr] = currentOrderBook[bookSide][priceStr];
};

export const filterAndSortOrders = (
  orders: Order[],
  side: "BUY" | "SELL",
  isBuy: boolean
): Order[] => {
  return orders
    .filter((o) => o.side === side)
    .sort((a, b) => {
      if (isBuy) {
        return (
          Number(b.price) - Number(a.price) ||
          a.createdAt.getTime() - b.createdAt.getTime()
        );
      } else {
        return (
          Number(a.price) - Number(b.price) ||
          a.createdAt.getTime() - b.createdAt.getTime()
        );
      }
    })
    .filter((order) => !isBuy || BigInt(order.price) >= BigInt(0));
};

export function validateOrder(order: Order): boolean {
  if (
    !order ||
    !order.id ||
    !order.userId ||
    !order.symbol ||
    !order.type ||
    !order.side ||
    typeof order.price !== "bigint" ||
    typeof order.amount !== "bigint" ||
    typeof order.filled !== "bigint" ||
    typeof order.remaining !== "bigint" ||
    typeof order.cost !== "bigint" ||
    typeof order.fee !== "bigint" ||
    !order.feeCurrency ||
    !order.status ||
    !(order.createdAt instanceof Date) ||
    !(order.updatedAt instanceof Date)
  ) {
    logError(
      "validate_order",
      new Error("Order validation failed"),
      __filename
    );
    console.error("Order validation failed: ", order);
    return false;
  }
  return true;
}

export function sortOrders(orders: Order[], isBuy: boolean): Order[] {
  return orders.sort((a, b) => {
    const priceComparison = isBuy
      ? Number(b.price - a.price)
      : Number(a.price - b.price);
    if (priceComparison !== 0) return priceComparison;

    if (a.createdAt < b.createdAt) return -1;
    if (a.createdAt > b.createdAt) return 1;
    return 0;
  });
}

export async function getUserEcosystemWalletByCurrency(
  userId: string,
  currency: string
): Promise<walletAttributes> {
  try {
    const wallet = await models.wallet.findOne({
      where: {
        userId,
        currency,
        type: "ECO",
      },
    });

    if (!wallet) {
      throw new Error(
        `Wallet not found for user ${userId} and currency ${currency}`
      );
    }

    return wallet;
  } catch (error) {
    logError("get_user_wallet", error, __filename);
    throw error;
  }
}
