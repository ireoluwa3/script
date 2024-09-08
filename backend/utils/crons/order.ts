import ExchangeManager from "@b/utils/exchange";
import {
  determineOrderStatus,
  getBinaryOrdersByStatus,
  orderIntervals,
  updateBinaryOrder,
} from "@b/api/exchange/binary/order/index.post";
import { logError } from "../logger";

export async function processPendingOrders() {
  try {
    const pendingOrders = await getBinaryOrdersByStatus("PENDING");

    const currentTime = new Date().getTime();

    const unmonitoredOrders = pendingOrders.filter((order) => {
      const closedAtTime = new Date(order.closedAt).getTime();
      return closedAtTime <= currentTime && !orderIntervals.has(order.id);
    });

    const exchange = await ExchangeManager.startExchange();

    for (const order of unmonitoredOrders) {
      const timeframe = "1m";
      const ohlcv = await exchange.fetchOHLCV(
        order.symbol,
        timeframe,
        Number(order.closedAt) - 60000,
        2
      );
      const closePrice = ohlcv[1][4];
      const updateData = determineOrderStatus(order, closePrice);
      await updateBinaryOrder(order.id, updateData);
    }
  } catch (error) {
    logError("processPendingOrders", error, __filename);
    throw error;
  }
}
