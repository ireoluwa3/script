import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { investment, investmentId } from "./investment";
import {
  investmentPlanDuration,
  investmentPlanDurationId,
} from "./investmentPlanDuration";

export interface investmentPlanAttributes {
  id: string;
  name: string;
  title: string;
  image?: string;
  description: string;
  currency: string;
  walletType: string;
  minAmount: number;
  maxAmount: number;
  profitPercentage: number;
  invested: number;
  minProfit: number;
  maxProfit: number;
  defaultProfit: number;
  defaultResult: "WIN" | "LOSS" | "DRAW";
  trending?: boolean;
  status?: boolean;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

export type investmentPlanPk = "id";
export type investmentPlanId = investmentPlan[investmentPlanPk];
export type investmentPlanOptionalAttributes =
  | "id"
  | "image"
  | "currency"
  | "status"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
export type investmentPlanCreationAttributes = Optional<
  investmentPlanAttributes,
  investmentPlanOptionalAttributes
>;

export class investmentPlan
  extends Model<investmentPlanAttributes, investmentPlanCreationAttributes>
  implements investmentPlanAttributes
{
  id!: string;
  name!: string;
  title!: string;
  image?: string;
  description!: string;
  currency!: string;
  walletType!: string;
  minAmount!: number;
  maxAmount!: number;
  profitPercentage!: number;
  invested!: number;
  minProfit!: number;
  maxProfit!: number;
  defaultProfit!: number;
  defaultResult!: "WIN" | "LOSS" | "DRAW";
  trending?: boolean;
  status!: boolean;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // investmentPlan hasMany investment via planId
  investments!: investment[];
  getInvestments!: Sequelize.HasManyGetAssociationsMixin<investment>;
  setInvestments!: Sequelize.HasManySetAssociationsMixin<
    investment,
    investmentId
  >;
  addInvestment!: Sequelize.HasManyAddAssociationMixin<
    investment,
    investmentId
  >;
  addInvestments!: Sequelize.HasManyAddAssociationsMixin<
    investment,
    investmentId
  >;
  createInvestment!: Sequelize.HasManyCreateAssociationMixin<investment>;
  removeInvestment!: Sequelize.HasManyRemoveAssociationMixin<
    investment,
    investmentId
  >;
  removeInvestments!: Sequelize.HasManyRemoveAssociationsMixin<
    investment,
    investmentId
  >;
  hasInvestment!: Sequelize.HasManyHasAssociationMixin<
    investment,
    investmentId
  >;
  hasInvestments!: Sequelize.HasManyHasAssociationsMixin<
    investment,
    investmentId
  >;
  countInvestments!: Sequelize.HasManyCountAssociationsMixin;

  durations!: investmentPlanDuration[];
  getDurations!: Sequelize.HasManyGetAssociationsMixin<investmentPlanDuration>;
  setDurations!: Sequelize.HasManySetAssociationsMixin<
    investmentPlanDuration,
    investmentPlanDurationId
  >;
  addDuration!: Sequelize.HasManyAddAssociationMixin<
    investmentPlanDuration,
    investmentPlanDurationId
  >;
  addDurations!: Sequelize.HasManyAddAssociationsMixin<
    investmentPlanDuration,
    investmentPlanDurationId
  >;
  createDuration!: Sequelize.HasManyCreateAssociationMixin<investmentPlanDuration>;
  removeDuration!: Sequelize.HasManyRemoveAssociationMixin<
    investmentPlanDuration,
    investmentPlanDurationId
  >;
  removeDurations!: Sequelize.HasManyRemoveAssociationsMixin<
    investmentPlanDuration,
    investmentPlanDurationId
  >;
  hasDuration!: Sequelize.HasManyHasAssociationMixin<
    investmentPlanDuration,
    investmentPlanDurationId
  >;
  hasDurations!: Sequelize.HasManyHasAssociationsMixin<
    investmentPlanDuration,
    investmentPlanDurationId
  >;
  countDurations!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof investmentPlan {
    return investmentPlan.init(
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
          unique: "investmentPlanNameKey",
          validate: {
            notEmpty: { msg: "name: Name cannot be empty" },
          },
        },
        title: {
          type: DataTypes.STRING(191),
          allowNull: false,
          validate: {
            notEmpty: { msg: "title: Title cannot be empty" },
          },
        },
        image: {
          type: DataTypes.STRING(191),
          allowNull: true,
          validate: {
            is: {
              args: ["^/(uploads|img)/.*$", "i"],
              msg: "image: image must be a valid URL",
            },
          },
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
          validate: {
            notEmpty: { msg: "description: Description cannot be empty" },
          },
        },
        currency: {
          type: DataTypes.STRING(191),
          allowNull: false,
          validate: {
            notEmpty: { msg: "currency: Currency cannot be empty" },
          },
        },
        walletType: {
          type: DataTypes.STRING(191),
          allowNull: false,
          validate: {
            notEmpty: { msg: "walletType: Wallet type cannot be empty" },
          },
        },
        minAmount: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isFloat: {
              msg: "minAmount: Minimum amount must be a valid number",
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
        invested: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          validate: {
            isInt: { msg: "invested: Invested value must be an integer" },
          },
        },
        profitPercentage: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          defaultValue: 0,
          validate: {
            isFloat: {
              msg: "profitPercentage: Profit percentage must be a number",
            },
          },
        },
        minProfit: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isFloat: { msg: "minProfit: Minimum profit must be a number" },
          },
        },
        maxProfit: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isFloat: { msg: "maxProfit: Maximum profit must be a number" },
          },
        },
        defaultProfit: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          validate: {
            isInt: { msg: "defaultProfit: Default profit must be an integer" },
          },
        },
        defaultResult: {
          type: DataTypes.ENUM("WIN", "LOSS", "DRAW"),
          allowNull: false,
          validate: {
            isIn: {
              args: [["WIN", "LOSS", "DRAW"]],
              msg: "defaultResult: Must be one of 'WIN', 'LOSS', 'DRAW'",
            },
          },
        },
        trending: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
          validate: {
            isBoolean: { msg: "trending: Trending must be a boolean value" },
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
        tableName: "investment_plan",
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
            name: "investmentPlanNameKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "name" }],
          },
        ],
      }
    );
  }
}
