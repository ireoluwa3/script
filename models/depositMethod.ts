import { camelCase } from "lodash";
import { tag } from "./tag";
import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";

export interface depositMethodAttributes {
  id: string;
  title: string;
  instructions: string;
  image?: string;
  fixedFee: number;
  percentageFee: number;
  minAmount: number;
  maxAmount: number;
  customFields?: string;
  status?: boolean;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

export type depositMethodPk = "id";
export type depositMethodId = depositMethod[depositMethodPk];
export type depositMethodOptionalAttributes =
  | "id"
  | "image"
  | "fixedFee"
  | "percentageFee"
  | "minAmount"
  | "customFields"
  | "status"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
export type depositMethodCreationAttributes = Optional<
  depositMethodAttributes,
  depositMethodOptionalAttributes
>;

export class depositMethod
  extends Model<depositMethodAttributes, depositMethodCreationAttributes>
  implements depositMethodAttributes
{
  id!: string;
  title!: string;
  instructions!: string;
  image?: string;
  fixedFee!: number;
  percentageFee!: number;
  minAmount!: number;
  maxAmount!: number;
  customFields?: string;
  status?: boolean;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  static initModel(sequelize: Sequelize.Sequelize): typeof depositMethod {
    return depositMethod.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING(255),
          allowNull: false,
          validate: {
            notEmpty: { msg: "title: Title must not be empty" },
          },
        },
        instructions: {
          type: DataTypes.TEXT,
          allowNull: false,
          validate: {
            notEmpty: { msg: "instructions: Instructions must not be empty" },
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
        fixedFee: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          defaultValue: 0,
          validate: {
            isFloat: { msg: "fixedFee: Fixed fee must be a valid number" },
            min: { args: [0], msg: "fixedFee: Fixed fee cannot be negative" },
          },
        },
        percentageFee: {
          type: DataTypes.DOUBLE,
          allowNull: false,
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
          allowNull: false,
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
          allowNull: false,
          validate: {
            isFloat: {
              msg: "maxAmount: Maximum amount must be a valid number",
            },
          },
        },
        customFields: {
          type: DataTypes.JSON,
          allowNull: true,
          get() {
            const rawData = this.getDataValue("customFields");
            return rawData ? JSON.parse(rawData) : null;
          },
          set(fields: CustomField[]) {
            this.setDataValue(
              "customFields",
              JSON.stringify(
                fields
                  .filter((field) => field.title && field.title !== "")
                  .map((field) => ({
                    name: camelCase(field.title.trim()),
                    title: field.title.trim(),
                    type: field.type,
                    required: field.required,
                  }))
              )
            );
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
      },
      {
        sequelize,
        tableName: "deposit_method",
        timestamps: true,
        paranoid: true,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
        ],
      }
    );
  }
}
