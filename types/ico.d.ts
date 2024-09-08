type IcoProject = {
  id: string;
  name: string;
  description: string;
  website: string;
  whitepaper: string;
  image: string;
  status: IcoProjectStatus;
  tokens: IcoToken[];
  contributions: IcoContribution[];
};

enum IcoProjectStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  REJECTED = "REJECTED",
}

type CreateIcoProjectInput = Omit<IcoProject, "id">;
type UpdateIcoProjectInput = Partial<Omit<IcoProject, "id">>;

type IcoToken = {
  id: string;
  name: string;
  chain: string;
  currency: string;
  purchaseCurrency: string;
  purchaseWalletType: string;
  address: string;
  totalSupply: number;
  description: string;
  image: string;
  status: IcoTokenStatus;
  projectId: string;
  project: IcoProject;
  phases: IcoPhase[];
  allocation: IcoAllocation;
};

enum IcoTokenStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
}

type CreateIcoTokenInput = Omit<IcoToken, "id">;
type UpdateIcoTokenInput = Partial<Omit<IcoToken, "id">>;

type IcoPhase = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  price: number;
  status: IcoPhaseStatus;
  tokenId: string;
  token: IcoToken;
  minPurchase: number;
  maxPurchase: number;
};

enum IcoPhaseStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
}

type CreateIcoPhaseInput = Omit<IcoPhase, "id">;
type UpdateIcoPhaseInput = Partial<Omit<IcoPhase, "id">>;

type IcoContribution = {
  id: string;
  userId: string;
  user: User;
  phaseId: string;
  phase: IcoPhase;
  amount: number;
  status: IcoContributionStatus;
};

enum IcoContributionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
}

type CreateIcoContributionInput = Omit<IcoContribution, "id">;
type UpdateIcoContributionInput = Partial<Omit<IcoContribution, "id">>;

type IcoAllocation = {
  id: string;
  name: string;
  percentage: number;
  tokenId: string;
  token: IcoToken;
  status: IcoAllocationStatus;
  phaseAllocations: IcoPhaseAllocation[];
};

enum IcoAllocationStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
}

type CreateIcoAllocationInput = Omit<IcoAllocation, "id">;
type UpdateIcoAllocationInput = Partial<Omit<IcoAllocation, "id">>;

type IcoPhaseAllocation = {
  id: string;
  allocationId: string;
  phaseId: string;
  percentage: number;
  allocation: IcoAllocation;
  phase: IcoPhase;
};

type CreateIcoPhaseAllocationInput = Omit<
  IcoPhaseAllocation,
  "id" | "allocation" | "phase"
>;
type UpdateIcoPhaseAllocationInput = Partial<
  Omit<IcoPhaseAllocation, "id" | "allocation" | "phase">
>;
