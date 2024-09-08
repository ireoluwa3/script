import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { icoAllocation, icoAllocationId } from "./icoAllocation";
import type { icoPhase, icoPhaseId } from "./icoPhase";

export interface icoPhaseAllocationAttributes {
  id: string;
  allocationId: string;
  phaseId: string;
  percentage: number;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

export type icoPhaseAllocationPk = "id";
export type icoPhaseAllocationId = icoPhaseAllocation[icoPhaseAllocationPk];
export type icoPhaseAllocationOptionalAttributes =
  | "id"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
export type icoPhaseAllocationCreationAttributes = Optional<
  icoPhaseAllocationAttributes,
  icoPhaseAllocationOptionalAttributes
>;

export class icoPhaseAllocation
  extends Model<
    icoPhaseAllocationAttributes,
    icoPhaseAllocationCreationAttributes
  >
  implements icoPhaseAllocationAttributes
{
  id!: string;
  allocationId!: string;
  phaseId!: string;
  percentage!: number;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // icoPhaseAllocation belongsTo icoAllocation via allocationId
  allocation!: icoAllocation;
  getAllocation!: Sequelize.BelongsToGetAssociationMixin<icoAllocation>;
  setAllocation!: Sequelize.BelongsToSetAssociationMixin<
    icoAllocation,
    icoAllocationId
  >;
  createAllocation!: Sequelize.BelongsToCreateAssociationMixin<icoAllocation>;
  // icoPhaseAllocation belongsTo icoPhase via phaseId
  phase!: icoPhase;
  getPhase!: Sequelize.BelongsToGetAssociationMixin<icoPhase>;
  setPhase!: Sequelize.BelongsToSetAssociationMixin<icoPhase, icoPhaseId>;
  createPhase!: Sequelize.BelongsToCreateAssociationMixin<icoPhase>;

  static initModel(sequelize: Sequelize.Sequelize): typeof icoPhaseAllocation {
    return icoPhaseAllocation.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        allocationId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: {
              args: 4,
              msg: "allocationId: Allocation ID must be a valid UUID",
            },
          },
        },
        phaseId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: { args: 4, msg: "phaseId: Phase ID must be a valid UUID" },
          },
        },
        percentage: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isFloat: { msg: "percentage: Percentage must be a valid number" },
          },
        },
      },
      {
        sequelize,
        tableName: "ico_phase_allocation",
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
            name: "icoPhaseAllocationAllocationIdFkey",
            using: "BTREE",
            fields: [{ name: "allocationId" }],
          },
          {
            name: "icoPhaseAllocationPhaseIdFkey",
            using: "BTREE",
            fields: [{ name: "phaseId" }],
          },
        ],
      }
    );
  }
}
