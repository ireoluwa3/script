type ForexAccount = {
  id: string;
  accountId?: string;
  mt?: string;
  password?: string;
  balance: number;
  broker?: string;
  leverage: number;
  userId: string;
  type: "LIVE" | "DEMO";
  status: boolean;
  updatedAt: string;
  createdAt: string;
};

type ForexPlan = {
  id: string;
  name: string;
  title: string;
  description?: string;
  image?: string;
  status?: boolean;
  invested: number;
  profitPercentage: number;
  minProfit: number;
  maxProfit: number;
  minAmount: number;
  maxAmount: number;
  trending?: boolean;
  defaultProfit: number;
  defaultResult: ForexInvestmentResult;
  createdAt: Date;
  forexLog: ForexLog[];
  forexPlanDuration: ForexPlanDuration[];
};

type ForexLog = {
  id: string;
  userId: string;
  planId: number | null;
  durationId: number | null;
  type: ForexLogType;
  amount: number | null;
  profit: number | null;
  currency: string | null;
  trx: string | null;
  result: ForexInvestmentResult | null;
  status: ForexLogStatus;
  createdAt: Date;
  endDate: Date;
  duration: ForexDuration | null;
  plan: ForexPlan | null;
};

enum ForexInvestmentResult {
  WIN = "WIN",
  LOSS = "LOSS",
  DRAW = "DRAW",
}

enum ForexLogStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  REJECTED = "REJECTED",
}

enum ForexLogType {
  DEPOSIT = "DEPOSIT",
  WITHDRAW = "WITHDRAW",
  INVESTMENT = "INVESTMENT",
  INVESTMENT_ROI = "INVESTMENT_ROI",
}

type ForexPlanDuration = {
  id: string;
  planId: string;
  durationId: string;
  plan: ForexPlan;
  duration: ForexDuration;
};

type ForexDuration = {
  id: string;
  duration: number;
  timeframe: ForexTimeframe;
};

enum ForexTimeframe {
  HOUR = "HOUR",
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
}

type ForexSignal = {
  id: string;
  title: string;
  image: string;
  status: ForexSignalStatus;
  createdAt: Date;
  forexAccounts: ForexAccountSignal[];
};

enum ForexSignalStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

type ForexAccountSignal = {
  forexAccountId: string;
  forexSignalId: string;
};

type ForexCurrency = {
  id: string;
  currency: string;
  type?: string;
  status: boolean;
};
