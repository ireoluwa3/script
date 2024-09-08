import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { user, userId } from "./user";

export interface announcementAttributes {
  id: string;
  type: "GENERAL" | "EVENT" | "UPDATE";
  title: string;
  message: string;
  link?: string;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type announcementPk = "id";
export type announcementId = announcement[announcementPk];
export type announcementOptionalAttributes =
  | "id"
  | "type"
  | "link"
  | "status"
  | "createdAt"
  | "updatedAt"
  | "deletedAt";
export type announcementCreationAttributes = Optional<
  announcementAttributes,
  announcementOptionalAttributes
>;

export class announcement
  extends Model<announcementAttributes, announcementCreationAttributes>
  implements announcementAttributes
{
  id!: string;
  type!: "GENERAL" | "EVENT" | "UPDATE";
  title!: string;
  message!: string;
  link?: string;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  // announcement belongsTo user via userId
  user!: user;
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof announcement {
    return announcement.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        type: {
          type: DataTypes.ENUM("GENERAL", "EVENT", "UPDATE"),
          allowNull: false,
          defaultValue: "GENERAL",
          validate: {
            isIn: {
              args: [["GENERAL", "EVENT", "UPDATE"]],
              msg: "type: Type must be one of GENERAL, EVENT, UPDATE",
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
        status: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: true,
        },
      },
      {
        sequelize,
        tableName: "announcement",
        timestamps: true,
        paranoid: true,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
        ],
      }
    );
  }
}
