interface P2POffer {
  id: string;
  userId: string;
  walletType: WalletType;
  currency: string;
  chain: string;
  amount: number;
  minAmount: number;
  maxAmount: number;
  price: number;
  paymentMethodId: string;
  status: P2POfferStatus;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  paymentMethod: P2PPaymentMethod;
  trades: P2PTrade[];
  reviews: P2PReview[];
}

enum P2POfferStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

interface P2PTrade {
  id: string;
  userId: string;
  sellerId: string;
  offerId: string;
  escrowId: string;
  messages?: any;
  amount: number;
  status: P2PTradeStatus;
  txHash?: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  seller: User;
  offer: P2POffer;
  escrow: P2PEscrow;
  disputes: P2PDispute;
}

enum P2PTradeStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  DISPUTE_OPEN = "DISPUTE_OPEN",
  ESCROW_REVIEW = "ESCROW_REVIEW",
  CANCELLED = "CANCELLED",
  RELEASED = "RELEASED",
  COMPLETED = "COMPLETED",
  REFUNDED = "REFUNDED",
}

interface P2PEscrow {
  id: string;
  tradeId: string;
  amount: number;
  status: P2PEscrowStatus;
  createdAt: Date;
  updatedAt: Date;
  trade: P2PTrade;
}

enum P2PEscrowStatus {
  PENDING = "PENDING",
  HELD = "HELD",
  RELEASED = "RELEASED",
  CANCELLED = "CANCELLED",
}

interface P2PPaymentMethod {
  id: string;
  userId: string;
  name: string;
  instructions: string;
  currency: string;
  image?: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  offers: P2POffer[];
}

interface P2PDispute {
  id: string;
  tradeId: string;
  raisedById: string;
  reason: string;
  status: P2PDiputeStatus;
  resolution?: string;
  createdAt: Date;
  updatedAt: Date;
  trade: P2PTrade;
  raisedBy: User;
}

enum P2PDiputeStatus {
  PENDING = "PENDING",
  OPEN = "OPEN",
  RESOLVED = "RESOLVED",
  CANCELLED = "CANCELLED",
}

interface P2PReview {
  id: string;
  reviewerId: string;
  reviewedId: string;
  offerId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
  reviewer: User;
  reviewed: User;
  offer: P2POffer;
}
