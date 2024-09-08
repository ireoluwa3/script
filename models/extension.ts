import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";

export interface extensionAttributes {
  id: string;
  productId: string;
  name: string;
  title?: string;
  description?: string;
  link?: string;
  status?: boolean;
  version?: string;
  image?: string;
}

export type extensionPk = "id";
export type extensionId = extension[extensionPk];
export type extensionOptionalAttributes =
  | "id"
  | "title"
  | "description"
  | "link"
  | "status"
  | "version"
  | "image";
export type extensionCreationAttributes = Optional<
  extensionAttributes,
  extensionOptionalAttributes
>;

export class extension
  extends Model<extensionAttributes, extensionCreationAttributes>
  implements extensionAttributes
{
  id!: string;
  productId!: string;
  name!: string;
  title?: string;
  description?: string;
  link?: string;
  status?: boolean;
  version?: string;
  image?: string;

  static initModel(sequelize: Sequelize.Sequelize): typeof extension {
    return extension.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },

        productId: {
          type: DataTypes.STRING(191),
          allowNull: false,
          unique: "extensionProductIdKey",
          validate: {
            notEmpty: { msg: "productId: Product ID must not be empty" },
          },
        },
        name: {
          type: DataTypes.STRING(191),
          allowNull: false,
          unique: "extensionNameKey",
          validate: {
            notEmpty: { msg: "name: Name must not be empty" },
          },
        },
        title: {
          type: DataTypes.STRING(191),
          allowNull: true,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        link: {
          type: DataTypes.STRING(191),
          allowNull: true,
          validate: {
            isUrl: { msg: "link: Link must be a valid URL" },
          },
        },
        status: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          validate: {
            isBoolean: { msg: "status: Status must be a boolean value" },
          },
        },
        version: {
          type: DataTypes.STRING(191),
          allowNull: true,
          defaultValue: "0.0.1",
        },
        image: {
          type: DataTypes.STRING(1000),
          allowNull: true,
          validate: {
            is: {
              args: ["^/(uploads|img)/.*$", "i"],
              msg: "image: image must be a valid URL",
            },
          },
        },
      },
      {
        sequelize,
        tableName: "extension",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "extensionProductIdKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "productId" }],
          },
          {
            name: "extensionNameKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "name" }],
          },
        ],
      }
    );
  }
}
