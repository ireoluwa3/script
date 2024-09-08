import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { user, userId } from "./user";

export interface twoFactorAttributes {
  id: string;
  userId: string;
  secret: string;
  type: "EMAIL" | "SMS" | "APP";
  enabled: boolean;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

export type twoFactorPk = "id";
export type twoFactorId = twoFactor[twoFactorPk];
export type twoFactorOptionalAttributes =
  | "id"
  | "enabled"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
export type twoFactorCreationAttributes = Optional<
  twoFactorAttributes,
  twoFactorOptionalAttributes
>;

export class twoFactor
  extends Model<twoFactorAttributes, twoFactorCreationAttributes>
  implements twoFactorAttributes
{
  id!: string;
  userId!: string;
  secret!: string;
  type!: "EMAIL" | "SMS" | "APP";
  enabled!: boolean;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // twoFactor belongsTo user via userId
  user!: user;
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof twoFactor {
    return twoFactor.init(
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

          unique: "twoFactorUserIdFkey",
          validate: {
            notNull: { msg: "userId: User ID cannot be null" },
            isUUID: { args: 4, msg: "userId: User ID must be a valid UUID" },
          },
        },
        secret: {
          type: DataTypes.STRING(255),
          allowNull: false,
          validate: {
            notEmpty: { msg: "secret: Secret cannot be empty" },
          },
        },
        type: {
          type: DataTypes.ENUM("EMAIL", "SMS", "APP"),
          allowNull: false,
          validate: {
            isIn: {
              args: [["EMAIL", "SMS", "APP"]],
              msg: "type: Type must be one of ['EMAIL', 'SMS', 'APP']",
            },
          },
        },
        enabled: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        sequelize,
        tableName: "two_factor",
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
            name: "twoFactorUserIdKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "userId" }],
          },
          {
            name: "twoFactorUserIdForeign",
            using: "BTREE",
            fields: [{ name: "userId" }],
          },
        ],
      }
    );
  }
}
