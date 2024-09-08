import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type {
  aiInvestmentDuration,
  aiInvestmentDurationId,
} from "./aiInvestmentDuration";
import type { aiInvestmentPlan, aiInvestmentPlanId } from "./aiInvestmentPlan";
import type { user, userId } from "./user";

export interface aiInvestmentAttributes {
  id: string;
  userId: string;
  planId: string;
  durationId?: string;
  symbol: string;
  type: "SPOT" | "ECO";
  amount: number;
  profit?: number;
  result?: "WIN" | "LOSS" | "DRAW";
  status: "ACTIVE" | "COMPLETED" | "CANCELLED" | "REJECTED";
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

export type aiInvestmentPk = "id";
export type aiInvestmentId = aiInvestment[aiInvestmentPk];
export type aiInvestmentOptionalAttributes =
  | "id"
  | "durationId"
  | "profit"
  | "result"
  | "status"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
export type aiInvestmentCreationAttributes = Optional<
  aiInvestmentAttributes,
  aiInvestmentOptionalAttributes
>;

export class aiInvestment
  extends Model<aiInvestmentAttributes, aiInvestmentCreationAttributes>
  implements aiInvestmentAttributes
{
  id!: string;
  userId!: string;
  planId!: string;
  durationId?: string;
  symbol!: string;
  type!: "SPOT" | "ECO";
  amount!: number;
  profit?: number;
  result?: "WIN" | "LOSS" | "DRAW";
  status!: "ACTIVE" | "COMPLETED" | "CANCELLED" | "REJECTED";
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // aiInvestment belongsTo aiInvestmentDuration via durationId
  duration!: aiInvestmentDuration;
  getDuration!: Sequelize.BelongsToGetAssociationMixin<aiInvestmentDuration>;
  setDuration!: Sequelize.BelongsToSetAssociationMixin<
    aiInvestmentDuration,
    aiInvestmentDurationId
  >;
  createDuration!: Sequelize.BelongsToCreateAssociationMixin<aiInvestmentDuration>;
  // aiInvestment belongsTo aiInvestmentPlan via planId
  plan!: aiInvestmentPlan;
  getPlan!: Sequelize.BelongsToGetAssociationMixin<aiInvestmentPlan>;
  setPlan!: Sequelize.BelongsToSetAssociationMixin<
    aiInvestmentPlan,
    aiInvestmentPlanId
  >;
  createPlan!: Sequelize.BelongsToCreateAssociationMixin<aiInvestmentPlan>;
  // aiInvestment belongsTo user via userId
  user!: user;
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof aiInvestment {
    return aiInvestment.init(
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
          },
        },
        planId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            notNull: { msg: "planId: Plan ID cannot be null" },
          },
        },
        durationId: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        symbol: {
          type: DataTypes.STRING(191),
          allowNull: false,
          validate: {
            notEmpty: { msg: "symbol: Market cannot be empty" },
          },
        },
        type: {
          type: DataTypes.ENUM("SPOT", "ECO"),
          allowNull: false,
          validate: {
            isIn: {
              args: [["SPOT", "ECO"]],
              msg: "type: Must be a valid wallet type",
            },
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
          allowNull: true,
          validate: {
            isNumeric: { msg: "profit: Profit must be a number" },
          },
        },
        result: {
          type: DataTypes.ENUM("WIN", "LOSS", "DRAW"),
          allowNull: true,
        },
        status: {
          type: DataTypes.ENUM("ACTIVE", "COMPLETED", "CANCELLED", "REJECTED"),
          allowNull: false,
          defaultValue: "ACTIVE",
          validate: {
            isIn: {
              args: [["ACTIVE", "COMPLETED", "CANCELLED", "REJECTED"]],
              msg: "status: Must be a valid status",
            },
          },
        },
      },
      {
        sequelize,
        tableName: "ai_investment",
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
            name: "aiInvestmentIdKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "aiInvestmentUserIdForeign",
            using: "BTREE",
            fields: [{ name: "userId" }],
          },
          {
            name: "aiInvestmentPlanIdForeign",
            using: "BTREE",
            fields: [{ name: "planId" }],
          },
          {
            name: "aiInvestmentDurationIdForeign",
            using: "BTREE",
            fields: [{ name: "durationId" }],
          },
        ],
      }
    );
  }
}
