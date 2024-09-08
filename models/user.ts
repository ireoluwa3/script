import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { aiInvestment, aiInvestmentId } from "./aiInvestment";
import type { apiKey, apiKeyId } from "./apiKey";
import type { author, authorCreationAttributes, authorId } from "./author";
import type { binaryOrder, binaryOrderId } from "./binaryOrder";
import type { ecommerceOrder, ecommerceOrderId } from "./ecommerceOrder";
import type { ecommerceReview, ecommerceReviewId } from "./ecommerceReview";
import type {
  ecommerceUserDiscount,
  ecommerceUserDiscountId,
} from "./ecommerceUserDiscount";
import type {
  ecommerceWishlist,
  ecommerceWishlistId,
} from "./ecommerceWishlist";
import type { exchangeOrder, exchangeOrderId } from "./exchangeOrder";
import type {
  exchangeWatchlist,
  exchangeWatchlistId,
} from "./exchangeWatchlist";
import type { forexAccount, forexAccountId } from "./forexAccount";
import type { forexInvestment, forexInvestmentId } from "./forexInvestment";
import type { icoContribution, icoContributionId } from "./icoContribution";
import type { investment, investmentId } from "./investment";
import type { invoice, invoiceId } from "./invoice";
import type { kyc, kycCreationAttributes, kycId } from "./kyc";
import type {
  mlmReferral,
  mlmReferralCreationAttributes,
  mlmReferralId,
} from "./mlmReferral";
import type {
  mlmReferralReward,
  mlmReferralRewardId,
} from "./mlmReferralReward";
import type { notification, notificationId } from "./notification";
import type { p2pDispute, p2pDisputeId } from "./p2pDispute";
import type { p2pOffer, p2pOfferId } from "./p2pOffer";
import type { p2pPaymentMethod, p2pPaymentMethodId } from "./p2pPaymentMethod";
import type { p2pReview, p2pReviewId } from "./p2pReview";
import type { p2pTrade, p2pTradeId } from "./p2pTrade";
import type { providerUser, providerUserId } from "./providerUser";
import type { role, roleId } from "./role";
import type { stakingLog, stakingLogId } from "./stakingLog";
import type { supportTicket, supportTicketId } from "./supportTicket";
import type { transaction, transactionId } from "./transaction";
import type {
  twoFactor,
  twoFactorCreationAttributes,
  twoFactorId,
} from "./twoFactor";
import type { wallet, walletId } from "./wallet";

export interface userAttributes {
  id: string;
  email?: string;
  password?: string;
  avatar?: string | null;
  firstName?: string;
  lastName?: string;
  emailVerified: boolean;
  phone?: string;
  roleId: number;
  profile?: string;
  lastLogin?: Date;
  lastFailedLogin?: Date | null;
  failedLoginAttempts?: number;
  walletAddress?: string;
  walletProvider?: string;
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "BANNED";
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

export type userPk = "id";
export type userId = user[userPk];
export type userOptionalAttributes =
  | "id"
  | "email"
  | "password"
  | "avatar"
  | "firstName"
  | "lastName"
  | "emailVerified"
  | "phone"
  | "roleId"
  | "profile"
  | "lastLogin"
  | "lastFailedLogin"
  | "failedLoginAttempts"
  | "walletAddress"
  | "walletProvider"
  | "status"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
export type userCreationAttributes = Optional<
  userAttributes,
  userOptionalAttributes
>;

export class user
  extends Model<userAttributes, userCreationAttributes>
  implements userAttributes
{
  id!: string;

  email?: string;
  password?: string;
  avatar?: string | null;
  firstName?: string;
  lastName?: string;
  emailVerified!: boolean;
  phone?: string;
  roleId!: number;
  profile?: string;
  lastLogin?: Date;
  lastFailedLogin?: Date | null;
  failedLoginAttempts?: number;
  walletAddress?: string;
  walletProvider?: string;
  status?: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "BANNED";
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // user belongsTo role via roleId
  role!: role;
  getRole!: Sequelize.BelongsToGetAssociationMixin<role>;
  setRole!: Sequelize.BelongsToSetAssociationMixin<role, roleId>;
  createRole!: Sequelize.BelongsToCreateAssociationMixin<role>;
  // user hasMany aiInvestment via userId
  aiInvestments!: aiInvestment[];
  getAiTradings!: Sequelize.HasManyGetAssociationsMixin<aiInvestment>;
  setAiTradings!: Sequelize.HasManySetAssociationsMixin<
    aiInvestment,
    aiInvestmentId
  >;
  addAiTrading!: Sequelize.HasManyAddAssociationMixin<
    aiInvestment,
    aiInvestmentId
  >;
  addAiTradings!: Sequelize.HasManyAddAssociationsMixin<
    aiInvestment,
    aiInvestmentId
  >;
  createAiTrading!: Sequelize.HasManyCreateAssociationMixin<aiInvestment>;
  removeAiTrading!: Sequelize.HasManyRemoveAssociationMixin<
    aiInvestment,
    aiInvestmentId
  >;
  removeAiTradings!: Sequelize.HasManyRemoveAssociationsMixin<
    aiInvestment,
    aiInvestmentId
  >;
  hasAiTrading!: Sequelize.HasManyHasAssociationMixin<
    aiInvestment,
    aiInvestmentId
  >;
  hasAiTradings!: Sequelize.HasManyHasAssociationsMixin<
    aiInvestment,
    aiInvestmentId
  >;
  countAiTradings!: Sequelize.HasManyCountAssociationsMixin;
  // user hasMany apiKey via userId
  apiKeys!: apiKey[];
  getApiKeys!: Sequelize.HasManyGetAssociationsMixin<apiKey>;
  setApiKeys!: Sequelize.HasManySetAssociationsMixin<apiKey, apiKeyId>;
  addApiKey!: Sequelize.HasManyAddAssociationMixin<apiKey, apiKeyId>;
  addApiKeys!: Sequelize.HasManyAddAssociationsMixin<apiKey, apiKeyId>;
  createApiKey!: Sequelize.HasManyCreateAssociationMixin<apiKey>;
  removeApiKey!: Sequelize.HasManyRemoveAssociationMixin<apiKey, apiKeyId>;
  removeApiKeys!: Sequelize.HasManyRemoveAssociationsMixin<apiKey, apiKeyId>;
  hasApiKey!: Sequelize.HasManyHasAssociationMixin<apiKey, apiKeyId>;
  hasApiKeys!: Sequelize.HasManyHasAssociationsMixin<apiKey, apiKeyId>;
  countApiKeys!: Sequelize.HasManyCountAssociationsMixin;
  // user hasOne author via userId
  author!: author;
  getAuthor!: Sequelize.HasOneGetAssociationMixin<author>;
  setAuthor!: Sequelize.HasOneSetAssociationMixin<author, authorId>;
  createAuthor!: Sequelize.HasOneCreateAssociationMixin<author>;
  // user hasMany binaryOrder via userId
  binaryOrder!: binaryOrder[];
  getBinaryOrders!: Sequelize.HasManyGetAssociationsMixin<binaryOrder>;
  setBinaryOrders!: Sequelize.HasManySetAssociationsMixin<
    binaryOrder,
    binaryOrderId
  >;
  addBinaryOrder!: Sequelize.HasManyAddAssociationMixin<
    binaryOrder,
    binaryOrderId
  >;
  addBinaryOrders!: Sequelize.HasManyAddAssociationsMixin<
    binaryOrder,
    binaryOrderId
  >;
  createBinaryOrder!: Sequelize.HasManyCreateAssociationMixin<binaryOrder>;
  removeBinaryOrder!: Sequelize.HasManyRemoveAssociationMixin<
    binaryOrder,
    binaryOrderId
  >;
  removeBinaryOrders!: Sequelize.HasManyRemoveAssociationsMixin<
    binaryOrder,
    binaryOrderId
  >;
  hasBinaryOrder!: Sequelize.HasManyHasAssociationMixin<
    binaryOrder,
    binaryOrderId
  >;
  hasBinaryOrders!: Sequelize.HasManyHasAssociationsMixin<
    binaryOrder,
    binaryOrderId
  >;
  countBinaryOrders!: Sequelize.HasManyCountAssociationsMixin;
  // user hasMany ecommerceOrder via userId
  ecommerceOrders!: ecommerceOrder[];
  getEcommerceOrders!: Sequelize.HasManyGetAssociationsMixin<ecommerceOrder>;
  setEcommerceOrders!: Sequelize.HasManySetAssociationsMixin<
    ecommerceOrder,
    ecommerceOrderId
  >;
  addEcommerceOrder!: Sequelize.HasManyAddAssociationMixin<
    ecommerceOrder,
    ecommerceOrderId
  >;
  addEcommerceOrders!: Sequelize.HasManyAddAssociationsMixin<
    ecommerceOrder,
    ecommerceOrderId
  >;
  createEcommerceOrder!: Sequelize.HasManyCreateAssociationMixin<ecommerceOrder>;
  removeEcommerceOrder!: Sequelize.HasManyRemoveAssociationMixin<
    ecommerceOrder,
    ecommerceOrderId
  >;
  removeEcommerceOrders!: Sequelize.HasManyRemoveAssociationsMixin<
    ecommerceOrder,
    ecommerceOrderId
  >;
  hasEcommerceOrder!: Sequelize.HasManyHasAssociationMixin<
    ecommerceOrder,
    ecommerceOrderId
  >;
  hasEcommerceOrders!: Sequelize.HasManyHasAssociationsMixin<
    ecommerceOrder,
    ecommerceOrderId
  >;
  countEcommerceOrders!: Sequelize.HasManyCountAssociationsMixin;
  // user hasMany ecommerceReview via userId
  ecommerceReviews!: ecommerceReview[];
  getEcommerceReviews!: Sequelize.HasManyGetAssociationsMixin<ecommerceReview>;
  setEcommerceReviews!: Sequelize.HasManySetAssociationsMixin<
    ecommerceReview,
    ecommerceReviewId
  >;
  addEcommerceReview!: Sequelize.HasManyAddAssociationMixin<
    ecommerceReview,
    ecommerceReviewId
  >;
  addEcommerceReviews!: Sequelize.HasManyAddAssociationsMixin<
    ecommerceReview,
    ecommerceReviewId
  >;
  createEcommerceReview!: Sequelize.HasManyCreateAssociationMixin<ecommerceReview>;
  removeEcommerceReview!: Sequelize.HasManyRemoveAssociationMixin<
    ecommerceReview,
    ecommerceReviewId
  >;
  removeEcommerceReviews!: Sequelize.HasManyRemoveAssociationsMixin<
    ecommerceReview,
    ecommerceReviewId
  >;
  hasEcommerceReview!: Sequelize.HasManyHasAssociationMixin<
    ecommerceReview,
    ecommerceReviewId
  >;
  hasEcommerceReviews!: Sequelize.HasManyHasAssociationsMixin<
    ecommerceReview,
    ecommerceReviewId
  >;
  countEcommerceReviews!: Sequelize.HasManyCountAssociationsMixin;
  // user hasMany ecommerceUserDiscount via userId
  ecommerceUserDiscounts!: ecommerceUserDiscount[];
  getEcommerceUserDiscounts!: Sequelize.HasManyGetAssociationsMixin<ecommerceUserDiscount>;
  setEcommerceUserDiscounts!: Sequelize.HasManySetAssociationsMixin<
    ecommerceUserDiscount,
    ecommerceUserDiscountId
  >;
  addEcommerceUserDiscount!: Sequelize.HasManyAddAssociationMixin<
    ecommerceUserDiscount,
    ecommerceUserDiscountId
  >;
  addEcommerceUserDiscounts!: Sequelize.HasManyAddAssociationsMixin<
    ecommerceUserDiscount,
    ecommerceUserDiscountId
  >;
  createEcommerceUserDiscount!: Sequelize.HasManyCreateAssociationMixin<ecommerceUserDiscount>;
  removeEcommerceUserDiscount!: Sequelize.HasManyRemoveAssociationMixin<
    ecommerceUserDiscount,
    ecommerceUserDiscountId
  >;
  removeEcommerceUserDiscounts!: Sequelize.HasManyRemoveAssociationsMixin<
    ecommerceUserDiscount,
    ecommerceUserDiscountId
  >;
  hasEcommerceUserDiscount!: Sequelize.HasManyHasAssociationMixin<
    ecommerceUserDiscount,
    ecommerceUserDiscountId
  >;
  hasEcommerceUserDiscounts!: Sequelize.HasManyHasAssociationsMixin<
    ecommerceUserDiscount,
    ecommerceUserDiscountId
  >;
  countEcommerceUserDiscounts!: Sequelize.HasManyCountAssociationsMixin;
  // user hasMany ecommerceWishlist via userId
  ecommerceWishlists!: ecommerceWishlist[];
  getEcommerceWishlists!: Sequelize.HasManyGetAssociationsMixin<ecommerceWishlist>;
  setEcommerceWishlists!: Sequelize.HasManySetAssociationsMixin<
    ecommerceWishlist,
    ecommerceWishlistId
  >;
  addEcommerceWishlist!: Sequelize.HasManyAddAssociationMixin<
    ecommerceWishlist,
    ecommerceWishlistId
  >;
  addEcommerceWishlists!: Sequelize.HasManyAddAssociationsMixin<
    ecommerceWishlist,
    ecommerceWishlistId
  >;
  createEcommerceWishlist!: Sequelize.HasManyCreateAssociationMixin<ecommerceWishlist>;
  removeEcommerceWishlist!: Sequelize.HasManyRemoveAssociationMixin<
    ecommerceWishlist,
    ecommerceWishlistId
  >;
  removeEcommerceWishlists!: Sequelize.HasManyRemoveAssociationsMixin<
    ecommerceWishlist,
    ecommerceWishlistId
  >;
  hasEcommerceWishlist!: Sequelize.HasManyHasAssociationMixin<
    ecommerceWishlist,
    ecommerceWishlistId
  >;
  hasEcommerceWishlists!: Sequelize.HasManyHasAssociationsMixin<
    ecommerceWishlist,
    ecommerceWishlistId
  >;
  countEcommerceWishlists!: Sequelize.HasManyCountAssociationsMixin;
  // user hasMany exchangeOrder via userId
  exchangeOrder!: exchangeOrder[];
  getExchangeOrders!: Sequelize.HasManyGetAssociationsMixin<exchangeOrder>;
  setExchangeOrders!: Sequelize.HasManySetAssociationsMixin<
    exchangeOrder,
    exchangeOrderId
  >;
  addExchangeOrder!: Sequelize.HasManyAddAssociationMixin<
    exchangeOrder,
    exchangeOrderId
  >;
  addExchangeOrders!: Sequelize.HasManyAddAssociationsMixin<
    exchangeOrder,
    exchangeOrderId
  >;
  createExchangeOrder!: Sequelize.HasManyCreateAssociationMixin<exchangeOrder>;
  removeExchangeOrder!: Sequelize.HasManyRemoveAssociationMixin<
    exchangeOrder,
    exchangeOrderId
  >;
  removeExchangeOrders!: Sequelize.HasManyRemoveAssociationsMixin<
    exchangeOrder,
    exchangeOrderId
  >;
  hasExchangeOrder!: Sequelize.HasManyHasAssociationMixin<
    exchangeOrder,
    exchangeOrderId
  >;
  hasExchangeOrders!: Sequelize.HasManyHasAssociationsMixin<
    exchangeOrder,
    exchangeOrderId
  >;
  countExchangeOrders!: Sequelize.HasManyCountAssociationsMixin;
  // user hasMany exchangeWatchlist via userId
  exchangeWatchlists!: exchangeWatchlist[];
  getExchangeWatchlists!: Sequelize.HasManyGetAssociationsMixin<exchangeWatchlist>;
  setExchangeWatchlists!: Sequelize.HasManySetAssociationsMixin<
    exchangeWatchlist,
    exchangeWatchlistId
  >;
  addExchangeWatchlist!: Sequelize.HasManyAddAssociationMixin<
    exchangeWatchlist,
    exchangeWatchlistId
  >;
  addExchangeWatchlists!: Sequelize.HasManyAddAssociationsMixin<
    exchangeWatchlist,
    exchangeWatchlistId
  >;
  createExchangeWatchlist!: Sequelize.HasManyCreateAssociationMixin<exchangeWatchlist>;
  removeExchangeWatchlist!: Sequelize.HasManyRemoveAssociationMixin<
    exchangeWatchlist,
    exchangeWatchlistId
  >;
  removeExchangeWatchlists!: Sequelize.HasManyRemoveAssociationsMixin<
    exchangeWatchlist,
    exchangeWatchlistId
  >;
  hasExchangeWatchlist!: Sequelize.HasManyHasAssociationMixin<
    exchangeWatchlist,
    exchangeWatchlistId
  >;
  hasExchangeWatchlists!: Sequelize.HasManyHasAssociationsMixin<
    exchangeWatchlist,
    exchangeWatchlistId
  >;
  countExchangeWatchlists!: Sequelize.HasManyCountAssociationsMixin;
  // user hasMany forexAccount via userId
  forexAccounts!: forexAccount[];
  getForexAccounts!: Sequelize.HasManyGetAssociationsMixin<forexAccount>;
  setForexAccounts!: Sequelize.HasManySetAssociationsMixin<
    forexAccount,
    forexAccountId
  >;
  addForexAccount!: Sequelize.HasManyAddAssociationMixin<
    forexAccount,
    forexAccountId
  >;
  addForexAccounts!: Sequelize.HasManyAddAssociationsMixin<
    forexAccount,
    forexAccountId
  >;
  createForexAccount!: Sequelize.HasManyCreateAssociationMixin<forexAccount>;
  removeForexAccount!: Sequelize.HasManyRemoveAssociationMixin<
    forexAccount,
    forexAccountId
  >;
  removeForexAccounts!: Sequelize.HasManyRemoveAssociationsMixin<
    forexAccount,
    forexAccountId
  >;
  hasForexAccount!: Sequelize.HasManyHasAssociationMixin<
    forexAccount,
    forexAccountId
  >;
  hasForexAccounts!: Sequelize.HasManyHasAssociationsMixin<
    forexAccount,
    forexAccountId
  >;
  countForexAccounts!: Sequelize.HasManyCountAssociationsMixin;
  // user hasMany forexInvestment via userId
  forexInvestments!: forexInvestment[];
  getForexInvestments!: Sequelize.HasManyGetAssociationsMixin<forexInvestment>;
  setForexInvestments!: Sequelize.HasManySetAssociationsMixin<
    forexInvestment,
    forexInvestmentId
  >;
  addForexInvestment!: Sequelize.HasManyAddAssociationMixin<
    forexInvestment,
    forexInvestmentId
  >;
  addForexInvestments!: Sequelize.HasManyAddAssociationsMixin<
    forexInvestment,
    forexInvestmentId
  >;
  createForexInvestment!: Sequelize.HasManyCreateAssociationMixin<forexInvestment>;
  removeForexInvestment!: Sequelize.HasManyRemoveAssociationMixin<
    forexInvestment,
    forexInvestmentId
  >;
  removeForexInvestments!: Sequelize.HasManyRemoveAssociationsMixin<
    forexInvestment,
    forexInvestmentId
  >;
  hasForexInvestment!: Sequelize.HasManyHasAssociationMixin<
    forexInvestment,
    forexInvestmentId
  >;
  hasForexInvestments!: Sequelize.HasManyHasAssociationsMixin<
    forexInvestment,
    forexInvestmentId
  >;
  countForexInvestments!: Sequelize.HasManyCountAssociationsMixin;
  // user hasMany icoContribution via userId
  icoContributions!: icoContribution[];
  getIcoContributions!: Sequelize.HasManyGetAssociationsMixin<icoContribution>;
  setIcoContributions!: Sequelize.HasManySetAssociationsMixin<
    icoContribution,
    icoContributionId
  >;
  addIcoContribution!: Sequelize.HasManyAddAssociationMixin<
    icoContribution,
    icoContributionId
  >;
  addIcoContributions!: Sequelize.HasManyAddAssociationsMixin<
    icoContribution,
    icoContributionId
  >;
  createIcoContribution!: Sequelize.HasManyCreateAssociationMixin<icoContribution>;
  removeIcoContribution!: Sequelize.HasManyRemoveAssociationMixin<
    icoContribution,
    icoContributionId
  >;
  removeIcoContributions!: Sequelize.HasManyRemoveAssociationsMixin<
    icoContribution,
    icoContributionId
  >;
  hasIcoContribution!: Sequelize.HasManyHasAssociationMixin<
    icoContribution,
    icoContributionId
  >;
  hasIcoContributions!: Sequelize.HasManyHasAssociationsMixin<
    icoContribution,
    icoContributionId
  >;
  countIcoContributions!: Sequelize.HasManyCountAssociationsMixin;
  // user hasMany investment via userId
  investments!: investment[];
  getInvestments!: Sequelize.HasManyGetAssociationsMixin<investment>;
  setInvestments!: Sequelize.HasManySetAssociationsMixin<
    investment,
    investmentId
  >;
  addInvestment!: Sequelize.HasManyAddAssociationMixin<
    investment,
    investmentId
  >;
  addInvestments!: Sequelize.HasManyAddAssociationsMixin<
    investment,
    investmentId
  >;
  createInvestment!: Sequelize.HasManyCreateAssociationMixin<investment>;
  removeInvestment!: Sequelize.HasManyRemoveAssociationMixin<
    investment,
    investmentId
  >;
  removeInvestments!: Sequelize.HasManyRemoveAssociationsMixin<
    investment,
    investmentId
  >;
  hasInvestment!: Sequelize.HasManyHasAssociationMixin<
    investment,
    investmentId
  >;
  hasInvestments!: Sequelize.HasManyHasAssociationsMixin<
    investment,
    investmentId
  >;
  countInvestments!: Sequelize.HasManyCountAssociationsMixin;
  // user hasMany invoice via senderId
  invoices!: invoice[];
  getInvoices!: Sequelize.HasManyGetAssociationsMixin<invoice>;
  setInvoices!: Sequelize.HasManySetAssociationsMixin<invoice, invoiceId>;
  addInvoice!: Sequelize.HasManyAddAssociationMixin<invoice, invoiceId>;
  addInvoices!: Sequelize.HasManyAddAssociationsMixin<invoice, invoiceId>;
  createInvoice!: Sequelize.HasManyCreateAssociationMixin<invoice>;
  removeInvoice!: Sequelize.HasManyRemoveAssociationMixin<invoice, invoiceId>;
  removeInvoices!: Sequelize.HasManyRemoveAssociationsMixin<invoice, invoiceId>;
  hasInvoice!: Sequelize.HasManyHasAssociationMixin<invoice, invoiceId>;
  hasInvoices!: Sequelize.HasManyHasAssociationsMixin<invoice, invoiceId>;
  countInvoices!: Sequelize.HasManyCountAssociationsMixin;
  // user hasMany invoice via receiverId
  receiverInvoices!: invoice[];
  getReceiverInvoices!: Sequelize.HasManyGetAssociationsMixin<invoice>;
  setReceiverInvoices!: Sequelize.HasManySetAssociationsMixin<
    invoice,
    invoiceId
  >;
  addReceiverInvoice!: Sequelize.HasManyAddAssociationMixin<invoice, invoiceId>;
  addReceiverInvoices!: Sequelize.HasManyAddAssociationsMixin<
    invoice,
    invoiceId
  >;
  createReceiverInvoice!: Sequelize.HasManyCreateAssociationMixin<invoice>;
  removeReceiverInvoice!: Sequelize.HasManyRemoveAssociationMixin<
    invoice,
    invoiceId
  >;
  removeReceiverInvoices!: Sequelize.HasManyRemoveAssociationsMixin<
    invoice,
    invoiceId
  >;
  hasReceiverInvoice!: Sequelize.HasManyHasAssociationMixin<invoice, invoiceId>;
  hasReceiverInvoices!: Sequelize.HasManyHasAssociationsMixin<
    invoice,
    invoiceId
  >;
  countReceiverInvoices!: Sequelize.HasManyCountAssociationsMixin;
  // user hasOne kyc via userId
  kyc!: kyc;
  getKyc!: Sequelize.HasOneGetAssociationMixin<kyc>;
  setKyc!: Sequelize.HasOneSetAssociationMixin<kyc, kycId>;
  createKyc!: Sequelize.HasOneCreateAssociationMixin<kyc>;
  // user hasOne mlmReferral via referrerId
  mlmReferral!: mlmReferral;
  getMlmReferral!: Sequelize.HasOneGetAssociationMixin<mlmReferral>;
  setMlmReferral!: Sequelize.HasOneSetAssociationMixin<
    mlmReferral,
    mlmReferralId
  >;
  createMlmReferral!: Sequelize.HasOneCreateAssociationMixin<mlmReferral>;
  // user hasOne mlmReferral via referredId
  referredUuMlmReferral!: mlmReferral;
  getReferredUuMlmReferral!: Sequelize.HasOneGetAssociationMixin<mlmReferral>;
  setReferredUuMlmReferral!: Sequelize.HasOneSetAssociationMixin<
    mlmReferral,
    mlmReferralId
  >;
  createReferredUuMlmReferral!: Sequelize.HasOneCreateAssociationMixin<mlmReferral>;
  // user hasMany mlmReferralReward via referrerId
  mlmReferralRewards!: mlmReferralReward[];
  getMlmReferralRewards!: Sequelize.HasManyGetAssociationsMixin<mlmReferralReward>;
  setMlmReferralRewards!: Sequelize.HasManySetAssociationsMixin<
    mlmReferralReward,
    mlmReferralRewardId
  >;
  addMlmReferralReward!: Sequelize.HasManyAddAssociationMixin<
    mlmReferralReward,
    mlmReferralRewardId
  >;
  addMlmReferralRewards!: Sequelize.HasManyAddAssociationsMixin<
    mlmReferralReward,
    mlmReferralRewardId
  >;
  createMlmReferralReward!: Sequelize.HasManyCreateAssociationMixin<mlmReferralReward>;
  removeMlmReferralReward!: Sequelize.HasManyRemoveAssociationMixin<
    mlmReferralReward,
    mlmReferralRewardId
  >;
  removeMlmReferralRewards!: Sequelize.HasManyRemoveAssociationsMixin<
    mlmReferralReward,
    mlmReferralRewardId
  >;
  hasMlmReferralReward!: Sequelize.HasManyHasAssociationMixin<
    mlmReferralReward,
    mlmReferralRewardId
  >;
  hasMlmReferralRewards!: Sequelize.HasManyHasAssociationsMixin<
    mlmReferralReward,
    mlmReferralRewardId
  >;
  countMlmReferralRewards!: Sequelize.HasManyCountAssociationsMixin;
  // user hasMany notification via userId
  notifications!: notification[];
  getNotifications!: Sequelize.HasManyGetAssociationsMixin<notification>;
  setNotifications!: Sequelize.HasManySetAssociationsMixin<
    notification,
    notificationId
  >;
  addNotification!: Sequelize.HasManyAddAssociationMixin<
    notification,
    notificationId
  >;
  addNotifications!: Sequelize.HasManyAddAssociationsMixin<
    notification,
    notificationId
  >;
  createNotification!: Sequelize.HasManyCreateAssociationMixin<notification>;
  removeNotification!: Sequelize.HasManyRemoveAssociationMixin<
    notification,
    notificationId
  >;
  removeNotifications!: Sequelize.HasManyRemoveAssociationsMixin<
    notification,
    notificationId
  >;
  hasNotification!: Sequelize.HasManyHasAssociationMixin<
    notification,
    notificationId
  >;
  hasNotifications!: Sequelize.HasManyHasAssociationsMixin<
    notification,
    notificationId
  >;
  countNotifications!: Sequelize.HasManyCountAssociationsMixin;
  // user hasMany p2pDispute via raisedById
  p2pDisputes!: p2pDispute[];
  getP2pDisputes!: Sequelize.HasManyGetAssociationsMixin<p2pDispute>;
  setP2pDisputes!: Sequelize.HasManySetAssociationsMixin<
    p2pDispute,
    p2pDisputeId
  >;
  addP2pDispute!: Sequelize.HasManyAddAssociationMixin<
    p2pDispute,
    p2pDisputeId
  >;
  addP2pDisputes!: Sequelize.HasManyAddAssociationsMixin<
    p2pDispute,
    p2pDisputeId
  >;
  createP2pDispute!: Sequelize.HasManyCreateAssociationMixin<p2pDispute>;
  removeP2pDispute!: Sequelize.HasManyRemoveAssociationMixin<
    p2pDispute,
    p2pDisputeId
  >;
  removeP2pDisputes!: Sequelize.HasManyRemoveAssociationsMixin<
    p2pDispute,
    p2pDisputeId
  >;
  hasP2pDispute!: Sequelize.HasManyHasAssociationMixin<
    p2pDispute,
    p2pDisputeId
  >;
  hasP2pDisputes!: Sequelize.HasManyHasAssociationsMixin<
    p2pDispute,
    p2pDisputeId
  >;
  countP2pDisputes!: Sequelize.HasManyCountAssociationsMixin;
  // user hasMany p2pOffer via userId
  p2pOffers!: p2pOffer[];
  getP2pOffers!: Sequelize.HasManyGetAssociationsMixin<p2pOffer>;
  setP2pOffers!: Sequelize.HasManySetAssociationsMixin<p2pOffer, p2pOfferId>;
  addP2pOffer!: Sequelize.HasManyAddAssociationMixin<p2pOffer, p2pOfferId>;
  addP2pOffers!: Sequelize.HasManyAddAssociationsMixin<p2pOffer, p2pOfferId>;
  createP2pOffer!: Sequelize.HasManyCreateAssociationMixin<p2pOffer>;
  removeP2pOffer!: Sequelize.HasManyRemoveAssociationMixin<
    p2pOffer,
    p2pOfferId
  >;
  removeP2pOffers!: Sequelize.HasManyRemoveAssociationsMixin<
    p2pOffer,
    p2pOfferId
  >;
  hasP2pOffer!: Sequelize.HasManyHasAssociationMixin<p2pOffer, p2pOfferId>;
  hasP2pOffers!: Sequelize.HasManyHasAssociationsMixin<p2pOffer, p2pOfferId>;
  countP2pOffers!: Sequelize.HasManyCountAssociationsMixin;
  // user hasMany p2pPaymentMethod via userId
  p2pPaymentMethods!: p2pPaymentMethod[];
  getP2pPaymentMethods!: Sequelize.HasManyGetAssociationsMixin<p2pPaymentMethod>;
  setP2pPaymentMethods!: Sequelize.HasManySetAssociationsMixin<
    p2pPaymentMethod,
    p2pPaymentMethodId
  >;
  addP2pPaymentMethod!: Sequelize.HasManyAddAssociationMixin<
    p2pPaymentMethod,
    p2pPaymentMethodId
  >;
  addP2pPaymentMethods!: Sequelize.HasManyAddAssociationsMixin<
    p2pPaymentMethod,
    p2pPaymentMethodId
  >;
  createP2pPaymentMethod!: Sequelize.HasManyCreateAssociationMixin<p2pPaymentMethod>;
  removeP2pPaymentMethod!: Sequelize.HasManyRemoveAssociationMixin<
    p2pPaymentMethod,
    p2pPaymentMethodId
  >;
  removeP2pPaymentMethods!: Sequelize.HasManyRemoveAssociationsMixin<
    p2pPaymentMethod,
    p2pPaymentMethodId
  >;
  hasP2pPaymentMethod!: Sequelize.HasManyHasAssociationMixin<
    p2pPaymentMethod,
    p2pPaymentMethodId
  >;
  hasP2pPaymentMethods!: Sequelize.HasManyHasAssociationsMixin<
    p2pPaymentMethod,
    p2pPaymentMethodId
  >;
  countP2pPaymentMethods!: Sequelize.HasManyCountAssociationsMixin;
  // user hasMany p2pReview via reviewerId
  p2pReviews!: p2pReview[];
  getP2pReviews!: Sequelize.HasManyGetAssociationsMixin<p2pReview>;
  setP2pReviews!: Sequelize.HasManySetAssociationsMixin<p2pReview, p2pReviewId>;
  addP2pReview!: Sequelize.HasManyAddAssociationMixin<p2pReview, p2pReviewId>;
  addP2pReviews!: Sequelize.HasManyAddAssociationsMixin<p2pReview, p2pReviewId>;
  createP2pReview!: Sequelize.HasManyCreateAssociationMixin<p2pReview>;
  removeP2pReview!: Sequelize.HasManyRemoveAssociationMixin<
    p2pReview,
    p2pReviewId
  >;
  removeP2pReviews!: Sequelize.HasManyRemoveAssociationsMixin<
    p2pReview,
    p2pReviewId
  >;
  hasP2pReview!: Sequelize.HasManyHasAssociationMixin<p2pReview, p2pReviewId>;
  hasP2pReviews!: Sequelize.HasManyHasAssociationsMixin<p2pReview, p2pReviewId>;
  countP2pReviews!: Sequelize.HasManyCountAssociationsMixin;
  // user hasMany p2pReview via reviewedId
  reviewedP2pReviews!: p2pReview[];
  getReviewedP2pReviews!: Sequelize.HasManyGetAssociationsMixin<p2pReview>;
  setReviewedP2pReviews!: Sequelize.HasManySetAssociationsMixin<
    p2pReview,
    p2pReviewId
  >;
  addReviewedP2pReview!: Sequelize.HasManyAddAssociationMixin<
    p2pReview,
    p2pReviewId
  >;
  addReviewedP2pReviews!: Sequelize.HasManyAddAssociationsMixin<
    p2pReview,
    p2pReviewId
  >;
  createReviewedP2pReview!: Sequelize.HasManyCreateAssociationMixin<p2pReview>;
  removeReviewedP2pReview!: Sequelize.HasManyRemoveAssociationMixin<
    p2pReview,
    p2pReviewId
  >;
  removeReviewedP2pReviews!: Sequelize.HasManyRemoveAssociationsMixin<
    p2pReview,
    p2pReviewId
  >;
  hasReviewedP2pReview!: Sequelize.HasManyHasAssociationMixin<
    p2pReview,
    p2pReviewId
  >;
  hasReviewedP2pReviews!: Sequelize.HasManyHasAssociationsMixin<
    p2pReview,
    p2pReviewId
  >;
  countReviewedP2pReviews!: Sequelize.HasManyCountAssociationsMixin;
  // user hasMany p2pTrade via userId
  p2pTrades!: p2pTrade[];
  getP2pTrades!: Sequelize.HasManyGetAssociationsMixin<p2pTrade>;
  setP2pTrades!: Sequelize.HasManySetAssociationsMixin<p2pTrade, p2pTradeId>;
  addP2pTrade!: Sequelize.HasManyAddAssociationMixin<p2pTrade, p2pTradeId>;
  addP2pTrades!: Sequelize.HasManyAddAssociationsMixin<p2pTrade, p2pTradeId>;
  createP2pTrade!: Sequelize.HasManyCreateAssociationMixin<p2pTrade>;
  removeP2pTrade!: Sequelize.HasManyRemoveAssociationMixin<
    p2pTrade,
    p2pTradeId
  >;
  removeP2pTrades!: Sequelize.HasManyRemoveAssociationsMixin<
    p2pTrade,
    p2pTradeId
  >;
  hasP2pTrade!: Sequelize.HasManyHasAssociationMixin<p2pTrade, p2pTradeId>;
  hasP2pTrades!: Sequelize.HasManyHasAssociationsMixin<p2pTrade, p2pTradeId>;
  countP2pTrades!: Sequelize.HasManyCountAssociationsMixin;
  // user hasMany p2pTrade via sellerId
  sellerP2pTrades!: p2pTrade[];
  getSellerP2pTrades!: Sequelize.HasManyGetAssociationsMixin<p2pTrade>;
  setSellerP2pTrades!: Sequelize.HasManySetAssociationsMixin<
    p2pTrade,
    p2pTradeId
  >;
  addSellerP2pTrade!: Sequelize.HasManyAddAssociationMixin<
    p2pTrade,
    p2pTradeId
  >;
  addSellerP2pTrades!: Sequelize.HasManyAddAssociationsMixin<
    p2pTrade,
    p2pTradeId
  >;
  createSellerP2pTrade!: Sequelize.HasManyCreateAssociationMixin<p2pTrade>;
  removeSellerP2pTrade!: Sequelize.HasManyRemoveAssociationMixin<
    p2pTrade,
    p2pTradeId
  >;
  removeSellerP2pTrades!: Sequelize.HasManyRemoveAssociationsMixin<
    p2pTrade,
    p2pTradeId
  >;
  hasSellerP2pTrade!: Sequelize.HasManyHasAssociationMixin<
    p2pTrade,
    p2pTradeId
  >;
  hasSellerP2pTrades!: Sequelize.HasManyHasAssociationsMixin<
    p2pTrade,
    p2pTradeId
  >;
  countSellerP2pTrades!: Sequelize.HasManyCountAssociationsMixin;
  // user hasMany providerUser via userId
  providerUsers!: providerUser[];
  getProviderusers!: Sequelize.HasManyGetAssociationsMixin<providerUser>;
  setProviderusers!: Sequelize.HasManySetAssociationsMixin<
    providerUser,
    providerUserId
  >;
  addProvideruser!: Sequelize.HasManyAddAssociationMixin<
    providerUser,
    providerUserId
  >;
  addProviderusers!: Sequelize.HasManyAddAssociationsMixin<
    providerUser,
    providerUserId
  >;
  createProvideruser!: Sequelize.HasManyCreateAssociationMixin<providerUser>;
  removeProvideruser!: Sequelize.HasManyRemoveAssociationMixin<
    providerUser,
    providerUserId
  >;
  removeProviderusers!: Sequelize.HasManyRemoveAssociationsMixin<
    providerUser,
    providerUserId
  >;
  hasProvideruser!: Sequelize.HasManyHasAssociationMixin<
    providerUser,
    providerUserId
  >;
  hasProviderusers!: Sequelize.HasManyHasAssociationsMixin<
    providerUser,
    providerUserId
  >;
  countProviderusers!: Sequelize.HasManyCountAssociationsMixin;
  // user hasMany stakingLog via userId
  stakingLogs!: stakingLog[];
  getStakingLogs!: Sequelize.HasManyGetAssociationsMixin<stakingLog>;
  setStakingLogs!: Sequelize.HasManySetAssociationsMixin<
    stakingLog,
    stakingLogId
  >;
  addStakingLog!: Sequelize.HasManyAddAssociationMixin<
    stakingLog,
    stakingLogId
  >;
  addStakingLogs!: Sequelize.HasManyAddAssociationsMixin<
    stakingLog,
    stakingLogId
  >;
  createStakingLog!: Sequelize.HasManyCreateAssociationMixin<stakingLog>;
  removeStakingLog!: Sequelize.HasManyRemoveAssociationMixin<
    stakingLog,
    stakingLogId
  >;
  removeStakingLogs!: Sequelize.HasManyRemoveAssociationsMixin<
    stakingLog,
    stakingLogId
  >;
  hasStakingLog!: Sequelize.HasManyHasAssociationMixin<
    stakingLog,
    stakingLogId
  >;
  hasStakingLogs!: Sequelize.HasManyHasAssociationsMixin<
    stakingLog,
    stakingLogId
  >;
  countStakingLogs!: Sequelize.HasManyCountAssociationsMixin;
  // user hasMany supportTicket via userId
  supportTickets!: supportTicket[];
  getSupportTickets!: Sequelize.HasManyGetAssociationsMixin<supportTicket>;
  setSupportTickets!: Sequelize.HasManySetAssociationsMixin<
    supportTicket,
    supportTicketId
  >;
  addSupportTicket!: Sequelize.HasManyAddAssociationMixin<
    supportTicket,
    supportTicketId
  >;
  addSupportTickets!: Sequelize.HasManyAddAssociationsMixin<
    supportTicket,
    supportTicketId
  >;
  createSupportTicket!: Sequelize.HasManyCreateAssociationMixin<supportTicket>;
  removeSupportTicket!: Sequelize.HasManyRemoveAssociationMixin<
    supportTicket,
    supportTicketId
  >;
  removeSupportTickets!: Sequelize.HasManyRemoveAssociationsMixin<
    supportTicket,
    supportTicketId
  >;
  hasSupportTicket!: Sequelize.HasManyHasAssociationMixin<
    supportTicket,
    supportTicketId
  >;
  hasSupportTickets!: Sequelize.HasManyHasAssociationsMixin<
    supportTicket,
    supportTicketId
  >;
  countSupportTickets!: Sequelize.HasManyCountAssociationsMixin;

  // user has many support ticket by agentId
  agentSupportTickets!: supportTicket[];
  getAgentSupportTickets!: Sequelize.HasManyGetAssociationsMixin<supportTicket>;
  setAgentSupportTickets!: Sequelize.HasManySetAssociationsMixin<
    supportTicket,
    supportTicketId
  >;
  addAgentSupportTicket!: Sequelize.HasManyAddAssociationMixin<
    supportTicket,
    supportTicketId
  >;
  addAgentSupportTickets!: Sequelize.HasManyAddAssociationsMixin<
    supportTicket,
    supportTicketId
  >;
  createAgentSupportTicket!: Sequelize.HasManyCreateAssociationMixin<supportTicket>;
  removeAgentSupportTicket!: Sequelize.HasManyRemoveAssociationMixin<
    supportTicket,
    supportTicketId
  >;
  removeAgentSupportTickets!: Sequelize.HasManyRemoveAssociationsMixin<
    supportTicket,
    supportTicketId
  >;
  hasAgentSupportTicket!: Sequelize.HasManyHasAssociationMixin<
    supportTicket,
    supportTicketId
  >;
  hasAgentSupportTickets!: Sequelize.HasManyHasAssociationsMixin<
    supportTicket,
    supportTicketId
  >;
  countAgentSupportTickets!: Sequelize.HasManyCountAssociationsMixin;

  // user hasMany transaction via userId
  transactions!: transaction[];
  getTransactions!: Sequelize.HasManyGetAssociationsMixin<transaction>;
  setTransactions!: Sequelize.HasManySetAssociationsMixin<
    transaction,
    transactionId
  >;
  addTransaction!: Sequelize.HasManyAddAssociationMixin<
    transaction,
    transactionId
  >;
  addTransactions!: Sequelize.HasManyAddAssociationsMixin<
    transaction,
    transactionId
  >;
  createTransaction!: Sequelize.HasManyCreateAssociationMixin<transaction>;
  removeTransaction!: Sequelize.HasManyRemoveAssociationMixin<
    transaction,
    transactionId
  >;
  removeTransactions!: Sequelize.HasManyRemoveAssociationsMixin<
    transaction,
    transactionId
  >;
  hasTransaction!: Sequelize.HasManyHasAssociationMixin<
    transaction,
    transactionId
  >;
  hasTransactions!: Sequelize.HasManyHasAssociationsMixin<
    transaction,
    transactionId
  >;
  countTransactions!: Sequelize.HasManyCountAssociationsMixin;
  // user hasOne twoFactor via userId
  twoFactor!: twoFactor;
  getTwofactor!: Sequelize.HasOneGetAssociationMixin<twoFactor>;
  setTwofactor!: Sequelize.HasOneSetAssociationMixin<twoFactor, twoFactorId>;
  createTwofactor!: Sequelize.HasOneCreateAssociationMixin<twoFactor>;
  // user hasMany wallet via userId
  wallets!: wallet[];
  getWallets!: Sequelize.HasManyGetAssociationsMixin<wallet>;
  setWallets!: Sequelize.HasManySetAssociationsMixin<wallet, walletId>;
  addWallet!: Sequelize.HasManyAddAssociationMixin<wallet, walletId>;
  addWallets!: Sequelize.HasManyAddAssociationsMixin<wallet, walletId>;
  createWallet!: Sequelize.HasManyCreateAssociationMixin<wallet>;
  removeWallet!: Sequelize.HasManyRemoveAssociationMixin<wallet, walletId>;
  removeWallets!: Sequelize.HasManyRemoveAssociationsMixin<wallet, walletId>;
  hasWallet!: Sequelize.HasManyHasAssociationMixin<wallet, walletId>;
  hasWallets!: Sequelize.HasManyHasAssociationsMixin<wallet, walletId>;
  countWallets!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof user {
    return user.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: true,
          unique: "email",
          validate: {
            isEmail: { msg: "email: Must be a valid email address" },
          },
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull: true,
          validate: {
            len: {
              args: [8, 255],
              msg: "password: Password must be between 8 and 255 characters long",
            },
          },
        },
        avatar: {
          type: DataTypes.STRING(1000),
          allowNull: true,
          validate: {
            is: {
              args: ["^/(uploads|img)/.*$", "i"],
              msg: "avatar: Must be a valid URL",
            },
          },
        },
        firstName: {
          type: DataTypes.STRING(255),
          allowNull: true,
          validate: {
            is: {
              args: [/^[\p{L}]+$/u],
              msg: "firstName: First name must only contain letters",
            },
          },
        },
        lastName: {
          type: DataTypes.STRING(255),
          allowNull: true,
          validate: {
            is: {
              args: [/^[\p{L}]+$/u],
              msg: "lastName: Last name must only contain letters",
            },
          },
        },

        emailVerified: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        phone: {
          type: DataTypes.STRING(255),
          allowNull: true,
          validate: {
            is: {
              args: ["^[0-9]+$", "i"],
              msg: "phone: Phone number must contain only digits",
            },
          },
        },
        roleId: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        profile: {
          type: DataTypes.JSON,
          allowNull: true,
          get() {
            const rawData = this.getDataValue("profile");
            // Parse the JSON string back into an object
            return rawData ? JSON.parse(rawData) : null;
          },
          set(value) {
            // Convert the JavaScript object into a JSON string before saving
            this.setDataValue("profile", JSON.stringify(value));
          },
        },
        lastLogin: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        lastFailedLogin: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        failedLoginAttempts: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        status: {
          type: DataTypes.ENUM("ACTIVE", "INACTIVE", "SUSPENDED", "BANNED"),
          allowNull: true,
          defaultValue: "ACTIVE",
        },
      },
      {
        sequelize,
        tableName: "user",
        timestamps: true,
        paranoid: true,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "id",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "email",
            unique: true,
            using: "BTREE",
            fields: [{ name: "email" }],
          },
          {
            name: "UserRoleIdFkey",
            using: "BTREE",
            fields: [{ name: "roleId" }],
          },
        ],
      }
    );
  }
}
