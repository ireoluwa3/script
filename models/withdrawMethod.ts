import { camelCase } from "lodash";
import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";

export interface withdrawMethodAttributes {
  id: string;
  title: string;
  processingTime: string;
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

export type withdrawMethodPk = "id";
export type withdrawMethodId = withdrawMethod[withdrawMethodPk];
export type withdrawMethodOptionalAttributes =
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
export type withdrawMethodCreationAttributes = Optional<
  withdrawMethodAttributes,
  withdrawMethodOptionalAttributes
>;

export class withdrawMethod
  extends Model<withdrawMethodAttributes, withdrawMethodCreationAttributes>
  implements withdrawMethodAttributes
{
  id!: string;
  title!: string;
  processingTime!: string;
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

  static initModel(sequelize: Sequelize.Sequelize): typeof withdrawMethod {
    return withdrawMethod.init(
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
            notEmpty: { msg: "title: Title cannot be empty" },
          },
        },
        processingTime: {
          type: DataTypes.STRING(255),
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "processingTime: Processing time cannot be empty",
            },
          },
        },
        instructions: {
          type: DataTypes.TEXT,
          allowNull: false,
          validate: {
            notEmpty: { msg: "instructions: Instructions cannot be empty" },
          },
        },
        image: {
          type: DataTypes.STRING(1000),
          allowNull: true,
        },
        fixedFee: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          defaultValue: 0,
          validate: {
            isFloat: { msg: "fixedFee: Fixed fee must be a number" },
          },
        },
        percentageFee: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          defaultValue: 0,
          validate: {
            isFloat: { msg: "percentageFee: Percentage fee must be a number" },
          },
        },
        minAmount: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          defaultValue: 0,
          validate: {
            isFloat: { msg: "minAmount: Minimum amount must be a number" },
          },
        },
        maxAmount: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isFloat: { msg: "maxAmount: Maximum amount must be a number" },
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
        tableName: "withdraw_method",
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
