import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { stakingPool, stakingPoolId } from "./stakingPool";
import type { user, userId } from "./user";

export interface stakingLogAttributes {
  id: string;
  userId: string;
  poolId: string;
  durationId: string;
  amount: number;
  status: "ACTIVE" | "RELEASED" | "COLLECTED";
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

export type stakingLogPk = "id";
export type stakingLogId = stakingLog[stakingLogPk];
export type stakingLogOptionalAttributes =
  | "id"
  | "status"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
export type stakingLogCreationAttributes = Optional<
  stakingLogAttributes,
  stakingLogOptionalAttributes
>;

export class stakingLog
  extends Model<stakingLogAttributes, stakingLogCreationAttributes>
  implements stakingLogAttributes
{
  id!: string;
  userId!: string;
  poolId!: string;
  durationId!: string;
  amount!: number;
  status!: "ACTIVE" | "RELEASED" | "COLLECTED";
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // stakingLog belongsTo stakingPool via poolId
  pool!: stakingPool;
  getPool!: Sequelize.BelongsToGetAssociationMixin<stakingPool>;
  setPool!: Sequelize.BelongsToSetAssociationMixin<stakingPool, stakingPoolId>;
  createPool!: Sequelize.BelongsToCreateAssociationMixin<stakingPool>;
  // stakingLog belongsTo user via userId
  user!: user;
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof stakingLog {
    return stakingLog.init(
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
            isUUID: { args: 4, msg: "userId: User ID must be a valid UUID" },
          },
        },
        poolId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: { args: 4, msg: "poolId: Pool ID must be a valid UUID" },
          },
        },
        durationId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: {
              args: 4,
              msg: "durationId: Duration ID must be a valid UUID",
            },
          },
        },
        amount: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isFloat: { msg: "amount: Amount must be a number" },
          },
        },
        status: {
          type: DataTypes.ENUM("ACTIVE", "RELEASED", "COLLECTED"),
          allowNull: false,
          defaultValue: "ACTIVE",
          validate: {
            isIn: {
              args: [["ACTIVE", "RELEASED", "COLLECTED"]],
              msg: "status: Status must be either 'ACTIVE', 'RELEASED', or 'COLLECTED'",
            },
          },
        },
      },
      {
        sequelize,
        tableName: "staking_log",
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
            name: "stakingLogIdKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "stakingLogUserIdFkey",
            using: "BTREE",
            fields: [{ name: "userId" }],
          },
          {
            name: "stakingLogPoolIdFkey",
            using: "BTREE",
            fields: [{ name: "poolId" }],
          },
          {
            name: "uniqueActiveStake",
            unique: true,
            using: "BTREE",
            fields: [
              { name: "userId" },
              { name: "poolId" },
              { name: "status" },
            ],
            where: { status: "ACTIVE" },
          },
        ],
      }
    );
  }
}
