import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { forexInvestment, forexInvestmentId } from "./forexInvestment";
import type {
  forexPlanDuration,
  forexPlanDurationId,
} from "./forexPlanDuration";

export interface forexDurationAttributes {
  id: string;
  duration: number;
  timeframe: "HOUR" | "DAY" | "WEEK" | "MONTH";
}

export type forexDurationPk = "id";
export type forexDurationId = forexDuration[forexDurationPk];
export type forexDurationOptionalAttributes = "id";
export type forexDurationCreationAttributes = Optional<
  forexDurationAttributes,
  forexDurationOptionalAttributes
>;

export class forexDuration
  extends Model<forexDurationAttributes, forexDurationCreationAttributes>
  implements forexDurationAttributes
{
  id!: string;
  duration!: number;
  timeframe!: "HOUR" | "DAY" | "WEEK" | "MONTH";

  // forexDuration hasMany forexInvestment via durationId
  forexInvestments!: forexInvestment[];
  getForexInvestments!: Sequelize.HasManyGetAssociationsMixin<forexInvestment>;
  setForexInvestments!: Sequelize.HasManySetAssociationsMixin<
    forexInvestment,
    forexInvestmentId
  >;
  addForexInvestment!: Sequelize.HasManyAddAssociationMixin<
    forexInvestment,
    forexInvestmentId
  >;
  addForexInvestments!: Sequelize.HasManyAddAssociationsMixin<
    forexInvestment,
    forexInvestmentId
  >;
  createForexInvestment!: Sequelize.HasManyCreateAssociationMixin<forexInvestment>;
  removeForexInvestment!: Sequelize.HasManyRemoveAssociationMixin<
    forexInvestment,
    forexInvestmentId
  >;
  removeForexInvestments!: Sequelize.HasManyRemoveAssociationsMixin<
    forexInvestment,
    forexInvestmentId
  >;
  hasForexInvestment!: Sequelize.HasManyHasAssociationMixin<
    forexInvestment,
    forexInvestmentId
  >;
  hasForexInvestments!: Sequelize.HasManyHasAssociationsMixin<
    forexInvestment,
    forexInvestmentId
  >;
  countForexInvestments!: Sequelize.HasManyCountAssociationsMixin;
  // forexDuration hasMany forexPlanDuration via durationId
  forexPlanDurations!: forexPlanDuration[];
  getForexPlanDurations!: Sequelize.HasManyGetAssociationsMixin<forexPlanDuration>;
  setForexPlanDurations!: Sequelize.HasManySetAssociationsMixin<
    forexPlanDuration,
    forexPlanDurationId
  >;
  addForexPlanDuration!: Sequelize.HasManyAddAssociationMixin<
    forexPlanDuration,
    forexPlanDurationId
  >;
  addForexPlanDurations!: Sequelize.HasManyAddAssociationsMixin<
    forexPlanDuration,
    forexPlanDurationId
  >;
  createForexPlanDuration!: Sequelize.HasManyCreateAssociationMixin<forexPlanDuration>;
  removeForexPlanDuration!: Sequelize.HasManyRemoveAssociationMixin<
    forexPlanDuration,
    forexPlanDurationId
  >;
  removeForexPlanDurations!: Sequelize.HasManyRemoveAssociationsMixin<
    forexPlanDuration,
    forexPlanDurationId
  >;
  hasForexPlanDuration!: Sequelize.HasManyHasAssociationMixin<
    forexPlanDuration,
    forexPlanDurationId
  >;
  hasForexPlanDurations!: Sequelize.HasManyHasAssociationsMixin<
    forexPlanDuration,
    forexPlanDurationId
  >;
  countForexPlanDurations!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof forexDuration {
    return forexDuration.init(
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
        tableName: "forex_duration",
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
