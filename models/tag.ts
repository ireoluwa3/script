import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { postTag, postTagId } from "./postTag";

export interface tagAttributes {
  id: string;
  name: string;
  slug: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type tagPk = "id";
export type tagId = tag[tagPk];
export type tagOptionalAttributes =
  | "id"
  | "createdAt"
  | "updatedAt"
  | "deletedAt";
export type tagCreationAttributes = Optional<
  tagAttributes,
  tagOptionalAttributes
>;

export class tag
  extends Model<tagAttributes, tagCreationAttributes>
  implements tagAttributes
{
  id!: string;
  name!: string;
  slug!: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  // tag hasMany postTag via tagId
  postTags!: postTag[];
  getPostTags!: Sequelize.HasManyGetAssociationsMixin<postTag>;
  setPostTags!: Sequelize.HasManySetAssociationsMixin<postTag, postTagId>;
  addPostTag!: Sequelize.HasManyAddAssociationMixin<postTag, postTagId>;
  addPostTags!: Sequelize.HasManyAddAssociationsMixin<postTag, postTagId>;
  createPostTag!: Sequelize.HasManyCreateAssociationMixin<postTag>;
  removePostTag!: Sequelize.HasManyRemoveAssociationMixin<postTag, postTagId>;
  removePostTags!: Sequelize.HasManyRemoveAssociationsMixin<postTag, postTagId>;
  hasPostTag!: Sequelize.HasManyHasAssociationMixin<postTag, postTagId>;
  hasPostTags!: Sequelize.HasManyHasAssociationsMixin<postTag, postTagId>;
  countPostTags!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof tag {
    return tag.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false,
          validate: {
            notEmpty: { msg: "name: Name cannot be empty" },
          },
        },
        slug: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: "tagSlugKey",
          validate: {
            notEmpty: { msg: "slug: Slug cannot be empty" },
          },
        },
      },
      {
        sequelize,
        tableName: "tag",
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
            name: "tagSlugKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "slug" }],
          },
        ],
      }
    );
  }
}
