import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { user, userId } from "./user";

export interface exchangeOrderAttributes {
  id: string;

  referenceId?: string;
  userId: string;
  status: "OPEN" | "CLOSED" | "CANCELED" | "EXPIRED" | "REJECTED";
  symbol: string;
  type: "MARKET" | "LIMIT";
  timeInForce: "GTC" | "IOC" | "FOK" | "PO";
  side: "BUY" | "SELL";
  price: number;
  average?: number;
  amount: number;
  filled: number;
  remaining: number;
  cost: number;
  trades?: string;
  fee: number;
  feeCurrency: string;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

export type exchangeOrderPk = "id";
export type exchangeOrderId = exchangeOrder[exchangeOrderPk];
export type exchangeOrderOptionalAttributes =
  | "id"
  | "referenceId"
  | "average"
  | "trades"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
export type exchangeOrderCreationAttributes = Optional<
  exchangeOrderAttributes,
  exchangeOrderOptionalAttributes
>;

export class exchangeOrder
  extends Model<exchangeOrderAttributes, exchangeOrderCreationAttributes>
  implements exchangeOrderAttributes
{
  id!: string;
  referenceId?: string;
  userId!: string;
  status!: "OPEN" | "CLOSED" | "CANCELED" | "EXPIRED" | "REJECTED";
  symbol!: string;
  type!: "MARKET" | "LIMIT";
  timeInForce!: "GTC" | "IOC" | "FOK" | "PO";
  side!: "BUY" | "SELL";
  price!: number;
  average?: number;
  amount!: number;
  filled!: number;
  remaining!: number;
  cost!: number;
  trades?: string;
  fee!: number;
  feeCurrency!: string;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // exchangeOrder belongsTo user via userId
  user!: user;
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof exchangeOrder {
    return exchangeOrder.init(
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
        referenceId: {
          type: DataTypes.STRING(191),
          allowNull: true,
          unique: "exchangeOrderReferenceIdKey",
        },
        status: {
          type: DataTypes.ENUM(
            "OPEN",
            "CLOSED",
            "CANCELED",
            "EXPIRED",
            "REJECTED"
          ),
          allowNull: false,
          validate: {
            isIn: {
              args: [["OPEN", "CLOSED", "CANCELED", "EXPIRED", "REJECTED"]],
              msg: "status: Must be one of OPEN, CLOSED, CANCELED, EXPIRED, REJECTED",
            },
          },
        },
        symbol: {
          type: DataTypes.STRING(191),
          allowNull: false,
          validate: {
            notEmpty: { msg: "symbol: Symbol must not be empty" },
          },
        },
        type: {
          type: DataTypes.ENUM("MARKET", "LIMIT"),
          allowNull: false,
          validate: {
            isIn: {
              args: [["MARKET", "LIMIT"]],
              msg: "type: Must be either MARKET or LIMIT",
            },
          },
        },
        timeInForce: {
          type: DataTypes.ENUM("GTC", "IOC", "FOK", "PO"),
          allowNull: false,
          validate: {
            isIn: {
              args: [["GTC", "IOC", "FOK", "PO"]],
              msg: "timeInForce: Must be one of GTC, IOC, FOK, PO",
            },
          },
        },
        side: {
          type: DataTypes.ENUM("BUY", "SELL"),
          allowNull: false,
          validate: {
            isIn: {
              args: [["BUY", "SELL"]],
              msg: "side: Must be either BUY or SELL",
            },
          },
        },
        price: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isNumeric: { msg: "price: Must be a numeric value" },
          },
        },
        average: {
          type: DataTypes.DOUBLE,
          allowNull: true,
        },
        amount: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isNumeric: { msg: "amount: Must be a numeric value" },
          },
        },
        filled: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isNumeric: { msg: "filled: Must be a numeric value" },
          },
        },
        remaining: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isNumeric: { msg: "remaining: Must be a numeric value" },
          },
        },
        cost: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isNumeric: { msg: "cost: Must be a numeric value" },
          },
        },
        trades: {
          type: DataTypes.JSON,
          allowNull: true,
          get() {
            const value = this.getDataValue("trades");
            return value ? JSON.parse(value) : null;
          },
        },
        fee: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isNumeric: { msg: "fee: Must be a numeric value" },
          },
        },
        feeCurrency: {
          type: DataTypes.STRING(191),
          allowNull: false,
          validate: {
            notEmpty: { msg: "feeCurrency: Fee currency must not be empty" },
          },
        },
      },
      {
        sequelize,
        tableName: "exchange_order",
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
            name: "exchangeOrderIdKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "exchangeOrderReferenceIdKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "referenceId" }],
          },
          {
            name: "exchangeOrderUserIdForeign",
            using: "BTREE",
            fields: [{ name: "userId" }],
          },
        ],
      }
    );
  }
}
