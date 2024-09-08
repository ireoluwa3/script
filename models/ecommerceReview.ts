import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { ecommerceProduct, ecommerceProductId } from "./ecommerceProduct";
import type { user, userId } from "./user";

export interface ecommerceReviewAttributes {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment?: string;
  status: boolean;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

export type ecommerceReviewPk = "id";
export type ecommerceReviewId = ecommerceReview[ecommerceReviewPk];
export type ecommerceReviewOptionalAttributes =
  | "id"
  | "comment"
  | "status"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
export type ecommerceReviewCreationAttributes = Optional<
  ecommerceReviewAttributes,
  ecommerceReviewOptionalAttributes
>;

export class ecommerceReview
  extends Model<ecommerceReviewAttributes, ecommerceReviewCreationAttributes>
  implements ecommerceReviewAttributes
{
  id!: string;
  productId!: string;
  userId!: string;
  rating!: number;
  comment?: string;
  status!: boolean;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // ecommerceReview belongsTo ecommerceProduct via productId
  product!: ecommerceProduct;
  getProduct!: Sequelize.BelongsToGetAssociationMixin<ecommerceProduct>;
  setProduct!: Sequelize.BelongsToSetAssociationMixin<
    ecommerceProduct,
    ecommerceProductId
  >;
  createProduct!: Sequelize.BelongsToCreateAssociationMixin<ecommerceProduct>;
  // ecommerceReview belongsTo user via userId
  user!: user;
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof ecommerceReview {
    return ecommerceReview.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        productId: {
          type: DataTypes.UUID,
          allowNull: false,

          validate: {
            notNull: { msg: "productId: Product ID cannot be null" },
            isUUID: {
              args: 4,
              msg: "productId: Product ID must be a valid UUID",
            },
          },
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,

          validate: {
            notNull: { msg: "userId: User ID cannot be null" },
            isUUID: { args: 4, msg: "userId: User ID must be a valid UUID" },
          },
        },
        rating: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            isInt: { msg: "rating: Rating must be an integer" },
            min: { args: [1], msg: "rating: Rating must be at least 1" },
            max: { args: [5], msg: "rating: Rating must be no more than 5" },
          },
        },
        comment: {
          type: DataTypes.STRING(191),
          allowNull: true,
          validate: {
            len: {
              args: [0, 191],
              msg: "comment: Comment cannot exceed 191 characters",
            },
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
      },
      {
        sequelize,
        tableName: "ecommerce_review",
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
            name: "ecommerceReviewProductIdUserIdUnique",
            unique: true,
            using: "BTREE",
            fields: [{ name: "productId" }, { name: "userId" }],
          },
          {
            name: "ecommerceReviewUserIdFkey",
            using: "BTREE",
            fields: [{ name: "userId" }],
          },
        ],
      }
    );
  }
}
