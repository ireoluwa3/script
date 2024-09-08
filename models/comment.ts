import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { user, userId } from "./user";
import type { post, postId } from "./post";

export interface commentAttributes {
  id: string;
  content: string;
  userId: string;
  postId: string;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

export type commentPk = "id";
export type commentId = comment[commentPk];
export type commentOptionalAttributes =
  | "id"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
export type commentCreationAttributes = Optional<
  commentAttributes,
  commentOptionalAttributes
>;

export class comment
  extends Model<commentAttributes, commentCreationAttributes>
  implements commentAttributes
{
  id!: string;
  content!: string;
  userId!: string;
  postId!: string;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // comment belongsTo user via userId
  user!: user;
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;
  // comment belongsTo post via postId
  post!: post;
  getPost!: Sequelize.BelongsToGetAssociationMixin<post>;
  setPost!: Sequelize.BelongsToSetAssociationMixin<post, postId>;
  createPost!: Sequelize.BelongsToCreateAssociationMixin<post>;

  static initModel(sequelize: Sequelize.Sequelize): typeof comment {
    return comment.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
          validate: {
            notEmpty: { msg: "content: Content must not be empty" },
          },
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,

          validate: {
            notNull: { msg: "userId: User ID cannot be null" },
            isUUID: {
              args: 4,
              msg: "userId: User ID must be a valid UUID",
            },
          },
        },
        postId: {
          type: DataTypes.UUID,
          allowNull: false,

          validate: {
            notNull: { msg: "postId: Post ID cannot be null" },
            isUUID: { args: 4, msg: "postId: Post ID must be a valid UUID" },
          },
        },
      },
      {
        sequelize,
        tableName: "comment",
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
            name: "commentsPostIdForeign",
            using: "BTREE",
            fields: [{ name: "postId" }],
          },
          {
            name: "commentsUserIdForeign",
            using: "BTREE",
            fields: [{ name: "userId" }],
          },
        ],
      }
    );
  }
}
