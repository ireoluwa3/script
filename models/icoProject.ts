import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { icoToken, icoTokenId } from "./icoToken";

export interface icoProjectAttributes {
  id: string;
  name: string;
  description: string;
  website: string;
  whitepaper: string;
  image: string;
  status: "PENDING" | "ACTIVE" | "COMPLETED" | "REJECTED" | "CANCELLED";
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

export type icoProjectPk = "id";
export type icoProjectId = icoProject[icoProjectPk];
export type icoProjectOptionalAttributes =
  | "id"
  | "status"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
export type icoProjectCreationAttributes = Optional<
  icoProjectAttributes,
  icoProjectOptionalAttributes
>;

export class icoProject
  extends Model<icoProjectAttributes, icoProjectCreationAttributes>
  implements icoProjectAttributes
{
  id!: string;
  name!: string;
  description!: string;
  website!: string;
  whitepaper!: string;
  image!: string;
  status!: "PENDING" | "ACTIVE" | "COMPLETED" | "REJECTED" | "CANCELLED";
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // icoProject hasMany icoToken via projectId
  icoTokens!: icoToken[];
  getIcoTokens!: Sequelize.HasManyGetAssociationsMixin<icoToken>;
  setIcoTokens!: Sequelize.HasManySetAssociationsMixin<icoToken, icoTokenId>;
  addIcoToken!: Sequelize.HasManyAddAssociationMixin<icoToken, icoTokenId>;
  addIcoTokens!: Sequelize.HasManyAddAssociationsMixin<icoToken, icoTokenId>;
  createIcoToken!: Sequelize.HasManyCreateAssociationMixin<icoToken>;
  removeIcoToken!: Sequelize.HasManyRemoveAssociationMixin<
    icoToken,
    icoTokenId
  >;
  removeIcoTokens!: Sequelize.HasManyRemoveAssociationsMixin<
    icoToken,
    icoTokenId
  >;
  hasIcoToken!: Sequelize.HasManyHasAssociationMixin<icoToken, icoTokenId>;
  hasIcoTokens!: Sequelize.HasManyHasAssociationsMixin<icoToken, icoTokenId>;
  countIcoTokens!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof icoProject {
    return icoProject.init(
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
          type: DataTypes.TEXT("long"),
          allowNull: false,
          validate: {
            notEmpty: { msg: "description: Description cannot be empty" },
          },
        },
        website: {
          type: DataTypes.STRING(191),
          allowNull: false,
          validate: {
            notEmpty: { msg: "website: Website cannot be empty" },
            isUrl: { msg: "website: Must be a valid URL" },
          },
        },
        whitepaper: {
          type: DataTypes.TEXT("long"),
          allowNull: false,
          validate: {
            notEmpty: { msg: "whitepaper: Whitepaper cannot be empty" },
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
        tableName: "ico_project",
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
            name: "icoProjectIdKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
        ],
      }
    );
  }
}
