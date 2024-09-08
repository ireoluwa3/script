import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type {
  p2pCommission,
  p2pCommissionCreationAttributes,
  p2pCommissionId,
} from "./p2pCommission";
import type { p2pDispute, p2pDisputeId } from "./p2pDispute";
import type {
  p2pEscrow,
  p2pEscrowCreationAttributes,
  p2pEscrowId,
} from "./p2pEscrow";
import type { p2pOffer, p2pOfferId } from "./p2pOffer";
import type { user, userId } from "./user";

export interface p2pTradeAttributes {
  id: string;
  userId: string;
  sellerId: string;
  offerId: string;
  amount: number;
  status:
    | "PENDING"
    | "PAID"
    | "DISPUTE_OPEN"
    | "ESCROW_REVIEW"
    | "CANCELLED"
    | "COMPLETED"
    | "REFUNDED";
  messages?: ChatMessage[];
  txHash?: string;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

export type p2pTradePk = "id";
export type p2pTradeId = p2pTrade[p2pTradePk];
export type p2pTradeOptionalAttributes =
  | "id"
  | "status"
  | "messages"
  | "txHash"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
export type p2pTradeCreationAttributes = Optional<
  p2pTradeAttributes,
  p2pTradeOptionalAttributes
>;

export class p2pTrade
  extends Model<p2pTradeAttributes, p2pTradeCreationAttributes>
  implements p2pTradeAttributes
{
  id!: string;
  userId!: string;
  sellerId!: string;
  offerId!: string;
  amount!: number;
  status!:
    | "PENDING"
    | "PAID"
    | "DISPUTE_OPEN"
    | "ESCROW_REVIEW"
    | "CANCELLED"
    | "COMPLETED"
    | "REFUNDED";
  messages?: ChatMessage[];
  txHash?: string;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // p2pTrade belongsTo p2pOffer via offerId
  offer!: p2pOffer;
  getOffer!: Sequelize.BelongsToGetAssociationMixin<p2pOffer>;
  setOffer!: Sequelize.BelongsToSetAssociationMixin<p2pOffer, p2pOfferId>;
  createOffer!: Sequelize.BelongsToCreateAssociationMixin<p2pOffer>;
  // p2pTrade hasOne p2pCommission via tradeId
  p2pCommission!: p2pCommission;
  getP2pCommission!: Sequelize.HasOneGetAssociationMixin<p2pCommission>;
  setP2pCommission!: Sequelize.HasOneSetAssociationMixin<
    p2pCommission,
    p2pCommissionId
  >;
  createP2pCommission!: Sequelize.HasOneCreateAssociationMixin<p2pCommission>;
  // p2pTrade hasMany p2pDispute via tradeId
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
  // p2pTrade hasOne p2pEscrow via tradeId
  p2pEscrow!: p2pEscrow;
  getP2pEscrow!: Sequelize.HasOneGetAssociationMixin<p2pEscrow>;
  setP2pEscrow!: Sequelize.HasOneSetAssociationMixin<p2pEscrow, p2pEscrowId>;
  createP2pEscrow!: Sequelize.HasOneCreateAssociationMixin<p2pEscrow>;
  // p2pTrade belongsTo user via userId
  user!: user;
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;
  // p2pTrade belongsTo user via sellerId
  seller!: user;
  getSeller!: Sequelize.BelongsToGetAssociationMixin<user>;
  setSeller!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createSeller!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof p2pTrade {
    return p2pTrade.init(
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
        sellerId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            notNull: { msg: "sellerId: User ID cannot be null" },
            isUUID: {
              args: 4,
              msg: "sellerId: Seller ID must be a valid UUID",
            },
          },
        },
        offerId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            notNull: { msg: "offerId: Offer ID cannot be null" },
          },
        },
        amount: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isNumeric: { msg: "amount: Amount must be a numeric value" },
          },
        },
        status: {
          type: DataTypes.ENUM(
            "PENDING",
            "PAID",
            "DISPUTE_OPEN",
            "ESCROW_REVIEW",
            "CANCELLED",
            "COMPLETED",
            "REFUNDED"
          ),
          allowNull: false,
          validate: {
            isIn: {
              args: [
                [
                  "PENDING",
                  "PAID",
                  "DISPUTE_OPEN",
                  "ESCROW_REVIEW",
                  "CANCELLED",
                  "COMPLETED",
                  "REFUNDED",
                ],
              ],
              msg: "status: Invalid status value",
            },
          },
        },
        messages: {
          type: DataTypes.JSON,
          allowNull: true,
          get() {
            const value = this.getDataValue("messages");
            return value ? JSON.parse(value as any) : null;
          },
        },
        txHash: {
          type: DataTypes.STRING(191),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "p2p_trade",
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
            name: "p2pTradeIdKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "p2pTradeUserIdFkey",
            using: "BTREE",
            fields: [{ name: "userId" }],
          },
          {
            name: "p2pTradeSellerIdFkey",
            using: "BTREE",
            fields: [{ name: "sellerId" }],
          },
          {
            name: "p2pTradeOfferIdFkey",
            using: "BTREE",
            fields: [{ name: "offerId" }],
          },
        ],
      }
    );
  }
}
