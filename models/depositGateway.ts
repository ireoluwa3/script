import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";

export interface depositGatewayAttributes {
  id: string;
  name: string;
  title: string;
  description: string;
  image?: string;
  alias?: string;
  currencies?: string[];
  fixedFee?: number;
  percentageFee?: number;
  minAmount?: number;
  maxAmount?: number;
  type: "FIAT" | "CRYPTO";
  status?: boolean;
  version?: string;
  productId?: string;
}

export type depositGatewayPk = "id";
export type depositGatewayId = depositGateway[depositGatewayPk];
export type depositGatewayOptionalAttributes =
  | "id"
  | "image"
  | "alias"
  | "currencies"
  | "fixedFee"
  | "percentageFee"
  | "minAmount"
  | "maxAmount"
  | "type"
  | "status"
  | "version"
  | "productId";
export type depositGatewayCreationAttributes = Optional<
  depositGatewayAttributes,
  depositGatewayOptionalAttributes
>;

export class depositGateway
  extends Model<depositGatewayAttributes, depositGatewayCreationAttributes>
  implements depositGatewayAttributes
{
  id!: string;
  name!: string;
  title!: string;
  description!: string;
  image?: string;
  alias?: string;
  currencies?: string[];
  fixedFee?: number;
  percentageFee?: number;
  minAmount?: number;
  maxAmount?: number;
  type!: "FIAT" | "CRYPTO";
  status?: boolean;
  version?: string;
  productId?: string;

  static initModel(sequelize: Sequelize.Sequelize): typeof depositGateway {
    return depositGateway.init(
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
          unique: "depositGatewayNameKey",
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
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
          validate: {
            notEmpty: { msg: "description: Description must not be empty" },
          },
        },
        image: {
          type: DataTypes.STRING(1000),
          allowNull: true,
          validate: {
            is: {
              args: ["^/(uploads|img)/.*$", "i"],
              msg: "image: Image must be a valid URL",
            },
          },
        },
        alias: {
          type: DataTypes.STRING(191),
          allowNull: true,
          unique: "depositGatewayAliasKey",
        },
        currencies: {
          type: DataTypes.JSON,
          allowNull: true,
          get() {
            const rawData = this.getDataValue("currencies");
            // Parse the JSON string back into an object
            return rawData ? JSON.parse(rawData as any) : null;
          },
        },
        fixedFee: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          defaultValue: 0,
          validate: {
            isFloat: { msg: "fixedFee: Fixed fee must be a valid number" },
            min: { args: [0], msg: "fixedFee: Fixed fee cannot be negative" },
          },
        },
        percentageFee: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          defaultValue: 0,
          validate: {
            isFloat: {
              msg: "percentageFee: Percentage fee must be a valid number",
            },
            min: {
              args: [0],
              msg: "percentageFee: Percentage fee cannot be negative",
            },
          },
        },
        minAmount: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          defaultValue: 0,
          validate: {
            isFloat: {
              msg: "minAmount: Minimum amount must be a valid number",
            },
            min: {
              args: [0],
              msg: "minAmount: Minimum amount cannot be negative",
            },
          },
        },
        maxAmount: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          validate: {
            isFloat: {
              msg: "maxAmount: Maximum amount must be a valid number",
            },
          },
        },
        type: {
          type: DataTypes.ENUM("FIAT", "CRYPTO"),
          allowNull: false,
          defaultValue: "FIAT",
          validate: {
            isIn: {
              args: [["FIAT", "CRYPTO"]],
              msg: "type: Must be either 'FIAT' or 'CRYPTO'",
            },
          },
        },
        status: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          validate: {
            isBoolean: { msg: "status: Status must be a boolean value" },
          },
        },
        version: {
          type: DataTypes.STRING(191),
          allowNull: true,
          defaultValue: "0.0.1",
        },
        productId: {
          type: DataTypes.UUID,
          allowNull: true,
          unique: "depositGatewayProductIdKey",
          validate: {
            isUUID: {
              args: 4,
              msg: "productId: Product ID must be a valid UUID",
            },
          },
        },
      },
      {
        sequelize,
        tableName: "deposit_gateway",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "depositGatewayNameKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "name" }],
          },
          {
            name: "depositGatewayAliasKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "alias" }],
          },
          {
            name: "depositGatewayProductIdKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "productId" }],
          },
        ],
      }
    );
  }
}
