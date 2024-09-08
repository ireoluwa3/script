import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { post, postId } from "./post";

export interface categoryAttributes {
  id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type categoryPk = "id";
export type categoryId = category[categoryPk];
export type categoryOptionalAttributes =
  | "id"
  | "image"
  | "description"
  | "createdAt"
  | "updatedAt"
  | "deletedAt";
export type categoryCreationAttributes = Optional<
  categoryAttributes,
  categoryOptionalAttributes
>;

export class category
  extends Model<categoryAttributes, categoryCreationAttributes>
  implements categoryAttributes
{
  id!: string;
  name!: string;
  slug!: string;
  image?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  // category hasMany post via categoryId
  posts!: post[];
  getPosts!: Sequelize.HasManyGetAssociationsMixin<post>;
  setPosts!: Sequelize.HasManySetAssociationsMixin<post, postId>;
  addPost!: Sequelize.HasManyAddAssociationMixin<post, postId>;
  addPosts!: Sequelize.HasManyAddAssociationsMixin<post, postId>;
  createPost!: Sequelize.HasManyCreateAssociationMixin<post>;
  removePost!: Sequelize.HasManyRemoveAssociationMixin<post, postId>;
  removePosts!: Sequelize.HasManyRemoveAssociationsMixin<post, postId>;
  hasPost!: Sequelize.HasManyHasAssociationMixin<post, postId>;
  hasPosts!: Sequelize.HasManyHasAssociationsMixin<post, postId>;
  countPosts!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof category {
    return category.init(
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
            notEmpty: { msg: "name: Name must not be empty" },
          },
        },
        slug: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: "categorySlugKey",
          validate: {
            notEmpty: { msg: "slug: Slug must not be empty" },
            is: {
              args: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/],
              msg: "slug: Slug must be URL-friendly (lowercase letters, numbers, and hyphens only)",
            },
          },
        },
        image: {
          type: DataTypes.TEXT,
          allowNull: true,
          validate: {
            is: {
              args: ["^/(uploads|img)/.*$", "i"],
              msg: "image: Image must be a valid URL",
            },
          },
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "category",
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
            name: "categorySlugKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "slug" }],
          },
        ],
      }
    );
  }
}
