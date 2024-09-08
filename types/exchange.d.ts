enum ExchangeWatchlistType {
  TRADE = "TRADE",
  BINARY = "BINARY",
  AI_TRADING = "AI_TRADING",
  FOREX = "FOREX",
  STOCK = "STOCK",
  FUTURES = "FUTURES",
}

interface ExchangeWatchlist {
  id: string;
  userId: string;
  user: User;
  symbol: string;
  type: ExchangeWatchlistType;
  createdAt: Date;
  updatedAt: Date;
}

interface Ticker {
  symbol: string;
  timestamp: number;
  datetime: string;
  high?: number;
  low?: number;
  bid: number;
  bidVolume: number;
  ask: number;
  askVolume: number;
  vwap?: number;
  open?: number;
  close: number;
  last: number;
  previousClose?: number;
  change?: number;
  percentage?: number;
  average?: number;
  baseVolume?: number;
  quoteVolume?: number;
}

type ExchangeType = "kucoin" | "binance" | "okx";

interface Exchange {
  id: string;
  name: string;
  title: string;
  status: boolean | null;
  username: string | null;
  licenseStatus: boolean | null;
  version: string | null;
  productId: string | null;
  type: string | null;
}

interface ExchangeMarket {
  id: string;
  symbol: string;
  pair: string;
  metadata: ExchangeMarketMetaData | null;
  status: boolean;
}

interface ExchangeMarketMetaData {
  symbol: string;
  base: string;
  quote: string;
  precision: Precision;
  limits: Limits;
  taker: number;
  maker: number;
}

enum ExchangeOrderSide {
  BUY = "BUY",
  SELL = "SELL",
}

enum ExchangeOrderType {
  MARKET = "MARKET",
  LIMIT = "LIMIT",
}

enum ExchangeOrderStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
  CANCELED = "CANCELED",
  EXPIRED = "EXPIRED",
  REJECTED = "REJECTED",
}

enum ExchangeTimeInForce {
  GTC = "GTC",
  IOC = "IOC",
  FOK = "FOK",
  PO = "PO",
}

interface ExchangeOrder {
  id: string;
  referenceId: string;
  userId: string;
  user: User;
  status: ExchangeOrderStatus;
  symbol: string;
  type: ExchangeOrderType;
  timeInForce: ExchangeTimeInForce;
  side: ExchangeOrderSide;
  price: number;
  average: number;
  amount: number;
  filled: number;
  remaining: number;
  cost: number;
  trades?: any;
  fee: any;
  feeCurrency?: string;
  createdAt: Date;
  updatedAt: Date;
}

enum BinaryOrderSide {
  RISE = "RISE",
  FALL = "FALL",
}

enum BinaryOrderType {
  RISE_FALL = "RISE_FALL",
}

enum BinaryOrderStatus {
  PENDING = "PENDING",
  WIN = "WIN",
  LOSS = "LOSS",
  DRAW = "DRAW",
  CANCELLED = "CANCELLED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
}

interface BinaryOrder {
  id: string;
  userId: string;
  user?: User;
  symbol: string;
  price: number;
  amount: number;
  profit: number;
  side: BinaryOrderSide;
  type: BinaryOrderType;
  status: BinaryOrderStatus;
  isDemo: boolean;
  closedAt: Date;
  closePrice?: number;
  createdAt: Date;
  updatedAt: Date;
}

type Precision = {
  amount: number;
  price: number;
};

type Limits = {
  amount: {
    min: number;
    max: number;
  };
  price: Record<string, any>;
  cost: {
    min: number;
    max: number;
  };
  leverage: Record<string, any>;
};

type ExchangeCurrency = {
  id: string;
  name: string;
  code: string;
  precision: number;
  active: boolean;
  deposit: boolean;
  withdraw: boolean;
  networks: Record<string, ExchangeNetwork>;
  fee: number;
  limits: {
    leverage: any;
    amount: any;
    price: any;
    cost: any;
  };
};

type ExchangeNetwork = {
  id: string;
  name: string;
  network: string;
  active: boolean;
  deposit: boolean;
  withdraw: boolean;
  fee: number;
  fees: {
    withdraw: number;
  };
  precision: string;
  limits: {
    withdraw: {
      min: number;
      max: number;
    };
    deposit: any;
  };
};

type ChainAddress = {
  currency: string;
  address: string;
  network: string;
  tag?: string;
};

interface ExchangeWallet {
  id: string;
  userId: string;
  currency: string;
  inOrder?: number;
  available?: number;
  addresses?: { [key: string]: ChainAddress };
  status: boolean;
  user: User;
  transactions: ExchangeTransaction[];
}

interface ExchangeTransaction {
  id: string;
  userId: string;
  walletId: string;
  chain: string;
  memo?: string;
  type: string;
  amount: number;
  fee: number;
  toAddress?: string;
  txHash?: string;
  status: string;
  referenceId: string;
  user: User;
  wallet: ExchangeWallet;
  createdAt?: Date;
  updatedAt?: Date;
}
