import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type {
  investmentDuration,
  investmentDurationId,
} from "./investmentDuration";
import type { investmentPlan, investmentPlanId } from "./investmentPlan";

export interface investmentPlanDurationAttributes {
  id: string;
  planId: string;
  durationId: string;
}

export type investmentPlanDurationPk = "id";
export type investmentPlanDurationId =
  investmentPlanDuration[investmentPlanDurationPk];
export type investmentPlanDurationOptionalAttributes = "id";
export type investmentPlanDurationCreationAttributes = Optional<
  investmentPlanDurationAttributes,
  investmentPlanDurationOptionalAttributes
>;

export class investmentPlanDuration
  extends Model<
    investmentPlanDurationAttributes,
    investmentPlanDurationCreationAttributes
  >
  implements investmentPlanDurationAttributes
{
  id!: string;
  planId!: string;
  durationId!: string;

  // investmentPlanDuration belongsTo investmentDuration via durationId
  duration!: investmentDuration;
  getDuration!: Sequelize.BelongsToGetAssociationMixin<investmentDuration>;
  setDuration!: Sequelize.BelongsToSetAssociationMixin<
    investmentDuration,
    investmentDurationId
  >;
  createDuration!: Sequelize.BelongsToCreateAssociationMixin<investmentDuration>;
  // investmentPlanDuration belongsTo investmentPlan via planId
  plan!: investmentPlan;
  getPlan!: Sequelize.BelongsToGetAssociationMixin<investmentPlan>;
  setPlan!: Sequelize.BelongsToSetAssociationMixin<
    investmentPlan,
    investmentPlanId
  >;
  createPlan!: Sequelize.BelongsToCreateAssociationMixin<investmentPlan>;

  static initModel(
    sequelize: Sequelize.Sequelize
  ): typeof investmentPlanDuration {
    return investmentPlanDuration.init(
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
        },
        durationId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "investment_plan_duration",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "idxPlanId",
            using: "BTREE",
            fields: [{ name: "planId" }],
          },
          {
            name: "idxDurationId",
            using: "BTREE",
            fields: [{ name: "durationId" }],
          },
        ],
      }
    );
  }
}
