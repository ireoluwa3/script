import type { Sequelize } from "sequelize";
import { aiInvestment as AiTrading } from "./aiInvestment";
import type {
  aiInvestmentAttributes,
  aiInvestmentCreationAttributes,
} from "./aiInvestment";
import { aiInvestmentDuration as AiTradingDuration } from "./aiInvestmentDuration";
import type {
  aiInvestmentDurationAttributes,
  aiInvestmentDurationCreationAttributes,
} from "./aiInvestmentDuration";
import { aiInvestmentPlan as AiTradingPlan } from "./aiInvestmentPlan";
import type {
  aiInvestmentPlanAttributes,
  aiInvestmentPlanCreationAttributes,
} from "./aiInvestmentPlan";
import { aiInvestmentPlanDuration as AiTradingPlanDuration } from "./aiInvestmentPlanDuration";
import type {
  aiInvestmentPlanDurationAttributes,
  aiInvestmentPlanDurationCreationAttributes,
} from "./aiInvestmentPlanDuration";
import { announcement as Announcement } from "./announcement";
import type {
  announcementAttributes,
  announcementCreationAttributes,
} from "./announcement";
import { apiKey as ApiKey } from "./apiKey";
import type { apiKeyAttributes, apiKeyCreationAttributes } from "./apiKey";
import { author as Author } from "./author";
import type { authorAttributes, authorCreationAttributes } from "./author";
import { binaryOrder as BinaryOrder } from "./binaryOrder";
import type {
  binaryOrderAttributes,
  binaryOrderCreationAttributes,
} from "./binaryOrder";
import { category as Category } from "./category";
import type {
  categoryAttributes,
  categoryCreationAttributes,
} from "./category";
import { comment as Comment } from "./comment";
import type { commentAttributes, commentCreationAttributes } from "./comment";
import { currency as Currency } from "./currency";
import type {
  currencyAttributes,
  currencyCreationAttributes,
} from "./currency";
import { depositGateway as DepositGateway } from "./depositGateway";
import type {
  depositGatewayAttributes,
  depositGatewayCreationAttributes,
} from "./depositGateway";
import { depositMethod as DepositMethod } from "./depositMethod";
import type {
  depositMethodAttributes,
  depositMethodCreationAttributes,
} from "./depositMethod";
import { ecommerceCategory as EcommerceCategory } from "./ecommerceCategory";
import type {
  ecommerceCategoryAttributes,
  ecommerceCategoryCreationAttributes,
} from "./ecommerceCategory";
import { ecommerceDiscount as EcommerceDiscount } from "./ecommerceDiscount";
import type {
  ecommerceDiscountAttributes,
  ecommerceDiscountCreationAttributes,
} from "./ecommerceDiscount";
import { ecommerceOrder as EcommerceOrder } from "./ecommerceOrder";
import type {
  ecommerceOrderAttributes,
  ecommerceOrderCreationAttributes,
} from "./ecommerceOrder";
import { ecommerceOrderItem as EcommerceOrderItem } from "./ecommerceOrderItem";
import type {
  ecommerceOrderItemAttributes,
  ecommerceOrderItemCreationAttributes,
} from "./ecommerceOrderItem";
import { ecommerceShipping as EcommerceShipping } from "./ecommerceShipping";
import type {
  ecommerceShippingAttributes,
  ecommerceShippingCreationAttributes,
} from "./ecommerceShipping";
import { ecommerceShippingAddress as EcommerceShippingAddress } from "./ecommerceShippingAddress";
import type {
  ecommerceShippingAddressAttributes,
  ecommerceShippingAddressCreationAttributes,
} from "./ecommerceShippingAddress";
import { ecommerceProduct as EcommerceProduct } from "./ecommerceProduct";
import type {
  ecommerceProductAttributes,
  ecommerceProductCreationAttributes,
} from "./ecommerceProduct";
import { ecommerceReview as EcommerceReview } from "./ecommerceReview";
import type {
  ecommerceReviewAttributes,
  ecommerceReviewCreationAttributes,
} from "./ecommerceReview";
import { ecommerceUserDiscount as EcommerceUserDiscount } from "./ecommerceUserDiscount";
import type {
  ecommerceUserDiscountAttributes,
  ecommerceUserDiscountCreationAttributes,
} from "./ecommerceUserDiscount";
import { ecommerceWishlist as EcommerceWishlist } from "./ecommerceWishlist";
import type {
  ecommerceWishlistAttributes,
  ecommerceWishlistCreationAttributes,
} from "./ecommerceWishlist";
import { ecommerceWishlistItem as EcommerceWishlistItem } from "./ecommerceWishlistItem";
import type {
  ecommerceWishlistItemAttributes,
  ecommerceWishlistItemCreationAttributes,
} from "./ecommerceWishlistItem";

import { futuresMarket as FuturesMarket } from "./futuresMarket";
import type {
  futuresMarketAttributes,
  futuresMarketCreationAttributes,
} from "./futuresMarket";

import { ecosystemCustodialWallet as EcosystemCustodialWallet } from "./ecosystemCustodialWallet";
import type {
  ecosystemCustodialWalletAttributes,
  ecosystemCustodialWalletCreationAttributes,
} from "./ecosystemCustodialWallet";
import { ecosystemMarket as EcosystemMarket } from "./ecosystemMarket";
import type {
  ecosystemMarketAttributes,
  ecosystemMarketCreationAttributes,
} from "./ecosystemMarket";
import { ecosystemMasterWallet as EcosystemMasterWallet } from "./ecosystemMasterWallet";
import type {
  ecosystemMasterWalletAttributes,
  ecosystemMasterWalletCreationAttributes,
} from "./ecosystemMasterWallet";
import { ecosystemPrivateLedger as EcosystemPrivateLedger } from "./ecosystemPrivateLedger";
import type {
  ecosystemPrivateLedgerAttributes,
  ecosystemPrivateLedgerCreationAttributes,
} from "./ecosystemPrivateLedger";
import { ecosystemToken as EcosystemToken } from "./ecosystemToken";
import type {
  ecosystemTokenAttributes,
  ecosystemTokenCreationAttributes,
} from "./ecosystemToken";
import { ecosystemUtxo as EcosystemUtxo } from "./ecosystemUtxo";
import type {
  ecosystemUtxoAttributes,
  ecosystemUtxoCreationAttributes,
} from "./ecosystemUtxo";
import { exchange as Exchange } from "./exchange";
import type {
  exchangeAttributes,
  exchangeCreationAttributes,
} from "./exchange";
import { exchangeCurrency as ExchangeCurrency } from "./exchangeCurrency";
import type {
  exchangeCurrencyAttributes,
  exchangeCurrencyCreationAttributes,
} from "./exchangeCurrency";
import { exchangeMarket as ExchangeMarket } from "./exchangeMarket";
import type {
  exchangeMarketAttributes,
  exchangeMarketCreationAttributes,
} from "./exchangeMarket";
import { exchangeOrder as ExchangeOrders } from "./exchangeOrder";
import type {
  exchangeOrderAttributes,
  exchangeOrderCreationAttributes,
} from "./exchangeOrder";
import { exchangeWatchlist as ExchangeWatchlist } from "./exchangeWatchlist";
import type {
  exchangeWatchlistAttributes,
  exchangeWatchlistCreationAttributes,
} from "./exchangeWatchlist";
import { extension as Extension } from "./extension";
import type {
  extensionAttributes,
  extensionCreationAttributes,
} from "./extension";
import { faq as Faq } from "./faq";
import type { faqAttributes, faqCreationAttributes } from "./faq";
import { faqCategory as FaqCategory } from "./faqCategory";
import type {
  faqCategoryAttributes,
  faqCategoryCreationAttributes,
} from "./faqCategory";
import { forexAccount as ForexAccount } from "./forexAccount";
import type {
  forexAccountAttributes,
  forexAccountCreationAttributes,
} from "./forexAccount";
import { forexAccountSignal as ForexAccountSignal } from "./forexAccountSignal";
import type {
  forexAccountSignalAttributes,
  forexAccountSignalCreationAttributes,
} from "./forexAccountSignal";
import { forexDuration as ForexDuration } from "./forexDuration";
import type {
  forexDurationAttributes,
  forexDurationCreationAttributes,
} from "./forexDuration";
import { forexInvestment as ForexInvestment } from "./forexInvestment";
import type {
  forexInvestmentAttributes,
  forexInvestmentCreationAttributes,
} from "./forexInvestment";
import { forexPlan as ForexPlan } from "./forexPlan";
import type {
  forexPlanAttributes,
  forexPlanCreationAttributes,
} from "./forexPlan";
import { forexPlanDuration as ForexPlanDuration } from "./forexPlanDuration";
import type {
  forexPlanDurationAttributes,
  forexPlanDurationCreationAttributes,
} from "./forexPlanDuration";
import { forexSignal as ForexSignal } from "./forexSignal";
import type {
  forexSignalAttributes,
  forexSignalCreationAttributes,
} from "./forexSignal";
import { icoAllocation as IcoAllocation } from "./icoAllocation";
import type {
  icoAllocationAttributes,
  icoAllocationCreationAttributes,
} from "./icoAllocation";
import { icoContribution as IcoContribution } from "./icoContribution";
import type {
  icoContributionAttributes,
  icoContributionCreationAttributes,
} from "./icoContribution";
import { icoPhase as IcoPhase } from "./icoPhase";
import type {
  icoPhaseAttributes,
  icoPhaseCreationAttributes,
} from "./icoPhase";
import { icoPhaseAllocation as IcoPhaseAllocation } from "./icoPhaseAllocation";
import type {
  icoPhaseAllocationAttributes,
  icoPhaseAllocationCreationAttributes,
} from "./icoPhaseAllocation";
import { icoProject as IcoProject } from "./icoProject";
import type {
  icoProjectAttributes,
  icoProjectCreationAttributes,
} from "./icoProject";
import { icoToken as IcoToken } from "./icoToken";
import type {
  icoTokenAttributes,
  icoTokenCreationAttributes,
} from "./icoToken";
import { investment as Investment } from "./investment";
import type {
  investmentAttributes,
  investmentCreationAttributes,
} from "./investment";
import { investmentDuration as InvestmentDuration } from "./investmentDuration";
import type {
  investmentDurationAttributes,
  investmentDurationCreationAttributes,
} from "./investmentDuration";
import { investmentPlan as InvestmentPlan } from "./investmentPlan";
import type {
  investmentPlanAttributes,
  investmentPlanCreationAttributes,
} from "./investmentPlan";
import { investmentPlanDuration as InvestmentPlanDuration } from "./investmentPlanDuration";
import type {
  investmentPlanDurationAttributes,
  investmentPlanDurationCreationAttributes,
} from "./investmentPlanDuration";
import { invoice as Invoice } from "./invoice";
import type { invoiceAttributes, invoiceCreationAttributes } from "./invoice";
import { kyc as Kyc } from "./kyc";
import type { kycAttributes, kycCreationAttributes } from "./kyc";
import { kycTemplate as KycTemplate } from "./kycTemplate";
import type {
  kycTemplateAttributes,
  kycTemplateCreationAttributes,
} from "./kycTemplate";
import { mailwizardBlock as MailwizardBlock } from "./mailwizardBlock";
import type {
  mailwizardBlockAttributes,
  mailwizardBlockCreationAttributes,
} from "./mailwizardBlock";
import { mailwizardCampaign as MailwizardCampaign } from "./mailwizardCampaign";
import type {
  mailwizardCampaignAttributes,
  mailwizardCampaignCreationAttributes,
} from "./mailwizardCampaign";
import { mailwizardTemplate as MailwizardTemplate } from "./mailwizardTemplate";
import type {
  mailwizardTemplateAttributes,
  mailwizardTemplateCreationAttributes,
} from "./mailwizardTemplate";
import { mlmBinaryNode as MlmBinaryNode } from "./mlmBinaryNode";
import type {
  mlmBinaryNodeAttributes,
  mlmBinaryNodeCreationAttributes,
} from "./mlmBinaryNode";
import { mlmReferral as MlmReferral } from "./mlmReferral";
import type {
  mlmReferralAttributes,
  mlmReferralCreationAttributes,
} from "./mlmReferral";
import { mlmReferralCondition as MlmReferralCondition } from "./mlmReferralCondition";
import type {
  mlmReferralConditionAttributes,
  mlmReferralConditionCreationAttributes,
} from "./mlmReferralCondition";
import { mlmReferralReward as MlmReferralReward } from "./mlmReferralReward";
import type {
  mlmReferralRewardAttributes,
  mlmReferralRewardCreationAttributes,
} from "./mlmReferralReward";
import { mlmUnilevelNode as MlmUnilevelNode } from "./mlmUnilevelNode";
import type {
  mlmUnilevelNodeAttributes,
  mlmUnilevelNodeCreationAttributes,
} from "./mlmUnilevelNode";
import { notification as Notification } from "./notification";
import type {
  notificationAttributes,
  notificationCreationAttributes,
} from "./notification";
import { notificationTemplate as NotificationTemplates } from "./notificationTemplate";
import type {
  notificationTemplateAttributes,
  notificationTemplateCreationAttributes,
} from "./notificationTemplate";
import { oneTimeToken as Onetimetoken } from "./oneTimeToken";
import type {
  oneTimeTokenAttributes,
  oneTimeTokenCreationAttributes,
} from "./oneTimeToken";
import { p2pCommission as P2pCommission } from "./p2pCommission";
import type {
  p2pCommissionAttributes,
  p2pCommissionCreationAttributes,
} from "./p2pCommission";
import { p2pDispute as P2pDispute } from "./p2pDispute";
import type {
  p2pDisputeAttributes,
  p2pDisputeCreationAttributes,
} from "./p2pDispute";
import { p2pEscrow as P2pEscrow } from "./p2pEscrow";
import type {
  p2pEscrowAttributes,
  p2pEscrowCreationAttributes,
} from "./p2pEscrow";
import { p2pOffer as P2pOffer } from "./p2pOffer";
import type {
  p2pOfferAttributes,
  p2pOfferCreationAttributes,
} from "./p2pOffer";
import { p2pPaymentMethod as P2pPaymentMethod } from "./p2pPaymentMethod";
import type {
  p2pPaymentMethodAttributes,
  p2pPaymentMethodCreationAttributes,
} from "./p2pPaymentMethod";
import { p2pReview as P2pReview } from "./p2pReview";
import type {
  p2pReviewAttributes,
  p2pReviewCreationAttributes,
} from "./p2pReview";
import { p2pTrade as P2pTrade } from "./p2pTrade";
import type {
  p2pTradeAttributes,
  p2pTradeCreationAttributes,
} from "./p2pTrade";
import { page as Page } from "./page";
import type { pageAttributes, pageCreationAttributes } from "./page";
import { permission as Permission } from "./permission";
import type {
  permissionAttributes,
  permissionCreationAttributes,
} from "./permission";
import { post as Post } from "./post";
import type { postAttributes, postCreationAttributes } from "./post";
import { postTag as PostTag } from "./postTag";
import type { postTagAttributes, postTagCreationAttributes } from "./postTag";
import { providerUser as Provideruser } from "./providerUser";
import type {
  providerUserAttributes,
  providerUserCreationAttributes,
} from "./providerUser";
import { role as Role } from "./role";
import type { roleAttributes, roleCreationAttributes } from "./role";
import { rolePermission as Rolepermission } from "./rolePermission";
import type {
  rolePermissionAttributes,
  rolePermissionCreationAttributes,
} from "./rolePermission";
import { settings as Settings } from "./settings";
import type {
  settingsAttributes,
  settingsCreationAttributes,
} from "./settings";
import { slider as Slider } from "./slider";
import type { sliderAttributes, sliderCreationAttributes } from "./slider";
import { stakingDuration as StakingDuration } from "./stakingDuration";
import type {
  stakingDurationAttributes,
  stakingDurationCreationAttributes,
} from "./stakingDuration";
import { stakingLog as StakingLog } from "./stakingLog";
import type {
  stakingLogAttributes,
  stakingLogCreationAttributes,
} from "./stakingLog";
import { stakingPool as StakingPool } from "./stakingPool";
import type {
  stakingPoolAttributes,
  stakingPoolCreationAttributes,
} from "./stakingPool";
import { supportTicket as SupportTicket } from "./supportTicket";
import type {
  supportTicketAttributes,
  supportTicketCreationAttributes,
} from "./supportTicket";
import { tag as Tag } from "./tag";
import type { tagAttributes, tagCreationAttributes } from "./tag";
import { transaction as Transaction } from "./transaction";
import type {
  transactionAttributes,
  transactionCreationAttributes,
} from "./transaction";
import { twoFactor as Twofactor } from "./twoFactor";
import type {
  twoFactorAttributes,
  twoFactorCreationAttributes,
} from "./twoFactor";
import { user as User } from "./user";
import type { userAttributes, userCreationAttributes } from "./user";
import { wallet as Wallet } from "./wallet";
import type { walletAttributes, walletCreationAttributes } from "./wallet";
import { walletData as WalletData } from "./walletData";
import type {
  walletDataAttributes,
  walletDataCreationAttributes,
} from "./walletData";
import { walletPnl as WalletPnL } from "./walletPnl";
import type {
  walletPnlAttributes,
  walletPnlCreationAttributes,
} from "./walletPnl";
import { withdrawMethod as WithdrawMethod } from "./withdrawMethod";
import type {
  withdrawMethodAttributes,
  withdrawMethodCreationAttributes,
} from "./withdrawMethod";

export {
  AiTrading as aiInvestment,
  AiTradingDuration as aiInvestmentDuration,
  AiTradingPlan as aiInvestmentPlan,
  AiTradingPlanDuration as aiInvestmentPlanDuration,
  Announcement as announcement,
  ApiKey as apiKey,
  Author as author,
  BinaryOrder as binaryOrder,
  Category as category,
  Comment as comment,
  Currency as currency,
  DepositGateway as depositGateway,
  DepositMethod as depositMethod,
  EcommerceCategory as ecommerceCategory,
  EcommerceDiscount as ecommerceDiscount,
  EcommerceOrder as ecommerceOrder,
  EcommerceOrderItem as ecommerceOrderItem,
  EcommerceShipping as ecommerceShipping,
  EcommerceShippingAddress as ecommerceShippingAddress,
  EcommerceProduct as ecommerceProduct,
  EcommerceReview as ecommerceReview,
  EcommerceUserDiscount as ecommerceUserDiscount,
  EcommerceWishlist as ecommerceWishlist,
  EcommerceWishlistItem as ecommerceWishlistItem,
  FuturesMarket as futuresMarket,
  EcosystemCustodialWallet as ecosystemCustodialWallet,
  EcosystemMarket as ecosystemMarket,
  EcosystemMasterWallet as ecosystemMasterWallet,
  EcosystemPrivateLedger as ecosystemPrivateLedger,
  EcosystemToken as ecosystemToken,
  EcosystemUtxo as ecosystemUtxo,
  Exchange as exchange,
  ExchangeCurrency as exchangeCurrency,
  ExchangeMarket as exchangeMarket,
  ExchangeOrders as exchangeOrder,
  ExchangeWatchlist as exchangeWatchlist,
  Extension as extension,
  Faq as faq,
  FaqCategory as faqCategory,
  ForexAccount as forexAccount,
  ForexAccountSignal as forexAccountSignal,
  ForexDuration as forexDuration,
  ForexInvestment as forexInvestment,
  ForexPlan as forexPlan,
  ForexPlanDuration as forexPlanDuration,
  ForexSignal as forexSignal,
  IcoAllocation as icoAllocation,
  IcoContribution as icoContribution,
  IcoPhase as icoPhase,
  IcoPhaseAllocation as icoPhaseAllocation,
  IcoProject as icoProject,
  IcoToken as icoToken,
  Investment as investment,
  InvestmentDuration as investmentDuration,
  InvestmentPlan as investmentPlan,
  InvestmentPlanDuration as investmentPlanDuration,
  Invoice as invoice,
  Kyc as kyc,
  KycTemplate as kycTemplate,
  MailwizardBlock as mailwizardBlock,
  MailwizardCampaign as mailwizardCampaign,
  MailwizardTemplate as mailwizardTemplate,
  MlmBinaryNode as mlmBinaryNode,
  MlmReferral as mlmReferral,
  MlmReferralCondition as mlmReferralCondition,
  MlmReferralReward as mlmReferralReward,
  MlmUnilevelNode as mlmUnilevelNode,
  Notification as notification,
  NotificationTemplates as notificationTemplate,
  Onetimetoken as oneTimeToken,
  P2pCommission as p2pCommission,
  P2pDispute as p2pDispute,
  P2pEscrow as p2pEscrow,
  P2pOffer as p2pOffer,
  P2pPaymentMethod as p2pPaymentMethod,
  P2pReview as p2pReview,
  P2pTrade as p2pTrade,
  Page as page,
  Permission as permission,
  Post as post,
  PostTag as postTag,
  Provideruser as providerUser,
  Role as role,
  Rolepermission as rolePermission,
  Settings as settings,
  Slider as slider,
  StakingDuration as stakingDuration,
  StakingLog as stakingLog,
  StakingPool as stakingPool,
  SupportTicket as supportTicket,
  Tag as tag,
  Transaction as transaction,
  Twofactor as twoFactor,
  User as user,
  Wallet as wallet,
  WalletData as walletData,
  WalletPnL as walletPnl,
  WithdrawMethod as withdrawMethod,
};

export type {
  aiInvestmentAttributes,
  aiInvestmentCreationAttributes,
  aiInvestmentDurationAttributes,
  aiInvestmentDurationCreationAttributes,
  aiInvestmentPlanAttributes,
  aiInvestmentPlanCreationAttributes,
  aiInvestmentPlanDurationAttributes,
  aiInvestmentPlanDurationCreationAttributes,
  announcementAttributes,
  announcementCreationAttributes,
  apiKeyAttributes,
  apiKeyCreationAttributes,
  authorAttributes,
  authorCreationAttributes,
  binaryOrderAttributes,
  binaryOrderCreationAttributes,
  categoryAttributes,
  categoryCreationAttributes,
  commentAttributes,
  commentCreationAttributes,
  currencyAttributes,
  currencyCreationAttributes,
  depositGatewayAttributes,
  depositGatewayCreationAttributes,
  depositMethodAttributes,
  depositMethodCreationAttributes,
  ecommerceCategoryAttributes,
  ecommerceCategoryCreationAttributes,
  ecommerceDiscountAttributes,
  ecommerceDiscountCreationAttributes,
  ecommerceOrderAttributes,
  ecommerceOrderCreationAttributes,
  ecommerceOrderItemAttributes,
  ecommerceOrderItemCreationAttributes,
  ecommerceShippingAttributes,
  ecommerceShippingCreationAttributes,
  ecommerceShippingAddressAttributes,
  ecommerceShippingAddressCreationAttributes,
  ecommerceProductAttributes,
  ecommerceProductCreationAttributes,
  ecommerceReviewAttributes,
  ecommerceReviewCreationAttributes,
  ecommerceUserDiscountAttributes,
  ecommerceUserDiscountCreationAttributes,
  ecommerceWishlistAttributes,
  ecommerceWishlistCreationAttributes,
  ecommerceWishlistItemAttributes,
  ecommerceWishlistItemCreationAttributes,
  futuresMarketAttributes,
  futuresMarketCreationAttributes,
  ecosystemCustodialWalletAttributes,
  ecosystemCustodialWalletCreationAttributes,
  ecosystemMarketAttributes,
  ecosystemMarketCreationAttributes,
  ecosystemMasterWalletAttributes,
  ecosystemMasterWalletCreationAttributes,
  ecosystemPrivateLedgerAttributes,
  ecosystemPrivateLedgerCreationAttributes,
  ecosystemTokenAttributes,
  ecosystemTokenCreationAttributes,
  ecosystemUtxoAttributes,
  ecosystemUtxoCreationAttributes,
  exchangeAttributes,
  exchangeCreationAttributes,
  exchangeCurrencyAttributes,
  exchangeCurrencyCreationAttributes,
  exchangeMarketAttributes,
  exchangeMarketCreationAttributes,
  exchangeOrderAttributes,
  exchangeOrderCreationAttributes,
  exchangeWatchlistAttributes,
  exchangeWatchlistCreationAttributes,
  extensionAttributes,
  extensionCreationAttributes,
  faqAttributes,
  faqCreationAttributes,
  faqCategoryAttributes,
  faqCategoryCreationAttributes,
  forexAccountAttributes,
  forexAccountCreationAttributes,
  forexAccountSignalAttributes,
  forexAccountSignalCreationAttributes,
  forexDurationAttributes,
  forexDurationCreationAttributes,
  forexInvestmentAttributes,
  forexInvestmentCreationAttributes,
  forexPlanAttributes,
  forexPlanCreationAttributes,
  forexPlanDurationAttributes,
  forexPlanDurationCreationAttributes,
  forexSignalAttributes,
  forexSignalCreationAttributes,
  icoAllocationAttributes,
  icoAllocationCreationAttributes,
  icoContributionAttributes,
  icoContributionCreationAttributes,
  icoPhaseAttributes,
  icoPhaseCreationAttributes,
  icoPhaseAllocationAttributes,
  icoPhaseAllocationCreationAttributes,
  icoProjectAttributes,
  icoProjectCreationAttributes,
  icoTokenAttributes,
  icoTokenCreationAttributes,
  investmentAttributes,
  investmentCreationAttributes,
  investmentDurationAttributes,
  investmentDurationCreationAttributes,
  investmentPlanAttributes,
  investmentPlanCreationAttributes,
  investmentPlanDurationAttributes,
  investmentPlanDurationCreationAttributes,
  invoiceAttributes,
  invoiceCreationAttributes,
  kycAttributes,
  kycCreationAttributes,
  kycTemplateAttributes,
  kycTemplateCreationAttributes,
  mailwizardBlockAttributes,
  mailwizardBlockCreationAttributes,
  mailwizardCampaignAttributes,
  mailwizardCampaignCreationAttributes,
  mailwizardTemplateAttributes,
  mailwizardTemplateCreationAttributes,
  mlmBinaryNodeAttributes,
  mlmBinaryNodeCreationAttributes,
  mlmReferralAttributes,
  mlmReferralCreationAttributes,
  mlmReferralConditionAttributes,
  mlmReferralConditionCreationAttributes,
  mlmReferralRewardAttributes,
  mlmReferralRewardCreationAttributes,
  mlmUnilevelNodeAttributes,
  mlmUnilevelNodeCreationAttributes,
  notificationAttributes,
  notificationCreationAttributes,
  notificationTemplateAttributes,
  notificationTemplateCreationAttributes,
  oneTimeTokenAttributes,
  oneTimeTokenCreationAttributes,
  p2pCommissionAttributes,
  p2pCommissionCreationAttributes,
  p2pDisputeAttributes,
  p2pDisputeCreationAttributes,
  p2pEscrowAttributes,
  p2pEscrowCreationAttributes,
  p2pOfferAttributes,
  p2pOfferCreationAttributes,
  p2pPaymentMethodAttributes,
  p2pPaymentMethodCreationAttributes,
  p2pReviewAttributes,
  p2pReviewCreationAttributes,
  p2pTradeAttributes,
  p2pTradeCreationAttributes,
  pageAttributes,
  pageCreationAttributes,
  permissionAttributes,
  permissionCreationAttributes,
  postAttributes,
  postCreationAttributes,
  postTagAttributes,
  postTagCreationAttributes,
  providerUserAttributes,
  providerUserCreationAttributes,
  roleAttributes,
  roleCreationAttributes,
  rolePermissionAttributes,
  rolePermissionCreationAttributes,
  settingsAttributes,
  settingsCreationAttributes,
  sliderAttributes,
  sliderCreationAttributes,
  stakingDurationAttributes,
  stakingDurationCreationAttributes,
  stakingLogAttributes,
  stakingLogCreationAttributes,
  stakingPoolAttributes,
  stakingPoolCreationAttributes,
  supportTicketAttributes,
  supportTicketCreationAttributes,
  tagAttributes,
  tagCreationAttributes,
  transactionAttributes,
  transactionCreationAttributes,
  twoFactorAttributes,
  twoFactorCreationAttributes,
  userAttributes,
  userCreationAttributes,
  walletAttributes,
  walletCreationAttributes,
  walletDataAttributes,
  walletDataCreationAttributes,
  walletPnlAttributes,
  walletPnlCreationAttributes,
  withdrawMethodAttributes,
  withdrawMethodCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const aiInvestment = AiTrading.initModel(sequelize);
  const aiInvestmentDuration = AiTradingDuration.initModel(sequelize);
  const aiInvestmentPlan = AiTradingPlan.initModel(sequelize);
  const aiInvestmentPlanDuration = AiTradingPlanDuration.initModel(sequelize);
  const announcement = Announcement.initModel(sequelize);
  const apiKey = ApiKey.initModel(sequelize);
  const author = Author.initModel(sequelize);
  const binaryOrder = BinaryOrder.initModel(sequelize);
  const category = Category.initModel(sequelize);
  const comment = Comment.initModel(sequelize);
  const currency = Currency.initModel(sequelize);
  const depositGateway = DepositGateway.initModel(sequelize);
  const depositMethod = DepositMethod.initModel(sequelize);
  const ecommerceCategory = EcommerceCategory.initModel(sequelize);
  const ecommerceDiscount = EcommerceDiscount.initModel(sequelize);
  const ecommerceOrder = EcommerceOrder.initModel(sequelize);
  const ecommerceOrderItem = EcommerceOrderItem.initModel(sequelize);
  const ecommerceShipping = EcommerceShipping.initModel(sequelize);
  const ecommerceShippingAddress =
    EcommerceShippingAddress.initModel(sequelize);
  const ecommerceProduct = EcommerceProduct.initModel(sequelize);
  const ecommerceReview = EcommerceReview.initModel(sequelize);
  const ecommerceUserDiscount = EcommerceUserDiscount.initModel(sequelize);
  const ecommerceWishlist = EcommerceWishlist.initModel(sequelize);
  const ecommerceWishlistItem = EcommerceWishlistItem.initModel(sequelize);
  const futuresMarket = FuturesMarket.initModel(sequelize);
  const ecosystemCustodialWallet =
    EcosystemCustodialWallet.initModel(sequelize);
  const ecosystemMarket = EcosystemMarket.initModel(sequelize);
  const ecosystemMasterWallet = EcosystemMasterWallet.initModel(sequelize);
  const ecosystemPrivateLedger = EcosystemPrivateLedger.initModel(sequelize);
  const ecosystemToken = EcosystemToken.initModel(sequelize);
  const ecosystemUtxo = EcosystemUtxo.initModel(sequelize);
  const exchange = Exchange.initModel(sequelize);
  const exchangeCurrency = ExchangeCurrency.initModel(sequelize);
  const exchangeMarket = ExchangeMarket.initModel(sequelize);
  const exchangeOrder = ExchangeOrders.initModel(sequelize);
  const exchangeWatchlist = ExchangeWatchlist.initModel(sequelize);
  const extension = Extension.initModel(sequelize);
  const faq = Faq.initModel(sequelize);
  const faqCategory = FaqCategory.initModel(sequelize);
  const forexAccount = ForexAccount.initModel(sequelize);
  const forexAccountSignal = ForexAccountSignal.initModel(sequelize);
  const forexDuration = ForexDuration.initModel(sequelize);
  const forexInvestment = ForexInvestment.initModel(sequelize);
  const forexPlan = ForexPlan.initModel(sequelize);
  const forexPlanDuration = ForexPlanDuration.initModel(sequelize);
  const forexSignal = ForexSignal.initModel(sequelize);
  const icoAllocation = IcoAllocation.initModel(sequelize);
  const icoContribution = IcoContribution.initModel(sequelize);
  const icoPhase = IcoPhase.initModel(sequelize);
  const icoPhaseAllocation = IcoPhaseAllocation.initModel(sequelize);
  const icoProject = IcoProject.initModel(sequelize);
  const icoToken = IcoToken.initModel(sequelize);
  const investment = Investment.initModel(sequelize);
  const investmentDuration = InvestmentDuration.initModel(sequelize);
  const investmentPlan = InvestmentPlan.initModel(sequelize);
  const investmentPlanDuration = InvestmentPlanDuration.initModel(sequelize);
  const invoice = Invoice.initModel(sequelize);
  const kyc = Kyc.initModel(sequelize);
  const kycTemplate = KycTemplate.initModel(sequelize);
  const mailwizardBlock = MailwizardBlock.initModel(sequelize);
  const mailwizardCampaign = MailwizardCampaign.initModel(sequelize);
  const mailwizardTemplate = MailwizardTemplate.initModel(sequelize);
  const mlmBinaryNode = MlmBinaryNode.initModel(sequelize);
  const mlmReferral = MlmReferral.initModel(sequelize);
  const mlmReferralCondition = MlmReferralCondition.initModel(sequelize);
  const mlmReferralReward = MlmReferralReward.initModel(sequelize);
  const mlmUnilevelNode = MlmUnilevelNode.initModel(sequelize);
  const notification = Notification.initModel(sequelize);
  const notificationTemplate = NotificationTemplates.initModel(sequelize);
  const oneTimeToken = Onetimetoken.initModel(sequelize);
  const p2pCommission = P2pCommission.initModel(sequelize);
  const p2pDispute = P2pDispute.initModel(sequelize);
  const p2pEscrow = P2pEscrow.initModel(sequelize);
  const p2pOffer = P2pOffer.initModel(sequelize);
  const p2pPaymentMethod = P2pPaymentMethod.initModel(sequelize);
  const p2pReview = P2pReview.initModel(sequelize);
  const p2pTrade = P2pTrade.initModel(sequelize);
  const page = Page.initModel(sequelize);
  const permission = Permission.initModel(sequelize);
  const post = Post.initModel(sequelize);
  const postTag = PostTag.initModel(sequelize);
  const providerUser = Provideruser.initModel(sequelize);
  const role = Role.initModel(sequelize);
  const rolePermission = Rolepermission.initModel(sequelize);
  const settings = Settings.initModel(sequelize);
  const slider = Slider.initModel(sequelize);
  const stakingDuration = StakingDuration.initModel(sequelize);
  const stakingLog = StakingLog.initModel(sequelize);
  const stakingPool = StakingPool.initModel(sequelize);
  const supportTicket = SupportTicket.initModel(sequelize);
  const tag = Tag.initModel(sequelize);
  const transaction = Transaction.initModel(sequelize);
  const twoFactor = Twofactor.initModel(sequelize);
  const user = User.initModel(sequelize);
  const wallet = Wallet.initModel(sequelize);
  const walletData = WalletData.initModel(sequelize);
  const walletPnl = WalletPnL.initModel(sequelize);
  const withdrawMethod = WithdrawMethod.initModel(sequelize);

  // Role and Permission
  role.hasMany(rolePermission, {
    as: "rolePermissions",
    foreignKey: "roleId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  rolePermission.belongsTo(role, {
    as: "role",
    foreignKey: "roleId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  permission.hasMany(rolePermission, {
    as: "rolePermissions",
    foreignKey: "permissionId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  rolePermission.belongsTo(permission, {
    as: "permission",
    foreignKey: "permissionId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  role.belongsToMany(permission, {
    through: rolePermission,
    as: "permissions",
    foreignKey: "roleId",
    otherKey: "permissionId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  permission.belongsToMany(role, {
    through: rolePermission,
    as: "roles",
    foreignKey: "permissionId",
    otherKey: "roleId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // AI Investment
  aiInvestment.belongsTo(aiInvestmentPlan, {
    as: "plan",
    foreignKey: "planId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  aiInvestment.belongsTo(aiInvestmentDuration, {
    as: "duration",
    foreignKey: "durationId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  aiInvestmentDuration.hasMany(aiInvestment, {
    as: "investments",
    foreignKey: "durationId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  aiInvestmentPlanDuration.belongsTo(aiInvestmentDuration, {
    as: "duration",
    foreignKey: "durationId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  aiInvestmentDuration.hasMany(aiInvestmentPlanDuration, {
    as: "aiInvestmentPlanDurations",
    foreignKey: "durationId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  aiInvestmentPlan.hasMany(aiInvestment, {
    as: "investments",
    foreignKey: "planId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  aiInvestmentPlanDuration.belongsTo(aiInvestmentPlan, {
    as: "plan",
    foreignKey: "planId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  aiInvestmentPlan.hasMany(aiInvestmentPlanDuration, {
    as: "planDurations",
    foreignKey: "planId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  aiInvestmentPlan.belongsToMany(aiInvestmentDuration, {
    through: aiInvestmentPlanDuration,
    as: "durations",
    foreignKey: "planId",
    otherKey: "durationId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  aiInvestmentDuration.belongsToMany(aiInvestmentPlan, {
    through: aiInvestmentPlanDuration,
    as: "plans",
    foreignKey: "durationId",
    otherKey: "planId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // Ecommerce
  ecommerceProduct.belongsTo(ecommerceCategory, {
    as: "category",
    foreignKey: "categoryId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ecommerceCategory.hasMany(ecommerceProduct, {
    as: "ecommerceProducts",
    foreignKey: "categoryId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ecommerceProduct.hasMany(ecommerceDiscount, {
    as: "ecommerceDiscounts",
    foreignKey: "productId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ecommerceDiscount.belongsTo(ecommerceProduct, {
    as: "product",
    foreignKey: "productId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ecommerceDiscount.hasMany(ecommerceUserDiscount, {
    as: "ecommerceUserDiscounts",
    foreignKey: "discountId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ecommerceUserDiscount.belongsTo(ecommerceDiscount, {
    as: "discount",
    foreignKey: "discountId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ecommerceProduct.hasMany(ecommerceReview, {
    as: "ecommerceReviews",
    foreignKey: "productId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ecommerceReview.belongsTo(ecommerceProduct, {
    as: "product",
    foreignKey: "productId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ecommerceProduct.hasMany(ecommerceOrderItem, {
    as: "ecommerceOrderItems",
    foreignKey: "productId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ecommerceOrderItem.belongsTo(ecommerceProduct, {
    as: "product",
    foreignKey: "productId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ecommerceOrder.hasMany(ecommerceOrderItem, {
    as: "ecommerceOrderItems",
    foreignKey: "orderId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ecommerceOrderItem.belongsTo(ecommerceOrder, {
    as: "order",
    foreignKey: "orderId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ecommerceOrder.belongsToMany(ecommerceProduct, {
    as: "products",
    through: ecommerceOrderItem,
    foreignKey: "orderId",
    otherKey: "productId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ecommerceProduct.belongsToMany(ecommerceOrder, {
    as: "orders",
    through: ecommerceOrderItem,
    foreignKey: "productId",
    otherKey: "orderId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ecommerceShipping.hasMany(ecommerceOrder, {
    as: "ecommerceOrders",
    foreignKey: "shippingId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ecommerceOrder.belongsTo(ecommerceShipping, {
    as: "shipping",
    foreignKey: "shippingId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ecommerceShipping.belongsToMany(ecommerceProduct, {
    as: "products",
    through: ecommerceOrder,
    foreignKey: "shippingId",
    otherKey: "productId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ecommerceShippingAddress.belongsTo(ecommerceOrder, {
    as: "order",
    foreignKey: "orderId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ecommerceOrder.hasOne(ecommerceShippingAddress, {
    as: "shippingAddress",
    foreignKey: "orderId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ecommerceProduct.belongsToMany(ecommerceShipping, {
    as: "shippings",
    through: ecommerceOrder,
    foreignKey: "productId",
    otherKey: "shippingId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ecommerceWishlist.hasMany(ecommerceWishlistItem, {
    as: "wishlistItems",
    foreignKey: "wishlistId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ecommerceWishlistItem.belongsTo(ecommerceWishlist, {
    as: "wishlist",
    foreignKey: "wishlistId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ecommerceProduct.hasMany(ecommerceWishlistItem, {
    as: "wishlistItems",
    foreignKey: "productId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ecommerceWishlistItem.belongsTo(ecommerceProduct, {
    as: "product",
    foreignKey: "productId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ecommerceWishlist.belongsToMany(ecommerceProduct, {
    as: "products",
    through: ecommerceWishlistItem,
    foreignKey: "wishlistId",
    otherKey: "productId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ecommerceProduct.belongsToMany(ecommerceWishlist, {
    as: "wishlists",
    through: ecommerceWishlistItem,
    foreignKey: "productId",
    otherKey: "wishlistId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // Ecosystem
  ecosystemCustodialWallet.belongsTo(ecosystemMasterWallet, {
    as: "masterWallet",
    foreignKey: "masterWalletId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ecosystemMasterWallet.hasMany(ecosystemCustodialWallet, {
    as: "ecosystemCustodialWallets",
    foreignKey: "masterWalletId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ecosystemPrivateLedger.belongsTo(wallet, {
    as: "wallet",
    foreignKey: "walletId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  wallet.hasMany(ecosystemPrivateLedger, {
    as: "ecosystemPrivateLedgers",
    foreignKey: "walletId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ecosystemUtxo.belongsTo(wallet, {
    as: "wallet",
    foreignKey: "walletId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  wallet.hasMany(ecosystemUtxo, {
    as: "ecosystemUtxos",
    foreignKey: "walletId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // FAQ
  faq.belongsTo(faqCategory, {
    as: "faqCategory",
    foreignKey: "faqCategoryId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  faqCategory.hasMany(faq, {
    as: "faqs",
    foreignKey: "faqCategoryId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // Forex
  forexAccountSignal.belongsTo(forexAccount, {
    as: "forexAccount",
    foreignKey: "forexAccountId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  forexAccount.hasMany(forexAccountSignal, {
    as: "forexAccountSignals",
    foreignKey: "forexAccountId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  forexAccountSignal.belongsTo(forexSignal, {
    as: "forexSignal",
    foreignKey: "forexSignalId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  forexSignal.hasMany(forexAccountSignal, {
    as: "forexAccountSignals",
    foreignKey: "forexSignalId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  forexAccount.belongsToMany(forexSignal, {
    as: "accountSignals",
    through: forexAccountSignal,
    foreignKey: "forexAccountId",
    otherKey: "forexSignalId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  forexSignal.belongsToMany(forexAccount, {
    as: "signalAccounts",
    through: forexAccountSignal,
    foreignKey: "forexSignalId",
    otherKey: "forexAccountId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  forexInvestment.belongsTo(forexPlan, {
    as: "plan",
    foreignKey: "planId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  forexInvestment.belongsTo(forexDuration, {
    as: "duration",
    foreignKey: "durationId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  forexDuration.hasMany(forexInvestment, {
    as: "investments",
    foreignKey: "durationId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  forexPlanDuration.belongsTo(forexDuration, {
    as: "duration",
    foreignKey: "durationId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  forexDuration.hasMany(forexPlanDuration, {
    as: "forexPlanDurations",
    foreignKey: "durationId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  forexPlan.hasMany(forexInvestment, {
    as: "investments",
    foreignKey: "planId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  forexPlanDuration.belongsTo(forexPlan, {
    as: "plan",
    foreignKey: "planId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  forexPlan.hasMany(forexPlanDuration, {
    as: "planDurations",
    foreignKey: "planId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  forexPlan.belongsToMany(forexDuration, {
    through: forexPlanDuration,
    as: "durations",
    foreignKey: "planId",
    otherKey: "durationId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  forexDuration.belongsToMany(forexPlan, {
    through: forexPlanDuration,
    as: "plans",
    foreignKey: "durationId",
    otherKey: "planId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // ICO
  icoPhaseAllocation.belongsTo(icoAllocation, {
    as: "allocation",
    foreignKey: "allocationId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  icoAllocation.hasMany(icoPhaseAllocation, {
    as: "icoPhaseAllocations",
    foreignKey: "allocationId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  icoContribution.belongsTo(icoPhase, {
    as: "phase",
    foreignKey: "phaseId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  icoPhase.hasMany(icoContribution, {
    as: "icoContributions",
    foreignKey: "phaseId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  icoPhaseAllocation.belongsTo(icoPhase, {
    as: "phase",
    foreignKey: "phaseId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  icoPhase.hasMany(icoPhaseAllocation, {
    as: "icoPhaseAllocations",
    foreignKey: "phaseId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  icoToken.belongsTo(icoProject, {
    as: "project",
    foreignKey: "projectId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  icoProject.hasMany(icoToken, {
    as: "icoTokens",
    foreignKey: "projectId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  icoAllocation.belongsTo(icoToken, {
    as: "token",
    foreignKey: "tokenId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  icoToken.hasOne(icoAllocation, {
    as: "icoAllocation",
    foreignKey: "tokenId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  icoPhase.belongsTo(icoToken, {
    as: "token",
    foreignKey: "tokenId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  icoToken.hasMany(icoPhase, {
    as: "icoPhases",
    foreignKey: "tokenId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // Investment
  investment.belongsTo(investmentPlan, {
    as: "plan",
    foreignKey: "planId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  investment.belongsTo(investmentDuration, {
    as: "duration",
    foreignKey: "durationId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  investmentDuration.hasMany(investment, {
    as: "investments",
    foreignKey: "durationId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  investmentPlanDuration.belongsTo(investmentDuration, {
    as: "duration",
    foreignKey: "durationId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  investmentDuration.hasMany(investmentPlanDuration, {
    as: "investmentPlanDurations",
    foreignKey: "durationId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  investmentPlan.hasMany(investment, {
    as: "investments",
    foreignKey: "planId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  investmentPlanDuration.belongsTo(investmentPlan, {
    as: "plan",
    foreignKey: "planId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  investmentPlan.hasMany(investmentPlanDuration, {
    as: "planDurations",
    foreignKey: "planId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  investmentPlan.belongsToMany(investmentDuration, {
    through: investmentPlanDuration,
    as: "durations",
    foreignKey: "planId",
    otherKey: "durationId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  investmentDuration.belongsToMany(investmentPlan, {
    through: investmentPlanDuration,
    as: "plans",
    foreignKey: "durationId",
    otherKey: "planId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // KYC
  kyc.belongsTo(kycTemplate, {
    as: "template",
    foreignKey: "templateId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  kycTemplate.hasMany(kyc, {
    as: "kycs",
    foreignKey: "templateId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // Mailwizard
  mailwizardCampaign.belongsTo(mailwizardTemplate, {
    as: "template",
    foreignKey: "templateId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  mailwizardTemplate.hasMany(mailwizardCampaign, {
    as: "mailwizardCampaigns",
    foreignKey: "templateId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // MLM
  mlmBinaryNode.belongsTo(mlmBinaryNode, {
    as: "parent",
    foreignKey: "parentId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  mlmBinaryNode.hasMany(mlmBinaryNode, {
    as: "nodes",
    foreignKey: "parentId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  mlmBinaryNode.belongsTo(mlmBinaryNode, {
    as: "leftChild",
    foreignKey: "leftChildId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  mlmBinaryNode.hasMany(mlmBinaryNode, {
    as: "leftChildBinaryNodes",
    foreignKey: "leftChildId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  mlmBinaryNode.belongsTo(mlmBinaryNode, {
    as: "rightChild",
    foreignKey: "rightChildId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  mlmBinaryNode.hasMany(mlmBinaryNode, {
    as: "rightChildBinaryNodes",
    foreignKey: "rightChildId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  mlmBinaryNode.belongsTo(mlmReferral, {
    as: "referral",
    foreignKey: "referralId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  mlmReferral.hasOne(mlmBinaryNode, {
    as: "node",
    foreignKey: "referralId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  mlmUnilevelNode.belongsTo(mlmReferral, {
    as: "referral",
    foreignKey: "referralId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  mlmReferral.hasOne(mlmUnilevelNode, {
    as: "unilevelNode",
    foreignKey: "referralId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  mlmReferralReward.belongsTo(mlmReferralCondition, {
    as: "condition",
    foreignKey: "conditionId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  mlmReferralCondition.hasMany(mlmReferralReward, {
    as: "referralRewards",
    foreignKey: "conditionId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  mlmUnilevelNode.belongsTo(mlmUnilevelNode, {
    as: "parent",
    foreignKey: "parentId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  mlmUnilevelNode.hasMany(mlmUnilevelNode, {
    as: "unilevelNodes",
    foreignKey: "parentId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  mlmReferral.belongsTo(user, {
    as: "referrer",
    foreignKey: "referrerId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  mlmReferral.belongsTo(user, {
    as: "referred",
    foreignKey: "referredId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasOne(mlmReferral, {
    as: "referrer",
    foreignKey: "referrerId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasOne(mlmReferral, {
    as: "referred",
    foreignKey: "referredId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  mlmReferralReward.belongsTo(user, {
    as: "referrer",
    foreignKey: "referrerId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasMany(mlmReferralReward, {
    as: "referralRewards",
    foreignKey: "referrerId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // P2P
  p2pReview.belongsTo(p2pOffer, {
    as: "offer",
    foreignKey: "offerId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  p2pOffer.hasMany(p2pReview, {
    as: "p2pReviews",
    foreignKey: "offerId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  p2pTrade.belongsTo(p2pOffer, {
    as: "offer",
    foreignKey: "offerId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  p2pOffer.hasMany(p2pTrade, {
    as: "p2pTrades",
    foreignKey: "offerId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  p2pOffer.belongsTo(p2pPaymentMethod, {
    as: "paymentMethod",
    foreignKey: "paymentMethodId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  p2pPaymentMethod.hasMany(p2pOffer, {
    as: "p2pOffers",
    foreignKey: "paymentMethodId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  p2pCommission.belongsTo(p2pTrade, {
    as: "trade",
    foreignKey: "tradeId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  p2pTrade.hasOne(p2pCommission, {
    as: "p2pCommission",
    foreignKey: "tradeId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  p2pDispute.belongsTo(p2pTrade, {
    as: "trade",
    foreignKey: "tradeId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  p2pTrade.hasMany(p2pDispute, {
    as: "p2pDisputes",
    foreignKey: "tradeId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  p2pEscrow.belongsTo(p2pTrade, {
    as: "trade",
    foreignKey: "tradeId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  p2pTrade.hasOne(p2pEscrow, {
    as: "p2pEscrow",
    foreignKey: "tradeId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // Wallet
  wallet.hasMany(Transaction, {
    as: "transactions",
    foreignKey: "walletId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  transaction.belongsTo(wallet, {
    as: "wallet",
    foreignKey: "walletId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  walletData.belongsTo(wallet, {
    as: "wallet",
    foreignKey: "walletId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  wallet.hasMany(walletData, {
    as: "walletData",
    foreignKey: "walletId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  walletPnl.belongsTo(user, {
    as: "user",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasMany(walletPnl, {
    as: "walletPnls",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // Staking
  stakingLog.belongsTo(stakingPool, {
    as: "pool",
    foreignKey: "poolId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  stakingPool.hasMany(stakingLog, {
    as: "stakingLogs",
    foreignKey: "poolId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  stakingLog.belongsTo(stakingDuration, {
    as: "duration",
    foreignKey: "durationId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  stakingDuration.hasMany(stakingLog, {
    as: "stakingLogs",
    foreignKey: "durationId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  // staking duration belongs to pool
  stakingDuration.belongsTo(stakingPool, {
    as: "pool",
    foreignKey: "poolId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  stakingPool.hasMany(stakingDuration, {
    as: "stakingDurations",
    foreignKey: "poolId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  // User
  comment.belongsTo(user, {
    as: "user",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasMany(comment, {
    as: "comments",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  post.belongsTo(author, {
    as: "author",
    foreignKey: "authorId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  author.hasMany(post, {
    as: "posts",
    foreignKey: "authorId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  post.belongsTo(category, {
    as: "category",
    foreignKey: "categoryId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  category.hasMany(post, {
    as: "posts",
    foreignKey: "categoryId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  comment.belongsTo(post, {
    as: "post",
    foreignKey: "postId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  post.hasMany(comment, {
    as: "comments",
    foreignKey: "postId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  postTag.belongsTo(post, {
    as: "post",
    foreignKey: "postId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  post.hasMany(postTag, {
    as: "postTags",
    foreignKey: "postId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  postTag.belongsTo(tag, {
    as: "tag",
    foreignKey: "tagId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  tag.hasMany(postTag, {
    as: "postTags",
    foreignKey: "tagId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  post.belongsToMany(tag, {
    through: postTag,
    as: "tags",
    foreignKey: "postId",
    otherKey: "tagId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  tag.belongsToMany(post, {
    through: postTag,
    as: "posts",
    foreignKey: "tagId",
    otherKey: "postId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.belongsTo(role, {
    as: "role",
    foreignKey: "roleId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  role.hasMany(user, {
    as: "users",
    foreignKey: "roleId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  aiInvestment.belongsTo(user, {
    as: "user",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasMany(aiInvestment, {
    as: "aiInvestments",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  apiKey.belongsTo(user, {
    as: "user",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasMany(apiKey, {
    as: "apiKeys",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  author.belongsTo(user, {
    as: "user",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasOne(author, {
    as: "author",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  binaryOrder.belongsTo(user, {
    as: "user",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasMany(binaryOrder, {
    as: "binaryOrder",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ecommerceOrder.belongsTo(user, {
    as: "user",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasMany(ecommerceOrder, {
    as: "ecommerceOrders",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ecommerceShippingAddress.belongsTo(user, {
    as: "user",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasOne(ecommerceShippingAddress, {
    as: "ecommerceShippingAddress",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ecommerceReview.belongsTo(user, {
    as: "user",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasMany(ecommerceReview, {
    as: "ecommerceReviews",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ecommerceUserDiscount.belongsTo(user, {
    as: "user",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasMany(ecommerceUserDiscount, {
    as: "ecommerceUserDiscounts",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  ecommerceWishlist.belongsTo(user, {
    as: "user",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasMany(ecommerceWishlist, {
    as: "ecommerceWishlists",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  exchangeOrder.belongsTo(user, {
    as: "user",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasMany(exchangeOrder, {
    as: "exchangeOrder",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  exchangeWatchlist.belongsTo(user, {
    as: "user",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasMany(exchangeWatchlist, {
    as: "exchangeWatchlists",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  forexAccount.belongsTo(user, {
    as: "user",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasMany(forexAccount, {
    as: "forexAccounts",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  forexInvestment.belongsTo(user, {
    as: "user",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasMany(forexInvestment, {
    as: "forexInvestments",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  icoContribution.belongsTo(user, {
    as: "user",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasMany(icoContribution, {
    as: "icoContributions",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  investment.belongsTo(user, {
    as: "user",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasMany(investment, {
    as: "investments",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  invoice.belongsTo(user, {
    as: "sender",
    foreignKey: "senderId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasMany(invoice, {
    as: "invoices",
    foreignKey: "senderId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  invoice.belongsTo(user, {
    as: "receiver",
    foreignKey: "receiverId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasMany(invoice, {
    as: "receiverInvoices",
    foreignKey: "receiverId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  kyc.belongsTo(user, {
    as: "user",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasOne(kyc, {
    as: "kyc",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  notification.belongsTo(user, {
    as: "user",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasMany(notification, {
    as: "notifications",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  p2pDispute.belongsTo(user, {
    as: "raisedBy",
    foreignKey: "raisedById",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasMany(p2pDispute, {
    as: "p2pDisputes",
    foreignKey: "raisedById",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  p2pOffer.belongsTo(user, {
    as: "user",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasMany(p2pOffer, {
    as: "p2pOffers",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  p2pPaymentMethod.belongsTo(user, {
    as: "user",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasMany(p2pPaymentMethod, {
    as: "p2pPaymentMethods",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  p2pReview.belongsTo(user, {
    as: "reviewer",
    foreignKey: "reviewerId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasMany(p2pReview, {
    as: "p2pReviews",
    foreignKey: "reviewerId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  p2pReview.belongsTo(user, {
    as: "reviewed",
    foreignKey: "reviewedId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasMany(p2pReview, {
    as: "reviewedP2pReviews",
    foreignKey: "reviewedId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  p2pTrade.belongsTo(user, {
    as: "user",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasMany(p2pTrade, {
    as: "p2pTrades",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  p2pTrade.belongsTo(user, {
    as: "seller",
    foreignKey: "sellerId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasMany(p2pTrade, {
    as: "sellerP2pTrades",
    foreignKey: "sellerId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  providerUser.belongsTo(user, {
    as: "user",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasMany(providerUser, {
    as: "providerUsers",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  stakingLog.belongsTo(user, {
    as: "user",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasMany(stakingLog, {
    as: "stakingLogs",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  supportTicket.belongsTo(user, {
    as: "user",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasMany(supportTicket, {
    as: "supportTickets",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  supportTicket.belongsTo(user, {
    as: "agent",
    foreignKey: "agentId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasMany(supportTicket, {
    as: "agentSupportTickets",
    foreignKey: "agentId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  transaction.belongsTo(user, {
    as: "user",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasMany(transaction, {
    as: "transactions",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  twoFactor.belongsTo(user, {
    as: "user",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasOne(twoFactor, {
    as: "twoFactor",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  wallet.belongsTo(user, {
    as: "user",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  user.hasMany(wallet, {
    as: "wallets",
    foreignKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });

  return {
    aiInvestment: aiInvestment,
    aiInvestmentDuration: aiInvestmentDuration,
    aiInvestmentPlan: aiInvestmentPlan,
    aiInvestmentPlanDuration: aiInvestmentPlanDuration,
    announcement: announcement,
    apiKey: apiKey,
    author: author,
    binaryOrder: binaryOrder,
    category: category,
    comment: comment,
    currency: currency,
    depositGateway: depositGateway,
    depositMethod: depositMethod,
    ecommerceCategory: ecommerceCategory,
    ecommerceDiscount: ecommerceDiscount,
    ecommerceOrder: ecommerceOrder,
    ecommerceOrderItem: ecommerceOrderItem,
    ecommerceShipping: ecommerceShipping,
    ecommerceShippingAddress: ecommerceShippingAddress,
    ecommerceProduct: ecommerceProduct,
    ecommerceReview: ecommerceReview,
    ecommerceUserDiscount: ecommerceUserDiscount,
    ecommerceWishlist: ecommerceWishlist,
    ecommerceWishlistItem: ecommerceWishlistItem,
    futuresMarket: futuresMarket,
    ecosystemCustodialWallet: ecosystemCustodialWallet,
    ecosystemMarket: ecosystemMarket,
    ecosystemMasterWallet: ecosystemMasterWallet,
    ecosystemPrivateLedger: ecosystemPrivateLedger,
    ecosystemToken: ecosystemToken,
    ecosystemUtxo: ecosystemUtxo,
    exchange: exchange,
    exchangeCurrency: exchangeCurrency,
    exchangeMarket: exchangeMarket,
    exchangeOrder: exchangeOrder,
    exchangeWatchlist: exchangeWatchlist,
    extension: extension,
    faq: faq,
    faqCategory: faqCategory,
    forexAccount: forexAccount,
    forexAccountSignal: forexAccountSignal,
    forexDuration: forexDuration,
    forexInvestment: forexInvestment,
    forexPlan: forexPlan,
    forexPlanDuration: forexPlanDuration,
    forexSignal: forexSignal,
    icoAllocation: icoAllocation,
    icoContribution: icoContribution,
    icoPhase: icoPhase,
    icoPhaseAllocation: icoPhaseAllocation,
    icoProject: icoProject,
    icoToken: icoToken,
    investment: investment,
    investmentDuration: investmentDuration,
    investmentPlan: investmentPlan,
    investmentPlanDuration: investmentPlanDuration,
    invoice: invoice,
    kyc: kyc,
    kycTemplate: kycTemplate,
    mailwizardBlock: mailwizardBlock,
    mailwizardCampaign: mailwizardCampaign,
    mailwizardTemplate: mailwizardTemplate,
    mlmBinaryNode: mlmBinaryNode,
    mlmReferral: mlmReferral,
    mlmReferralCondition: mlmReferralCondition,
    mlmReferralReward: mlmReferralReward,
    mlmUnilevelNode: mlmUnilevelNode,
    notification: notification,
    notificationTemplate: notificationTemplate,
    oneTimeToken: oneTimeToken,
    p2pCommission: p2pCommission,
    p2pDispute: p2pDispute,
    p2pEscrow: p2pEscrow,
    p2pOffer: p2pOffer,
    p2pPaymentMethod: p2pPaymentMethod,
    p2pReview: p2pReview,
    p2pTrade: p2pTrade,
    page: page,
    permission: permission,
    post: post,
    postTag: postTag,
    providerUser: providerUser,
    role: role,
    rolePermission: rolePermission,
    settings: settings,
    slider: slider,
    stakingDuration: stakingDuration,
    stakingLog: stakingLog,
    stakingPool: stakingPool,
    supportTicket: supportTicket,
    tag: tag,
    transaction: transaction,
    twoFactor: twoFactor,
    user: user,
    wallet: wallet,
    walletData: walletData,
    walletPnl: walletPnl,
    withdrawMethod: withdrawMethod,
  };
}

export type Models = ReturnType<typeof initModels>;
