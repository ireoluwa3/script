import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { stakingPool, stakingPoolId } from "./stakingPool";

export interface stakingDurationAttributes {
  id: string;
  poolId: string;
  duration: number;
  interestRate: number;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

export type stakingDurationPk = "id";
export type stakingDurationId = stakingDuration[stakingDurationPk];
export type stakingDurationOptionalAttributes =
  | "id"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
export type stakingDurationCreationAttributes = Optional<
  stakingDurationAttributes,
  stakingDurationOptionalAttributes
>;

export class stakingDuration
  extends Model<stakingDurationAttributes, stakingDurationCreationAttributes>
  implements stakingDurationAttributes
{
  id!: string;
  poolId!: string;
  duration!: number;
  interestRate!: number;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // stakingDuration belongsTo stakingPool via poolId
  pool!: stakingPool;
  getPool!: Sequelize.BelongsToGetAssociationMixin<stakingPool>;
  setPool!: Sequelize.BelongsToSetAssociationMixin<stakingPool, stakingPoolId>;
  createPool!: Sequelize.BelongsToCreateAssociationMixin<stakingPool>;

  static initModel(sequelize: Sequelize.Sequelize): typeof stakingDuration {
    return stakingDuration.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        poolId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: { args: 4, msg: "poolId: Pool ID must be a valid UUID" },
          },
        },
        duration: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            isInt: { msg: "duration: Duration must be an integer" },
          },
        },
        interestRate: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isFloat: { msg: "interestRate: Interest Rate must be a number" },
          },
        },
      },
      {
        sequelize,
        tableName: "staking_duration",
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
            name: "stakingDurationPoolIdFkey",
            using: "BTREE",
            fields: [{ name: "poolId" }],
          },
        ],
      }
    );
  }
}
