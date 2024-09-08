import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { user, userId } from "./user";

export interface notificationAttributes {
  id: string;
  userId: string;
  type: "SECURITY" | "SYSTEM" | "ACTIVITY";
  title: string;
  message: string;
  link?: string;
  icon?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type notificationPk = "id";
export type notificationId = notification[notificationPk];
export type notificationOptionalAttributes =
  | "id"
  | "type"
  | "link"
  | "icon"
  | "createdAt"
  | "updatedAt";
export type notificationCreationAttributes = Optional<
  notificationAttributes,
  notificationOptionalAttributes
>;

export class notification
  extends Model<notificationAttributes, notificationCreationAttributes>
  implements notificationAttributes
{
  id!: string;
  userId!: string;
  type!: "SECURITY" | "SYSTEM" | "ACTIVITY";
  title!: string;
  message!: string;
  link?: string;
  icon?: string;
  createdAt?: Date;
  updatedAt?: Date;

  // notification belongsTo user via userId
  user!: user;
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof notification {
    return notification.init(
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
        type: {
          type: DataTypes.ENUM("SECURITY", "SYSTEM", "ACTIVITY"),
          allowNull: false,
          defaultValue: "SYSTEM",
          validate: {
            isIn: {
              args: [["SECURITY", "SYSTEM", "ACTIVITY"]],
              msg: "type: Type must be one of SECURITY, SYSTEM, ACTIVITY",
            },
          },
        },
        title: {
          type: DataTypes.STRING(255),
          allowNull: false,
          validate: {
            notEmpty: { msg: "title: Title cannot be empty" },
          },
        },
        message: {
          type: DataTypes.TEXT,
          allowNull: false,
          validate: {
            notEmpty: { msg: "message: Message cannot be empty" },
          },
        },
        link: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "notification",
        timestamps: true,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "notificationsUserIdForeign",
            using: "BTREE",
            fields: [{ name: "userId" }],
          },
        ],
      }
    );
  }
}
