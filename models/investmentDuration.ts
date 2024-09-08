import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { investment, investmentId } from "./investment";
import type {
  investmentPlanDuration,
  investmentPlanDurationId,
} from "./investmentPlanDuration";

export interface investmentDurationAttributes {
  id: string;
  duration: number;
  timeframe: "HOUR" | "DAY" | "WEEK" | "MONTH";
}

export type investmentDurationPk = "id";
export type investmentDurationId = investmentDuration[investmentDurationPk];
export type investmentDurationOptionalAttributes = "id";
export type investmentDurationCreationAttributes = Optional<
  investmentDurationAttributes,
  investmentDurationOptionalAttributes
>;

export class investmentDuration
  extends Model<
    investmentDurationAttributes,
    investmentDurationCreationAttributes
  >
  implements investmentDurationAttributes
{
  id!: string;
  duration!: number;
  timeframe!: "HOUR" | "DAY" | "WEEK" | "MONTH";

  // investmentDuration hasMany investment via durationId
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
  // investmentDuration hasMany investmentPlanDuration via durationId
  planDurations!: investmentPlanDuration[];
  getPlanDurations!: Sequelize.HasManyGetAssociationsMixin<investmentPlanDuration>;
  setPlanDurations!: Sequelize.HasManySetAssociationsMixin<
    investmentPlanDuration,
    investmentPlanDurationId
  >;
  addPlanDuration!: Sequelize.HasManyAddAssociationMixin<
    investmentPlanDuration,
    investmentPlanDurationId
  >;
  addPlanDurations!: Sequelize.HasManyAddAssociationsMixin<
    investmentPlanDuration,
    investmentPlanDurationId
  >;
  createPlanDuration!: Sequelize.HasManyCreateAssociationMixin<investmentPlanDuration>;
  removePlanDuration!: Sequelize.HasManyRemoveAssociationMixin<
    investmentPlanDuration,
    investmentPlanDurationId
  >;
  removePlanDurations!: Sequelize.HasManyRemoveAssociationsMixin<
    investmentPlanDuration,
    investmentPlanDurationId
  >;
  hasPlanDuration!: Sequelize.HasManyHasAssociationMixin<
    investmentPlanDuration,
    investmentPlanDurationId
  >;
  hasPlanDurations!: Sequelize.HasManyHasAssociationsMixin<
    investmentPlanDuration,
    investmentPlanDurationId
  >;
  countPlanDurations!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof investmentDuration {
    return investmentDuration.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        duration: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            isInt: { msg: "duration: Duration must be an integer" },
          },
        },
        timeframe: {
          type: DataTypes.ENUM("HOUR", "DAY", "WEEK", "MONTH"),
          allowNull: false,
          validate: {
            isIn: {
              args: [["HOUR", "DAY", "WEEK", "MONTH"]],
              msg: "timeframe: Timeframe must be one of HOUR, DAY, WEEK, MONTH",
            },
          },
        },
      },
      {
        sequelize,
        tableName: "investment_duration",
        timestamps: false,
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
