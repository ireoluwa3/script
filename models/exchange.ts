import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";

export interface exchangeAttributes {
  id: string;
  name: string;
  title: string;
  status?: boolean;
  username?: string;
  licenseStatus?: boolean;
  version?: string;
  productId?: string;
  type?: string;
}

export type exchangePk = "id";
export type exchangeId = exchange[exchangePk];
export type exchangeOptionalAttributes =
  | "id"
  | "status"
  | "username"
  | "licenseStatus"
  | "version"
  | "productId"
  | "type";
export type exchangeCreationAttributes = Optional<
  exchangeAttributes,
  exchangeOptionalAttributes
>;

export class exchange
  extends Model<exchangeAttributes, exchangeCreationAttributes>
  implements exchangeAttributes
{
  id!: string;
  name!: string;
  title!: string;
  status?: boolean;
  username?: string;
  licenseStatus?: boolean;
  version?: string;
  productId?: string;
  type?: string;

  static initModel(sequelize: Sequelize.Sequelize): typeof exchange {
    return exchange.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING(191),
          allowNull: false,
          validate: {
            notEmpty: { msg: "name: Name must not be empty" },
          },
        },
        title: {
          type: DataTypes.STRING(191),
          allowNull: false,
          validate: {
            notEmpty: { msg: "title: Title must not be empty" },
          },
        },
        status: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
          validate: {
            isBoolean: { msg: "status: Status must be a boolean value" },
          },
        },
        username: {
          type: DataTypes.STRING(191),
          allowNull: true,
          validate: {
            notEmpty: { msg: "username: Username must not be empty" },
          },
        },
        licenseStatus: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
          validate: {
            isBoolean: {
              msg: "licenseStatus: License Status must be a boolean value",
            },
          },
        },
        version: {
          type: DataTypes.STRING(191),
          allowNull: true,
          defaultValue: "0.0.1",
          validate: {
            notEmpty: { msg: "version: Version must not be empty" },
          },
        },
        productId: {
          type: DataTypes.STRING(191),
          allowNull: true,
          unique: "exchangeProductIdKey",
          validate: {
            notEmpty: { msg: "productId: Product ID must not be empty" },
          },
        },
        type: {
          type: DataTypes.STRING(191),
          allowNull: true,
          defaultValue: "spot",
          validate: {
            notEmpty: { msg: "type: Type must not be empty" },
          },
        },
      },
      {
        sequelize,
        tableName: "exchange",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "exchangeProductIdKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "productId" }],
          },
        ],
      }
    );
  }
}
