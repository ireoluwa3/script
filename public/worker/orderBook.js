const aggregateData = (data, tickSize) => {
  const aggregated = [];
  data.forEach(([price, amount]) => {
    const roundedPrice = Math.floor(price / tickSize) * tickSize;
    const existing = aggregated.find(item => item.price === roundedPrice);
    if (existing) {
      existing.amount += amount;
      existing.total += price * amount;
    } else {
      aggregated.push({ price: roundedPrice, amount, total: price * amount });
    }
  });
  return aggregated;
};

const processOrderBookData = (data) => {
  const aggregatedAsks = data.asks
    .slice(0, 15)
    .map(([price, amount]) => ({
      price,
      amount,
      total: price * amount,
    }));
  const aggregatedBids = data.bids
    .slice(0, 15)
    .map(([price, amount]) => ({
      price,
      amount,
      total: price * amount,
    }));

  const totalAskVolume = aggregatedAsks.reduce((acc, ask) => acc + ask.total, 0);
  const totalBidVolume = aggregatedBids.reduce((acc, bid) => acc + bid.total, 0);
  const totalVolume = totalAskVolume + totalBidVolume;
  const askPercentage = totalVolume > 0 ? ((totalAskVolume / totalVolume) * 100).toFixed(2) : '0.00';
  const bidPercentage = totalVolume > 0 ? ((totalBidVolume / totalVolume) * 100).toFixed(2) : '0.00';
  const maxAskTotal = aggregatedAsks.length > 0 ? Math.max(...aggregatedAsks.map(a => a.total)) : 0;
  const maxBidTotal = aggregatedBids.length > 0 ? Math.max(...aggregatedBids.map(b => b.total)) : 0;
  const bestAsk = aggregatedAsks.length > 0 ? Math.min(...aggregatedAsks.map(a => a.price)) : 0;
  const bestBid = aggregatedBids.length > 0 ? Math.max(...aggregatedBids.map(b => b.price)) : 0;

  postMessage({
    asks: aggregatedAsks,
    bids: aggregatedBids,
    maxAskTotal,
    maxBidTotal,
    askPercentage,
    bidPercentage,
    bestPrices: { bestAsk, bestBid },
  });
};

onmessage = (e) => {
  processOrderBookData(e.data);
};
