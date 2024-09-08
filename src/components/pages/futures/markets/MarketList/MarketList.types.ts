export interface MarketData {
  id: string;
  symbol: string;
  currency: string;
  pair: string;
  price: string;
  change: string;
  isTrending: boolean;
  isHot: boolean;
  status: boolean;
  metadata: {
    symbol: string;
    base: string;
    quote: string;
    precision: {
      price: number;
      amount: number;
    };
    limits: {
      leverage: object;
      amount: {
        min: number;
        max: number;
      };
      price: object;
      cost: {
        min: number;
        max: number;
      };
    };
    taker: number;
    maker: number;
  };
}

// interfaces/MarketListProps.ts
export interface MarketListProps {
  marketData: MarketData[];
  searchQuery: string;
  selectedPair: string;
  toggleWatchlist: (pair: string) => void;
  watchlistData: MarketData[];
}
