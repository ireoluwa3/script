import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { icoPhase, icoPhaseId } from "./icoPhase";
import type { user, userId } from "./user";

export interface icoContributionAttributes {
  id: string;
  userId: string;
  phaseId: string;
  amount: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED" | "REJECTED";
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

export type icoContributionPk = "id";
export type icoContributionId = icoContribution[icoContributionPk];
export type icoContributionOptionalAttributes =
  | "id"
  | "status"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
export type icoContributionCreationAttributes = Optional<
  icoContributionAttributes,
  icoContributionOptionalAttributes
>;

export class icoContribution
  extends Model<icoContributionAttributes, icoContributionCreationAttributes>
  implements icoContributionAttributes
{
  id!: string;
  userId!: string;
  phaseId!: string;
  amount!: number;
  status!: "PENDING" | "COMPLETED" | "CANCELLED" | "REJECTED";
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // icoContribution belongsTo icoPhase via phaseId
  phase!: icoPhase;
  getPhase!: Sequelize.BelongsToGetAssociationMixin<icoPhase>;
  setPhase!: Sequelize.BelongsToSetAssociationMixin<icoPhase, icoPhaseId>;
  createPhase!: Sequelize.BelongsToCreateAssociationMixin<icoPhase>;
  // icoContribution belongsTo user via userId
  user!: user;
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof icoContribution {
    return icoContribution.init(
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
        phaseId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: { args: 4, msg: "phaseId: Phase ID must be a valid UUID" },
          },
        },
        amount: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isFloat: { msg: "amount: Amount must be a valid number" },
          },
        },
        status: {
          type: DataTypes.ENUM("PENDING", "COMPLETED", "CANCELLED", "REJECTED"),
          allowNull: false,
          defaultValue: "PENDING",
          validate: {
            isIn: {
              args: [["PENDING", "COMPLETED", "CANCELLED", "REJECTED"]],
              msg: "status: Status must be PENDING, COMPLETED, CANCELLED, or REJECTED",
            },
          },
        },
      },
      {
        sequelize,
        tableName: "ico_contribution",
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
            name: "icoContributionIdKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "icoContributionUserIdFkey",
            using: "BTREE",
            fields: [{ name: "userId" }],
          },
          {
            name: "icoContributionPhaseIdFkey",
            using: "BTREE",
            fields: [{ name: "phaseId" }],
          },
        ],
      }
    );
  }
}
