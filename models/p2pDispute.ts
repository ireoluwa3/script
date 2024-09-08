import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { p2pTrade, p2pTradeId } from "./p2pTrade";
import type { user, userId } from "./user";

export interface p2pDisputeAttributes {
  id: string;
  tradeId: string;
  raisedById: string;
  reason: string;
  status: "PENDING" | "OPEN" | "RESOLVED" | "CANCELLED";
  resolution?: string;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

export type p2pDisputePk = "id";
export type p2pDisputeId = p2pDispute[p2pDisputePk];
export type p2pDisputeOptionalAttributes =
  | "id"
  | "status"
  | "resolution"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
export type p2pDisputeCreationAttributes = Optional<
  p2pDisputeAttributes,
  p2pDisputeOptionalAttributes
>;

export class p2pDispute
  extends Model<p2pDisputeAttributes, p2pDisputeCreationAttributes>
  implements p2pDisputeAttributes
{
  id!: string;
  tradeId!: string;
  raisedById!: string;
  reason!: string;
  status!: "PENDING" | "OPEN" | "RESOLVED" | "CANCELLED";
  resolution?: string;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // p2pDispute belongsTo p2pTrade via tradeId
  trade!: p2pTrade;
  getTrade!: Sequelize.BelongsToGetAssociationMixin<p2pTrade>;
  setTrade!: Sequelize.BelongsToSetAssociationMixin<p2pTrade, p2pTradeId>;
  createTrade!: Sequelize.BelongsToCreateAssociationMixin<p2pTrade>;
  // p2pDispute belongsTo user via raisedById
  raisedBy!: user;
  getRaisedBy!: Sequelize.BelongsToGetAssociationMixin<user>;
  setRaisedBy!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createRaisedBy!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof p2pDispute {
    return p2pDispute.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        tradeId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: { args: 4, msg: "tradeId: Trade ID must be a valid UUID" },
          },
        },
        raisedById: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: {
              args: 4,
              msg: "raisedById: Raised By ID must be a valid UUID",
            },
          },
        },
        reason: {
          type: DataTypes.TEXT,
          allowNull: false,
          validate: {
            notEmpty: { msg: "reason: Reason cannot be empty" },
          },
        },
        status: {
          type: DataTypes.ENUM("PENDING", "OPEN", "RESOLVED", "CANCELLED"),
          allowNull: false,
          validate: {
            isIn: {
              args: [["PENDING", "OPEN", "RESOLVED", "CANCELLED"]],
              msg: "status: Status must be one of PENDING, OPEN, RESOLVED, CANCELLED",
            },
          },
        },
        resolution: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "p2p_dispute",
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
            name: "p2pDisputeTradeIdFkey",
            using: "BTREE",
            fields: [{ name: "tradeId" }],
          },
          {
            name: "p2pDisputeRaisedByIdFkey",
            using: "BTREE",
            fields: [{ name: "raisedById" }],
          },
        ],
      }
    );
  }
}
