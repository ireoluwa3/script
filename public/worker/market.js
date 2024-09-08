onmessage = (e) => {
    const { marketData, tickerData } = e.data;
    const updatedMarketData = marketData.map((item) => {
      if (tickerData[item.symbol]) {
        const { last, change } = tickerData[item.symbol];
        return {
          ...item,
          price: last.toFixed(item.precision || 6),
          change: change.toFixed(2),
        };
      }
      return item;
    });
  
    postMessage(updatedMarketData);
  };
  