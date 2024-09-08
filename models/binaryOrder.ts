import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { user, userId } from "./user";

export interface binaryOrderAttributes {
  id: string;

  userId: string;
  symbol: string;
  price: number;
  amount: number;
  profit: number;
  side: "RISE" | "FALL";
  type: "RISE_FALL";
  status: "PENDING" | "WIN" | "LOSS" | "DRAW" | "CANCELED";
  isDemo: boolean;
  closedAt: Date;
  closePrice?: number;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

export type binaryOrderPk = "id";
export type binaryOrderId = binaryOrder[binaryOrderPk];
export type binaryOrderOptionalAttributes =
  | "id"
  | "isDemo"
  | "closePrice"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
export type binaryOrderCreationAttributes = Optional<
  binaryOrderAttributes,
  binaryOrderOptionalAttributes
>;

export class binaryOrder
  extends Model<binaryOrderAttributes, binaryOrderCreationAttributes>
  implements binaryOrderAttributes
{
  id!: string;
  userId!: string;
  symbol!: string;
  price!: number;
  amount!: number;
  profit!: number;
  side!: "RISE" | "FALL";
  type!: "RISE_FALL";
  status!: "PENDING" | "WIN" | "LOSS" | "DRAW" | "CANCELED";
  isDemo!: boolean;
  closedAt!: Date;
  closePrice?: number;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // binaryOrder belongsTo user via userId
  user!: user;
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof binaryOrder {
    return binaryOrder.init(
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
        symbol: {
          type: DataTypes.STRING(191),
          allowNull: false,
          validate: {
            notEmpty: { msg: "symbol: Symbol must not be empty" },
          },
        },
        price: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isNumeric: { msg: "price: Price must be a number" },
          },
        },
        amount: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isNumeric: { msg: "amount: Amount must be a number" },
          },
        },
        profit: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isNumeric: { msg: "profit: Profit must be a number" },
          },
        },
        side: {
          type: DataTypes.ENUM("RISE", "FALL"),
          allowNull: false,
          validate: {
            isIn: {
              args: [["RISE", "FALL"]],
              msg: "side: Side must be either 'RISE' or 'FALL'",
            },
          },
        },
        type: {
          type: DataTypes.ENUM("RISE_FALL"),
          allowNull: false,
          validate: {
            isIn: {
              args: [["RISE_FALL"]],
              msg: "type: Type must be 'RISE_FALL'",
            },
          },
        },
        status: {
          type: DataTypes.ENUM("PENDING", "WIN", "LOSS", "DRAW", "CANCELED"),
          allowNull: false,
          validate: {
            isIn: {
              args: [["PENDING", "WIN", "LOSS", "DRAW", "CANCELED"]],
              msg: "status: Status must be one of 'PENDING', 'WIN', 'LOSS', 'DRAW','CANCELED'",
            },
          },
        },
        isDemo: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        closedAt: {
          type: DataTypes.DATE(3),
          allowNull: false,
          validate: {
            isDate: {
              msg: "closedAt: Must be a valid date",
              args: true,
            },
          },
        },
        closePrice: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          validate: {
            isNumeric: { msg: "closePrice: Close Price must be a number" },
          },
        },
      },
      {
        sequelize,
        tableName: "binary_order",
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
            name: "binaryOrderIdKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "binaryOrderUserIdForeign",
            using: "BTREE",
            fields: [{ name: "userId" }],
          },
        ],
      }
    );
  }
}
