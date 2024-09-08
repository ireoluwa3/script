import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type {
  icoAllocation,
  icoAllocationCreationAttributes,
  icoAllocationId,
} from "./icoAllocation";
import type { icoPhase, icoPhaseId } from "./icoPhase";
import type { icoProject, icoProjectId } from "./icoProject";

export interface icoTokenAttributes {
  id: string;
  name: string;
  chain: string;
  currency: string;
  purchaseCurrency: string;
  purchaseWalletType: "FIAT" | "SPOT" | "ECO";
  address: string;
  totalSupply: number;
  description: string;
  image: string;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "REJECTED" | "CANCELLED";
  projectId: string;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

export type icoTokenPk = "id";
export type icoTokenId = icoToken[icoTokenPk];
export type icoTokenOptionalAttributes =
  | "id"
  | "purchaseCurrency"
  | "purchaseWalletType"
  | "status"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
export type icoTokenCreationAttributes = Optional<
  icoTokenAttributes,
  icoTokenOptionalAttributes
>;

export class icoToken
  extends Model<icoTokenAttributes, icoTokenCreationAttributes>
  implements icoTokenAttributes
{
  id!: string;
  name!: string;
  chain!: string;
  currency!: string;
  purchaseCurrency!: string;
  purchaseWalletType!: "FIAT" | "SPOT" | "ECO";
  address!: string;
  totalSupply!: number;
  description!: string;
  image!: string;
  status!: "PENDING" | "ACTIVE" | "COMPLETED" | "REJECTED" | "CANCELLED";
  projectId!: string;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // icoToken belongsTo icoProject via projectId
  project!: icoProject;
  getProject!: Sequelize.BelongsToGetAssociationMixin<icoProject>;
  setProject!: Sequelize.BelongsToSetAssociationMixin<icoProject, icoProjectId>;
  createProject!: Sequelize.BelongsToCreateAssociationMixin<icoProject>;
  // icoToken hasOne icoAllocation via tokenId
  icoAllocation!: icoAllocation;
  getIcoAllocation!: Sequelize.HasOneGetAssociationMixin<icoAllocation>;
  setIcoAllocation!: Sequelize.HasOneSetAssociationMixin<
    icoAllocation,
    icoAllocationId
  >;
  createIcoAllocation!: Sequelize.HasOneCreateAssociationMixin<icoAllocation>;
  // icoToken hasMany icoPhase via tokenId
  icoPhases!: icoPhase[];
  getIcoPhases!: Sequelize.HasManyGetAssociationsMixin<icoPhase>;
  setIcoPhases!: Sequelize.HasManySetAssociationsMixin<icoPhase, icoPhaseId>;
  addIcoPhase!: Sequelize.HasManyAddAssociationMixin<icoPhase, icoPhaseId>;
  addIcoPhases!: Sequelize.HasManyAddAssociationsMixin<icoPhase, icoPhaseId>;
  createIcoPhase!: Sequelize.HasManyCreateAssociationMixin<icoPhase>;
  removeIcoPhase!: Sequelize.HasManyRemoveAssociationMixin<
    icoPhase,
    icoPhaseId
  >;
  removeIcoPhases!: Sequelize.HasManyRemoveAssociationsMixin<
    icoPhase,
    icoPhaseId
  >;
  hasIcoPhase!: Sequelize.HasManyHasAssociationMixin<icoPhase, icoPhaseId>;
  hasIcoPhases!: Sequelize.HasManyHasAssociationsMixin<icoPhase, icoPhaseId>;
  countIcoPhases!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof icoToken {
    return icoToken.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        projectId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: {
              args: 4,
              msg: "projectId: Project ID must be a valid UUID",
            },
          },
        },
        name: {
          type: DataTypes.STRING(191),
          allowNull: false,
          validate: {
            notEmpty: { msg: "name: Name cannot be empty" },
          },
        },
        chain: {
          type: DataTypes.STRING(191),
          allowNull: false,
          validate: {
            notEmpty: { msg: "chain: Chain cannot be empty" },
          },
        },
        currency: {
          type: DataTypes.STRING(191),
          allowNull: false,
          validate: {
            notEmpty: { msg: "currency: Currency cannot be empty" },
          },
        },
        purchaseCurrency: {
          type: DataTypes.STRING(191),
          allowNull: false,
          defaultValue: "ETH",
          validate: {
            notEmpty: {
              msg: "purchaseCurrency: Purchase currency cannot be empty",
            },
          },
        },
        purchaseWalletType: {
          type: DataTypes.ENUM("FIAT", "SPOT", "ECO"),
          allowNull: false,
          defaultValue: "SPOT",
          validate: {
            isIn: {
              args: [["FIAT", "SPOT", "ECO"]],
              msg: "purchaseWalletType: Purchase wallet type must be one of FIAT, SPOT, ECO",
            },
          },
        },
        address: {
          type: DataTypes.STRING(191),
          allowNull: false,
          validate: {
            notEmpty: { msg: "address: Address cannot be empty" },
          },
        },
        totalSupply: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            isInt: { msg: "totalSupply: Total supply must be an integer" },
          },
        },
        description: {
          type: DataTypes.TEXT("long"),
          allowNull: false,
          validate: {
            notEmpty: { msg: "description: Description cannot be empty" },
          },
        },
        image: {
          type: DataTypes.STRING(191),
          allowNull: false,
          validate: {
            notEmpty: { msg: "image: Image cannot be empty" },
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
              msg: "status: Status must be one of PENDING, ACTIVE, COMPLETED, REJECTED, CANCELLED",
            },
          },
        },
      },
      {
        sequelize,
        tableName: "ico_token",
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
            name: "icoTokenProjectIdFkey",
            using: "BTREE",
            fields: [{ name: "projectId" }],
          },
        ],
      }
    );
  }
}
