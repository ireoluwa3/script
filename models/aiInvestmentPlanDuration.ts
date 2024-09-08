import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type {
  aiInvestmentDuration,
  aiInvestmentDurationId,
} from "./aiInvestmentDuration";
import type { aiInvestmentPlan, aiInvestmentPlanId } from "./aiInvestmentPlan";

export interface aiInvestmentPlanDurationAttributes {
  id: string;
  planId: string;
  durationId: string;
}

export type aiInvestmentPlanDurationPk = "id";
export type aiInvestmentPlanDurationId =
  aiInvestmentPlanDuration[aiInvestmentPlanDurationPk];
export type aiInvestmentPlanDurationOptionalAttributes = "id";
export type aiInvestmentPlanDurationCreationAttributes = Optional<
  aiInvestmentPlanDurationAttributes,
  aiInvestmentPlanDurationOptionalAttributes
>;

export class aiInvestmentPlanDuration
  extends Model<
    aiInvestmentPlanDurationAttributes,
    aiInvestmentPlanDurationCreationAttributes
  >
  implements aiInvestmentPlanDurationAttributes
{
  id!: string;
  planId!: string;
  durationId!: string;

  // aiInvestmentPlanDuration belongsTo aiInvestmentDuration via durationId
  duration!: aiInvestmentDuration;
  getDuration!: Sequelize.BelongsToGetAssociationMixin<aiInvestmentDuration>;
  setDuration!: Sequelize.BelongsToSetAssociationMixin<
    aiInvestmentDuration,
    aiInvestmentDurationId
  >;
  createDuration!: Sequelize.BelongsToCreateAssociationMixin<aiInvestmentDuration>;
  // aiInvestmentPlanDuration belongsTo aiInvestmentPlan via planId
  plan!: aiInvestmentPlan;
  getPlan!: Sequelize.BelongsToGetAssociationMixin<aiInvestmentPlan>;
  setPlan!: Sequelize.BelongsToSetAssociationMixin<
    aiInvestmentPlan,
    aiInvestmentPlanId
  >;
  createPlan!: Sequelize.BelongsToCreateAssociationMixin<aiInvestmentPlan>;

  static initModel(
    sequelize: Sequelize.Sequelize
  ): typeof aiInvestmentPlanDuration {
    return aiInvestmentPlanDuration.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        planId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            notNull: { msg: "planId: Plan ID cannot be null" },
            isUUID: { args: 4, msg: "planId: Plan ID must be a valid UUID" },
          },
        },
        durationId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            notNull: { msg: "durationId: Duration ID cannot be null" },
            isUUID: {
              args: 4,
              msg: "durationId: Duration ID must be a valid UUID",
            },
          },
        },
      },
      {
        sequelize,
        tableName: "ai_investment_plan_duration",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "aiInvestmentPlanDurationPlanIdForeign",
            using: "BTREE",
            fields: [{ name: "planId" }],
          },
          {
            name: "aiInvestmentPlanDurationDurationIdForeign",
            using: "BTREE",
            fields: [{ name: "durationId" }],
          },
        ],
      }
    );
  }
}
