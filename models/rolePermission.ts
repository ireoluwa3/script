import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { permission, permissionId } from "./permission";
import type { role, roleId } from "./role";

export interface rolePermissionAttributes {
  id: number;
  roleId: number;
  permissionId: number;
}

export type rolePermissionPk = "id";
export type rolePermissionId = rolePermission[rolePermissionPk];
export type rolePermissionOptionalAttributes = "id";
export type rolePermissionCreationAttributes = Optional<
  rolePermissionAttributes,
  rolePermissionOptionalAttributes
>;

export class rolePermission
  extends Model<rolePermissionAttributes, rolePermissionCreationAttributes>
  implements rolePermissionAttributes
{
  id!: number;
  roleId!: number;
  permissionId!: number;

  // rolePermission belongsTo permission via permissionId
  permission!: permission;
  getPermission!: Sequelize.BelongsToGetAssociationMixin<permission>;
  setPermission!: Sequelize.BelongsToSetAssociationMixin<
    permission,
    permissionId
  >;
  createPermission!: Sequelize.BelongsToCreateAssociationMixin<permission>;
  // rolePermission belongsTo role via roleId
  role!: role;
  getRole!: Sequelize.BelongsToGetAssociationMixin<role>;
  setRole!: Sequelize.BelongsToSetAssociationMixin<role, roleId>;
  createRole!: Sequelize.BelongsToCreateAssociationMixin<role>;

  static initModel(sequelize: Sequelize.Sequelize): typeof rolePermission {
    return rolePermission.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        roleId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        permissionId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "role_permission",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "RolePermissionPermissionIdFkey",
            using: "BTREE",
            fields: [{ name: "permissionId" }],
          },
          {
            name: "RolePermissionRoleIdFkey",
            using: "BTREE",
            fields: [{ name: "roleId" }],
          },
        ],
      }
    );
  }
}
