import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { rolePermission, rolePermissionId } from "./rolePermission";
import type { user, userId } from "./user";

export interface roleAttributes {
  id: number;
  name: string;
}

export type rolePk = "id";
export type roleId = role[rolePk];
export type roleOptionalAttributes = "id";
export type roleCreationAttributes = Optional<
  roleAttributes,
  roleOptionalAttributes
>;

export class role
  extends Model<roleAttributes, roleCreationAttributes>
  implements roleAttributes
{
  id!: number;
  name!: string;

  // role hasMany rolePermission via roleId
  rolePermissions!: rolePermission[];
  getRolepermissions!: Sequelize.HasManyGetAssociationsMixin<rolePermission>;
  setRolepermissions!: Sequelize.HasManySetAssociationsMixin<
    rolePermission,
    rolePermissionId
  >;
  addRolepermission!: Sequelize.HasManyAddAssociationMixin<
    rolePermission,
    rolePermissionId
  >;
  addRolepermissions!: Sequelize.HasManyAddAssociationsMixin<
    rolePermission,
    rolePermissionId
  >;
  createRolepermission!: Sequelize.HasManyCreateAssociationMixin<rolePermission>;
  removeRolepermission!: Sequelize.HasManyRemoveAssociationMixin<
    rolePermission,
    rolePermissionId
  >;
  removeRolepermissions!: Sequelize.HasManyRemoveAssociationsMixin<
    rolePermission,
    rolePermissionId
  >;
  hasRolepermission!: Sequelize.HasManyHasAssociationMixin<
    rolePermission,
    rolePermissionId
  >;
  hasRolepermissions!: Sequelize.HasManyHasAssociationsMixin<
    rolePermission,
    rolePermissionId
  >;

  setPermissions!: Sequelize.HasManySetAssociationsMixin<
    rolePermission,
    rolePermissionId
  >;
  addPermissions!: Sequelize.HasManyAddAssociationsMixin<
    rolePermission,
    rolePermissionId
  >;
  addPermission!: Sequelize.HasManyAddAssociationMixin<
    rolePermission,
    rolePermissionId
  >;
  createPermission!: Sequelize.HasManyCreateAssociationMixin<rolePermission>;
  removePermission!: Sequelize.HasManyRemoveAssociationMixin<
    rolePermission,
    rolePermissionId
  >;
  removePermissions!: Sequelize.HasManyRemoveAssociationsMixin<
    rolePermission,
    rolePermissionId
  >;
  hasPermission!: Sequelize.HasManyHasAssociationMixin<
    rolePermission,
    rolePermissionId
  >;
  hasPermissions!: Sequelize.HasManyHasAssociationsMixin<
    rolePermission,
    rolePermissionId
  >;

  countRolepermissions!: Sequelize.HasManyCountAssociationsMixin;
  // role hasMany user via roleId
  users!: user[];
  getUsers!: Sequelize.HasManyGetAssociationsMixin<user>;
  setUsers!: Sequelize.HasManySetAssociationsMixin<user, userId>;
  addUser!: Sequelize.HasManyAddAssociationMixin<user, userId>;
  addUsers!: Sequelize.HasManyAddAssociationsMixin<user, userId>;
  createUser!: Sequelize.HasManyCreateAssociationMixin<user>;
  removeUser!: Sequelize.HasManyRemoveAssociationMixin<user, userId>;
  removeUsers!: Sequelize.HasManyRemoveAssociationsMixin<user, userId>;
  hasUser!: Sequelize.HasManyHasAssociationMixin<user, userId>;
  hasUsers!: Sequelize.HasManyHasAssociationsMixin<user, userId>;
  countUsers!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof role {
    return role.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: "roleNameKey",
          validate: {
            notEmpty: { msg: "name: Name cannot be empty" },
          },
        },
      },
      {
        sequelize,
        tableName: "role",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "roleNameKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "name" }],
          },
        ],
      }
    );
  }
}
