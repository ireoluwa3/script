enum AiTradingResult {
  WIN = "WIN",
  LOSS = "LOSS",
  DRAW = "DRAW",
}

enum AiTradingStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  REJECTED = "REJECTED",
}

enum AiTradingTimeframe {
  HOUR = "HOUR",
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
}

interface AiTradingPlan {
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
  defaultResult: AiTradingResult;
}

interface AiTrading {
  id: string;
  userId: string;
  user: User;
  planId: string;
  plan: AiTradingPlan;
  durationId: string;
  duration: AiTradingDuration;
  market: string;
  amount: number;
  profit?: number;
  result?: AiTradingResult;
  status: AiTradingStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface AiTradingDuration {
  id: string;
  duration: number;
  timeframe: AiTradingTimeframe;
  aiInvestmentPlanDuration: AiTradingPlanDuration[];
}

interface AiTradingPlanDuration {
  id: string;
  planId: string;
  plan: AiTradingPlan;
  durationId: string;
  duration: AiTradingDuration;
}
