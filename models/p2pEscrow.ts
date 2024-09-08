import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { p2pTrade, p2pTradeId } from "./p2pTrade";

export interface p2pEscrowAttributes {
  id: string;
  tradeId: string;
  amount: number;
  status: "PENDING" | "HELD" | "RELEASED" | "CANCELLED";
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

export type p2pEscrowPk = "id";
export type p2pEscrowId = p2pEscrow[p2pEscrowPk];
export type p2pEscrowOptionalAttributes =
  | "id"
  | "status"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
export type p2pEscrowCreationAttributes = Optional<
  p2pEscrowAttributes,
  p2pEscrowOptionalAttributes
>;

export class p2pEscrow
  extends Model<p2pEscrowAttributes, p2pEscrowCreationAttributes>
  implements p2pEscrowAttributes
{
  id!: string;
  tradeId!: string;
  amount!: number;
  status!: "PENDING" | "HELD" | "RELEASED" | "CANCELLED";
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // p2pEscrow belongsTo p2pTrade via tradeId
  trade!: p2pTrade;
  getTrade!: Sequelize.BelongsToGetAssociationMixin<p2pTrade>;
  setTrade!: Sequelize.BelongsToSetAssociationMixin<p2pTrade, p2pTradeId>;
  createTrade!: Sequelize.BelongsToCreateAssociationMixin<p2pTrade>;

  static initModel(sequelize: Sequelize.Sequelize): typeof p2pEscrow {
    return p2pEscrow.init(
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
        amount: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isNumeric: { msg: "amount: Amount must be a numeric value" },
          },
        },
        status: {
          type: DataTypes.ENUM("PENDING", "HELD", "RELEASED", "CANCELLED"),
          allowNull: false,
          validate: {
            isIn: {
              args: [["PENDING", "HELD", "RELEASED", "CANCELLED"]],
              msg: "status: Status must be one of PENDING, HELD, RELEASED, CANCELLED",
            },
          },
        },
      },
      {
        sequelize,
        tableName: "p2p_escrow",
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
            name: "p2pEscrowTradeIdKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "tradeId" }],
          },
        ],
      }
    );
  }
}
