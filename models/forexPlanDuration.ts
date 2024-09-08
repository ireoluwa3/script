import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { forexDuration, forexDurationId } from "./forexDuration";
import type { forexPlan, forexPlanId } from "./forexPlan";

export interface forexPlanDurationAttributes {
  id: string;
  planId: string;
  durationId: string;
}

export type forexPlanDurationPk = "id";
export type forexPlanDurationId = forexPlanDuration[forexPlanDurationPk];
export type forexPlanDurationOptionalAttributes = "id";
export type forexPlanDurationCreationAttributes = Optional<
  forexPlanDurationAttributes,
  forexPlanDurationOptionalAttributes
>;

export class forexPlanDuration
  extends Model<
    forexPlanDurationAttributes,
    forexPlanDurationCreationAttributes
  >
  implements forexPlanDurationAttributes
{
  id!: string;
  planId!: string;
  durationId!: string;

  // forexPlanDuration belongsTo forexDuration via durationId
  duration!: forexDuration;
  getDuration!: Sequelize.BelongsToGetAssociationMixin<forexDuration>;
  setDuration!: Sequelize.BelongsToSetAssociationMixin<
    forexDuration,
    forexDurationId
  >;
  createDuration!: Sequelize.BelongsToCreateAssociationMixin<forexDuration>;
  // forexPlanDuration belongsTo forexPlan via planId
  plan!: forexPlan;
  getPlan!: Sequelize.BelongsToGetAssociationMixin<forexPlan>;
  setPlan!: Sequelize.BelongsToSetAssociationMixin<forexPlan, forexPlanId>;
  createPlan!: Sequelize.BelongsToCreateAssociationMixin<forexPlan>;

  static initModel(sequelize: Sequelize.Sequelize): typeof forexPlanDuration {
    return forexPlanDuration.init(
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
        tableName: "forex_plan_duration",
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
