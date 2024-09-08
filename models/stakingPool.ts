import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { stakingDuration, stakingDurationId } from "./stakingDuration";
import type { stakingLog, stakingLogId } from "./stakingLog";

export interface stakingPoolAttributes {
  id: string;
  name: string;
  description: string;
  currency: string;
  chain: string;
  type: "FIAT" | "SPOT" | "ECO";
  minStake: number;
  maxStake: number;
  status: "ACTIVE" | "INACTIVE" | "COMPLETED";
  icon?: string;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

export type stakingPoolPk = "id";
export type stakingPoolId = stakingPool[stakingPoolPk];
export type stakingPoolOptionalAttributes =
  | "id"
  | "type"
  | "status"
  | "icon"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
export type stakingPoolCreationAttributes = Optional<
  stakingPoolAttributes,
  stakingPoolOptionalAttributes
>;

export class stakingPool
  extends Model<stakingPoolAttributes, stakingPoolCreationAttributes>
  implements stakingPoolAttributes
{
  id!: string;
  name!: string;
  description!: string;
  currency!: string;
  chain!: string;
  type!: "FIAT" | "SPOT" | "ECO";
  minStake!: number;
  maxStake!: number;
  status!: "ACTIVE" | "INACTIVE" | "COMPLETED";
  icon?: string;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // stakingPool hasMany stakingDuration via poolId
  stakingDurations!: stakingDuration[];
  getStakingDurations!: Sequelize.HasManyGetAssociationsMixin<stakingDuration>;
  setStakingDurations!: Sequelize.HasManySetAssociationsMixin<
    stakingDuration,
    stakingDurationId
  >;
  addStakingDuration!: Sequelize.HasManyAddAssociationMixin<
    stakingDuration,
    stakingDurationId
  >;
  addStakingDurations!: Sequelize.HasManyAddAssociationsMixin<
    stakingDuration,
    stakingDurationId
  >;
  createStakingDuration!: Sequelize.HasManyCreateAssociationMixin<stakingDuration>;
  removeStakingDuration!: Sequelize.HasManyRemoveAssociationMixin<
    stakingDuration,
    stakingDurationId
  >;
  removeStakingDurations!: Sequelize.HasManyRemoveAssociationsMixin<
    stakingDuration,
    stakingDurationId
  >;
  hasStakingDuration!: Sequelize.HasManyHasAssociationMixin<
    stakingDuration,
    stakingDurationId
  >;
  hasStakingDurations!: Sequelize.HasManyHasAssociationsMixin<
    stakingDuration,
    stakingDurationId
  >;
  countStakingDurations!: Sequelize.HasManyCountAssociationsMixin;
  // stakingPool hasMany stakingLog via poolId
  stakingLogs!: stakingLog[];
  getStakingLogs!: Sequelize.HasManyGetAssociationsMixin<stakingLog>;
  setStakingLogs!: Sequelize.HasManySetAssociationsMixin<
    stakingLog,
    stakingLogId
  >;
  addStakingLog!: Sequelize.HasManyAddAssociationMixin<
    stakingLog,
    stakingLogId
  >;
  addStakingLogs!: Sequelize.HasManyAddAssociationsMixin<
    stakingLog,
    stakingLogId
  >;
  createStakingLog!: Sequelize.HasManyCreateAssociationMixin<stakingLog>;
  removeStakingLog!: Sequelize.HasManyRemoveAssociationMixin<
    stakingLog,
    stakingLogId
  >;
  removeStakingLogs!: Sequelize.HasManyRemoveAssociationsMixin<
    stakingLog,
    stakingLogId
  >;
  hasStakingLog!: Sequelize.HasManyHasAssociationMixin<
    stakingLog,
    stakingLogId
  >;
  hasStakingLogs!: Sequelize.HasManyHasAssociationsMixin<
    stakingLog,
    stakingLogId
  >;
  countStakingLogs!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof stakingPool {
    return stakingPool.init(
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
          validate: {
            notEmpty: { msg: "name: Name cannot be empty" },
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
        chain: {
          type: DataTypes.STRING(191),
          allowNull: true,
        },
        type: {
          type: DataTypes.ENUM("FIAT", "SPOT", "ECO"),
          allowNull: false,
          defaultValue: "SPOT",
          validate: {
            isIn: {
              args: [["FIAT", "SPOT", "ECO"]],
              msg: "type: Type must be one of ['FIAT', 'SPOT', 'ECO']",
            },
          },
        },
        minStake: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isFloat: { msg: "minStake: Minimum Stake must be a number" },
          },
        },
        maxStake: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isFloat: { msg: "maxStake: Maximum Stake must be a number" },
          },
        },
        status: {
          type: DataTypes.ENUM("ACTIVE", "INACTIVE", "COMPLETED"),
          allowNull: false,
          defaultValue: "ACTIVE",
          validate: {
            isIn: {
              args: [["ACTIVE", "INACTIVE", "COMPLETED"]],
              msg: "status: Status must be one of ['ACTIVE', 'INACTIVE', 'COMPLETED']",
            },
          },
        },
        icon: {
          type: DataTypes.STRING(1000),
          allowNull: true,
          validate: {
            is: {
              args: ["^/(uploads|img)/.*$", "i"],
              msg: "icon: icon must be a valid URL",
            },
          },
        },
      },
      {
        sequelize,
        tableName: "staking_pool",
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
            name: "stakingPoolIdKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
        ],
      }
    );
  }
}
