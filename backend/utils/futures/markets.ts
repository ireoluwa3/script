import { models } from "@b/db";
import { futuresMarketAttributes } from "@db/futuresMarket";

export async function getFuturesMarkets(): Promise<futuresMarketAttributes[]> {
  return models.futuresMarket.findAll({
    where: {
      status: true,
    },
  });
}
