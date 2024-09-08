import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { post, postId } from "./post";
import type { tag, tagId } from "./tag";

export interface postTagAttributes {
  id: string;
  postId: string;
  tagId: string;
}

export type postTagPk = "id";
export type postTagId = postTag[postTagPk];
export type postTagOptionalAttributes = "id";
export type postTagCreationAttributes = Optional<
  postTagAttributes,
  postTagOptionalAttributes
>;

export class postTag
  extends Model<postTagAttributes, postTagCreationAttributes>
  implements postTagAttributes
{
  id!: string;
  postId!: string;
  tagId!: string;

  // postTag belongsTo post via postId
  post!: post;
  getPost!: Sequelize.BelongsToGetAssociationMixin<post>;
  setPost!: Sequelize.BelongsToSetAssociationMixin<post, postId>;
  createPost!: Sequelize.BelongsToCreateAssociationMixin<post>;
  // postTag belongsTo tag via tagId
  tag!: tag;
  getTag!: Sequelize.BelongsToGetAssociationMixin<tag>;
  setTag!: Sequelize.BelongsToSetAssociationMixin<tag, tagId>;
  createTag!: Sequelize.BelongsToCreateAssociationMixin<tag>;

  static initModel(sequelize: Sequelize.Sequelize): typeof postTag {
    return postTag.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        postId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: { args: 4, msg: "postId: Post ID must be a valid UUID" },
          },
        },
        tagId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: { args: 4, msg: "tagId: Tag ID must be a valid UUID" },
          },
        },
      },
      {
        sequelize,
        tableName: "post_tag",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "postTagPostIdForeign",
            using: "BTREE",
            fields: [{ name: "postId" }],
          },
          {
            name: "postTagTagIdForeign",
            using: "BTREE",
            fields: [{ name: "tagId" }],
          },
        ],
      }
    );
  }
}
