import { models } from "@b/db";
import { ecosystemMarketAttributes } from "@db/ecosystemMarket";

export async function getEcoSystemMarkets(): Promise<
  ecosystemMarketAttributes[]
> {
  return models.ecosystemMarket.findAll({
    where: {
      status: true,
    },
  });
}
