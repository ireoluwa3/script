import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { p2pTrade, p2pTradeId } from "./p2pTrade";

export interface p2pCommissionAttributes {
  id: string;
  tradeId: string;
  amount: number;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

export type p2pCommissionPk = "id";
export type p2pCommissionId = p2pCommission[p2pCommissionPk];
export type p2pCommissionOptionalAttributes =
  | "id"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
export type p2pCommissionCreationAttributes = Optional<
  p2pCommissionAttributes,
  p2pCommissionOptionalAttributes
>;

export class p2pCommission
  extends Model<p2pCommissionAttributes, p2pCommissionCreationAttributes>
  implements p2pCommissionAttributes
{
  id!: string;
  tradeId!: string;
  amount!: number;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // p2pCommission belongsTo p2pTrade via tradeId
  trade!: p2pTrade;
  getTrade!: Sequelize.BelongsToGetAssociationMixin<p2pTrade>;
  setTrade!: Sequelize.BelongsToSetAssociationMixin<p2pTrade, p2pTradeId>;
  createTrade!: Sequelize.BelongsToCreateAssociationMixin<p2pTrade>;

  static initModel(sequelize: Sequelize.Sequelize): typeof p2pCommission {
    return p2pCommission.init(
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
      },
      {
        sequelize,
        tableName: "p2p_commission",
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
            name: "p2pCommissionTradeIdKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "tradeId" }],
          },
        ],
      }
    );
  }
}
