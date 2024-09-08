interface Wallet {
  id: string;
  type: WalletType;
  userId: string;
  balance: number;
  inOrder: number;
  currency: string;
  address: any;
  createdAt: string;
  updatedAt: string;
  transactions: Transaction[];
  invoices: Invoice[];
}

enum WalletType {
  FIAT = "FIAT",
  SPOT = "SPOT",
  ECO = "ECO",
}
interface WithdrawMethod {
  id: string;
  title: string;
  processingTime: string;
  instructions: string;
  image?: string;
  fixedFee: number;
  percentageFee: number;
  minAmount: number;
  maxAmount: number;
  customFields?: CustomField;
  status?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface DepositMethod {
  id: string;
  title: string;
  instructions: string;
  image?: string;
  fixedFee: number;
  percentageFee: number;
  minAmount: number;
  maxAmount: number;
  customFields?: CustomField;
  status?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface InvestmentPlan {
  id: string;
  name: string;
  title: string;
  image?: string;
  description: string;
  currency: string;
  minAmount: number;
  maxAmount: number;
  roi: number;
  duration: number;
  status?: boolean;
  createdAt: Date;
  investment?: Investment[];
}

interface Investment {
  id: string;
  userId: string;
  planId: string;
  amount: number;
  roi: number;
  duration: number;
  status: InvestmentStatus;
  plan: InvestmentPlan;
  createdAt: Date;
  updatedAt: Date;
}

enum InvestmentStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  REJECTED = "REJECTED",
}

enum TransactionType {
  FAILED = "FAILED",
  DEPOSIT = "DEPOSIT",
  WITHDRAW = "WITHDRAW",
  OUTGOING_TRANSFER = "OUTGOING_TRANSFER",
  INCOMING_TRANSFER = "INCOMING_TRANSFER",
  PAYMENT = "PAYMENT",
  REFUND = "REFUND",
  BINARY_ORDER = "BINARY_ORDER",
  EXCHANGE_ORDER = "EXCHANGE_ORDER",
  INVESTMENT = "INVESTMENT",
  INVESTMENT_ROI = "INVESTMENT_ROI",
  AI_INVESTMENT = "AI_INVESTMENT",
  AI_INVESTMENT_ROI = "AI_INVESTMENT_ROI",
  INVOICE = "INVOICE",
  FOREX_DEPOSIT = "FOREX_DEPOSIT",
  FOREX_WITHDRAW = "FOREX_WITHDRAW",
  FOREX_INVESTMENT = "FOREX_INVESTMENT",
  FOREX_INVESTMENT_ROI = "FOREX_INVESTMENT_ROI",
  ICO_CONTRIBUTION = "ICO_CONTRIBUTION",
  REFERRAL_REWARD = "REFERRAL_REWARD",
  STAKING = "STAKING",
  STAKING_REWARD = "STAKING_REWARD",
  P2P_OFFER_TRANSFER = "P2P_OFFER_TRANSFER",
  P2P_TRADE = "P2P_TRADE",
}

// The Transaction type maps to your Prisma model for transactions
interface Transaction {
  id: string;
  userId: string;
  walletId: string;
  type: TransactionType;
  status: string;
  amount: number;
  fee?: number;
  description?: string;
  metadata?: any; // Replace with a more specific type if you know the shape of the metadata
  referenceId?: string;
  createdAt: Date;
  updatedAt?: Date;
  wallet: Wallet;
  user: User;
  invoice: Invoice;
}

interface Invoice {
  id: string;
  walletId: string;
  userId: string;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Currency {
  id: string;
  name: string;
  symbol: string;
  precision: number;
  price?: number;
  status: boolean;
}

interface DepositGateway {
  id: string;
  name: string;
  title: string;
  description: string;
  image?: string;
  alias?: string;
  currencies?: any;
  fixedFee?: number;
  percentageFee?: number;
  minAmount?: number;
  maxAmount?: number;
  type: DepositGatewayType;
  status?: boolean;
  version?: string;
  productId?: string;
}

enum DepositGatewayType {
  FIAT = "FIAT",
  CRYPTO = "CRYPTO",
}
