import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { invoice, invoiceId } from "./invoice";
import type { user, userId } from "./user";
import type { wallet, walletId } from "./wallet";

export interface transactionAttributes {
  id: string;
  userId: string;
  walletId: string;
  type:
    | "FAILED"
    | "DEPOSIT"
    | "WITHDRAW"
    | "OUTGOING_TRANSFER"
    | "INCOMING_TRANSFER"
    | "PAYMENT"
    | "REFUND"
    | "BINARY_ORDER"
    | "EXCHANGE_ORDER"
    | "INVESTMENT"
    | "INVESTMENT_ROI"
    | "AI_INVESTMENT"
    | "AI_INVESTMENT_ROI"
    | "INVOICE"
    | "FOREX_DEPOSIT"
    | "FOREX_WITHDRAW"
    | "FOREX_INVESTMENT"
    | "FOREX_INVESTMENT_ROI"
    | "ICO_CONTRIBUTION"
    | "REFERRAL_REWARD"
    | "STAKING"
    | "STAKING_REWARD"
    | "P2P_OFFER_TRANSFER"
    | "P2P_TRADE";
  status:
    | "PENDING"
    | "COMPLETED"
    | "FAILED"
    | "CANCELLED"
    | "EXPIRED"
    | "REJECTED"
    | "REFUNDED"
    | "TIMEOUT";
  amount: number;
  fee?: number;
  description?: string;
  metadata?: any;
  referenceId?: string | null;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

export type transactionPk = "id";
export type transactionId = transaction[transactionPk];
export type transactionOptionalAttributes =
  | "id"
  | "status"
  | "fee"
  | "description"
  | "metadata"
  | "referenceId"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
export type transactionCreationAttributes = Optional<
  transactionAttributes,
  transactionOptionalAttributes
>;

export class transaction
  extends Model<transactionAttributes, transactionCreationAttributes>
  implements transactionAttributes
{
  id!: string;
  userId!: string;
  walletId!: string;
  type!:
    | "FAILED"
    | "DEPOSIT"
    | "WITHDRAW"
    | "OUTGOING_TRANSFER"
    | "INCOMING_TRANSFER"
    | "PAYMENT"
    | "REFUND"
    | "BINARY_ORDER"
    | "EXCHANGE_ORDER"
    | "INVESTMENT"
    | "INVESTMENT_ROI"
    | "AI_INVESTMENT"
    | "AI_INVESTMENT_ROI"
    | "INVOICE"
    | "FOREX_DEPOSIT"
    | "FOREX_WITHDRAW"
    | "FOREX_INVESTMENT"
    | "FOREX_INVESTMENT_ROI"
    | "ICO_CONTRIBUTION"
    | "REFERRAL_REWARD"
    | "STAKING"
    | "STAKING_REWARD"
    | "P2P_OFFER_TRANSFER"
    | "P2P_TRADE";
  status!:
    | "PENDING"
    | "COMPLETED"
    | "FAILED"
    | "CANCELLED"
    | "EXPIRED"
    | "REJECTED"
    | "REFUNDED"
    | "TIMEOUT";
  amount!: number;
  fee?: number;
  description?: string;
  metadata?: any;
  referenceId?: string | null;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // transaction hasMany invoice via transactionId
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
  // transaction belongsTo user via userId
  user!: user;
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;
  // transaction belongsTo wallet via walletId
  wallet!: wallet;
  getWallet!: Sequelize.BelongsToGetAssociationMixin<wallet>;
  setWallet!: Sequelize.BelongsToSetAssociationMixin<wallet, walletId>;
  createWallet!: Sequelize.BelongsToCreateAssociationMixin<wallet>;

  static initModel(sequelize: Sequelize.Sequelize): typeof transaction {
    return transaction.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            notNull: { msg: "userId: User ID cannot be null" },
            isUUID: { args: 4, msg: "userId: User ID must be a valid UUID" },
          },
        },
        walletId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            notNull: { msg: "walletId: Wallet ID cannot be null" },
          },
        },
        type: {
          type: DataTypes.ENUM(
            "FAILED",
            "DEPOSIT",
            "WITHDRAW",
            "OUTGOING_TRANSFER",
            "INCOMING_TRANSFER",
            "PAYMENT",
            "REFUND",
            "BINARY_ORDER",
            "EXCHANGE_ORDER",
            "INVESTMENT",
            "INVESTMENT_ROI",
            "AI_INVESTMENT",
            "AI_INVESTMENT_ROI",
            "INVOICE",
            "FOREX_DEPOSIT",
            "FOREX_WITHDRAW",
            "FOREX_INVESTMENT",
            "FOREX_INVESTMENT_ROI",
            "ICO_CONTRIBUTION",
            "REFERRAL_REWARD",
            "STAKING",
            "STAKING_REWARD",
            "P2P_OFFER_TRANSFER",
            "P2P_TRADE"
          ),
          allowNull: false,
          validate: {
            isIn: {
              args: [
                [
                  "FAILED",
                  "DEPOSIT",
                  "WITHDRAW",
                  "OUTGOING_TRANSFER",
                  "INCOMING_TRANSFER",
                  "PAYMENT",
                  "REFUND",
                  "BINARY_ORDER",
                  "EXCHANGE_ORDER",
                  "INVESTMENT",
                  "INVESTMENT_ROI",
                  "AI_INVESTMENT",
                  "AI_INVESTMENT_ROI",
                  "INVOICE",
                  "FOREX_DEPOSIT",
                  "FOREX_WITHDRAW",
                  "FOREX_INVESTMENT",
                  "FOREX_INVESTMENT_ROI",
                  "ICO_CONTRIBUTION",
                  "REFERRAL_REWARD",
                  "STAKING",
                  "STAKING_REWARD",
                  "P2P_OFFER_TRANSFER",
                  "P2P_TRADE",
                ],
              ],
              msg: "type: Type must be one of ['FAILED', 'DEPOSIT', 'WITHDRAW', 'OUTGOING_TRANSFER', 'INCOMING_TRANSFER', 'PAYMENT', 'REFUND', 'BINARY_ORDER', 'EXCHANGE_ORDER', 'INVESTMENT', 'INVESTMENT_ROI', 'AI_INVESTMENT', 'AI_INVESTMENT_ROI', 'INVOICE', 'FOREX_DEPOSIT', 'FOREX_WITHDRAW', 'FOREX_INVESTMENT', 'FOREX_INVESTMENT_ROI', 'ICO_CONTRIBUTION', 'REFERRAL_REWARD', 'STAKING', 'STAKING_REWARD', 'P2P_OFFER_TRANSFER', 'P2P_TRADE']",
            },
          },
        },
        status: {
          type: DataTypes.ENUM(
            "PENDING",
            "COMPLETED",
            "FAILED",
            "CANCELLED",
            "EXPIRED",
            "REJECTED",
            "REFUNDED",
            "TIMEOUT"
          ),
          allowNull: false,
          defaultValue: "PENDING",
          validate: {
            isIn: {
              args: [
                [
                  "PENDING",
                  "COMPLETED",
                  "FAILED",
                  "CANCELLED",
                  "EXPIRED",
                  "REJECTED",
                  "REFUNDED",
                  "TIMEOUT",
                ],
              ],
              msg: "status: Status must be one of ['PENDING', 'COMPLETED', 'FAILED', 'CANCELLED', 'EXPIRED', 'REJECTED', 'REFUNDED', 'TIMEOUT']",
            },
          },
        },
        amount: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isFloat: { msg: "amount: Amount must be a number" },
          },
        },
        fee: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          defaultValue: 0,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        metadata: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        referenceId: {
          type: DataTypes.STRING(191),
          allowNull: true,
          unique: "transactionReferenceIdKey",
        },
      },
      {
        sequelize,
        tableName: "transaction",
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
            name: "transactionIdKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "transactionReferenceIdKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "referenceId" }],
          },
          {
            name: "transactionWalletIdForeign",
            using: "BTREE",
            fields: [{ name: "walletId" }],
          },
          {
            name: "transactionUserIdFkey",
            using: "BTREE",
            fields: [{ name: "userId" }],
          },
        ],
      }
    );
  }
}
