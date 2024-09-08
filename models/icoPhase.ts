import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { icoContribution, icoContributionId } from "./icoContribution";
import type {
  icoPhaseAllocation,
  icoPhaseAllocationId,
} from "./icoPhaseAllocation";
import type { icoToken, icoTokenId } from "./icoToken";

export interface icoPhaseAttributes {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  price: number;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "REJECTED" | "CANCELLED";
  tokenId: string;
  minPurchase: number;
  maxPurchase: number;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

export type icoPhasePk = "id";
export type icoPhaseId = icoPhase[icoPhasePk];
export type icoPhaseOptionalAttributes =
  | "id"
  | "status"
  | "minPurchase"
  | "maxPurchase"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
export type icoPhaseCreationAttributes = Optional<
  icoPhaseAttributes,
  icoPhaseOptionalAttributes
>;

export class icoPhase
  extends Model<icoPhaseAttributes, icoPhaseCreationAttributes>
  implements icoPhaseAttributes
{
  id!: string;
  name!: string;
  startDate!: Date;
  endDate!: Date;
  price!: number;
  status!: "PENDING" | "ACTIVE" | "COMPLETED" | "REJECTED" | "CANCELLED";
  tokenId!: string;
  minPurchase!: number;
  maxPurchase!: number;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // icoPhase hasMany icoContribution via phaseId
  icoContributions!: icoContribution[];
  getIcoContributions!: Sequelize.HasManyGetAssociationsMixin<icoContribution>;
  setIcoContributions!: Sequelize.HasManySetAssociationsMixin<
    icoContribution,
    icoContributionId
  >;
  addIcoContribution!: Sequelize.HasManyAddAssociationMixin<
    icoContribution,
    icoContributionId
  >;
  addIcoContributions!: Sequelize.HasManyAddAssociationsMixin<
    icoContribution,
    icoContributionId
  >;
  createIcoContribution!: Sequelize.HasManyCreateAssociationMixin<icoContribution>;
  removeIcoContribution!: Sequelize.HasManyRemoveAssociationMixin<
    icoContribution,
    icoContributionId
  >;
  removeIcoContributions!: Sequelize.HasManyRemoveAssociationsMixin<
    icoContribution,
    icoContributionId
  >;
  hasIcoContribution!: Sequelize.HasManyHasAssociationMixin<
    icoContribution,
    icoContributionId
  >;
  hasIcoContributions!: Sequelize.HasManyHasAssociationsMixin<
    icoContribution,
    icoContributionId
  >;
  countIcoContributions!: Sequelize.HasManyCountAssociationsMixin;
  // icoPhase hasMany icoPhaseAllocation via phaseId
  icoPhaseAllocations!: icoPhaseAllocation[];
  getIcoPhaseAllocations!: Sequelize.HasManyGetAssociationsMixin<icoPhaseAllocation>;
  setIcoPhaseAllocations!: Sequelize.HasManySetAssociationsMixin<
    icoPhaseAllocation,
    icoPhaseAllocationId
  >;
  addIcoPhaseAllocation!: Sequelize.HasManyAddAssociationMixin<
    icoPhaseAllocation,
    icoPhaseAllocationId
  >;
  addIcoPhaseAllocations!: Sequelize.HasManyAddAssociationsMixin<
    icoPhaseAllocation,
    icoPhaseAllocationId
  >;
  createIcoPhaseAllocation!: Sequelize.HasManyCreateAssociationMixin<icoPhaseAllocation>;
  removeIcoPhaseAllocation!: Sequelize.HasManyRemoveAssociationMixin<
    icoPhaseAllocation,
    icoPhaseAllocationId
  >;
  removeIcoPhaseAllocations!: Sequelize.HasManyRemoveAssociationsMixin<
    icoPhaseAllocation,
    icoPhaseAllocationId
  >;
  hasIcoPhaseAllocation!: Sequelize.HasManyHasAssociationMixin<
    icoPhaseAllocation,
    icoPhaseAllocationId
  >;
  hasIcoPhaseAllocations!: Sequelize.HasManyHasAssociationsMixin<
    icoPhaseAllocation,
    icoPhaseAllocationId
  >;
  countIcoPhaseAllocations!: Sequelize.HasManyCountAssociationsMixin;
  // icoPhase belongsTo icoToken via tokenId
  token!: icoToken;
  getToken!: Sequelize.BelongsToGetAssociationMixin<icoToken>;
  setToken!: Sequelize.BelongsToSetAssociationMixin<icoToken, icoTokenId>;
  createToken!: Sequelize.BelongsToCreateAssociationMixin<icoToken>;

  static initModel(sequelize: Sequelize.Sequelize): typeof icoPhase {
    return icoPhase.init(
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
        startDate: {
          type: DataTypes.DATE(3),
          allowNull: false,
          validate: {
            isDate: {
              msg: "startDate: Start date must be a valid date",
              args: true,
            },
          },
        },
        endDate: {
          type: DataTypes.DATE(3),
          allowNull: false,
          validate: {
            isDate: {
              msg: "endDate: End date must be a valid date",
              args: true,
            },
          },
        },

        price: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isFloat: { msg: "price: Price must be a valid number" },
          },
        },
        status: {
          type: DataTypes.ENUM(
            "PENDING",
            "ACTIVE",
            "COMPLETED",
            "REJECTED",
            "CANCELLED"
          ),
          allowNull: false,
          defaultValue: "PENDING",
          validate: {
            isIn: {
              args: [
                ["PENDING", "ACTIVE", "COMPLETED", "REJECTED", "CANCELLED"],
              ],
              msg: "status: Status must be PENDING, ACTIVE, COMPLETED, REJECTED, or CANCELLED",
            },
          },
        },
        tokenId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: { args: 4, msg: "tokenId: Token ID must be a valid UUID" },
          },
        },
        minPurchase: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          defaultValue: 0,
          validate: {
            isFloat: {
              msg: "minPurchase: Minimum purchase must be a valid number",
            },
          },
        },
        maxPurchase: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          defaultValue: 0,
          validate: {
            isFloat: {
              msg: "maxPurchase: Maximum purchase must be a valid number",
            },
          },
        },
      },
      {
        sequelize,
        tableName: "ico_phase",
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
            name: "icoPhaseTokenIdFkey",
            using: "BTREE",
            fields: [{ name: "tokenId" }],
          },
        ],
      }
    );
  }
}
