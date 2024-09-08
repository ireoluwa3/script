import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { p2pOffer, p2pOfferId } from "./p2pOffer";
import type { user, userId } from "./user";

export interface p2pReviewAttributes {
  id: string;
  reviewerId: string;
  reviewedId: string;
  offerId: string;
  rating: number;
  comment?: string;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

export type p2pReviewPk = "id";
export type p2pReviewId = p2pReview[p2pReviewPk];
export type p2pReviewOptionalAttributes =
  | "id"
  | "comment"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
export type p2pReviewCreationAttributes = Optional<
  p2pReviewAttributes,
  p2pReviewOptionalAttributes
>;

export class p2pReview
  extends Model<p2pReviewAttributes, p2pReviewCreationAttributes>
  implements p2pReviewAttributes
{
  id!: string;
  reviewerId!: string;
  reviewedId!: string;
  offerId!: string;
  rating!: number;
  comment?: string;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // p2pReview belongsTo p2pOffer via offerId
  offer!: p2pOffer;
  getOffer!: Sequelize.BelongsToGetAssociationMixin<p2pOffer>;
  setOffer!: Sequelize.BelongsToSetAssociationMixin<p2pOffer, p2pOfferId>;
  createOffer!: Sequelize.BelongsToCreateAssociationMixin<p2pOffer>;
  // p2pReview belongsTo user via reviewerId
  reviewer!: user;
  getReviewer!: Sequelize.BelongsToGetAssociationMixin<user>;
  setReviewer!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createReviewer!: Sequelize.BelongsToCreateAssociationMixin<user>;
  // p2pReview belongsTo user via reviewedId
  reviewed!: user;
  getReviewed!: Sequelize.BelongsToGetAssociationMixin<user>;
  setReviewed!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createReviewed!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof p2pReview {
    return p2pReview.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        reviewerId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: {
              args: 4,
              msg: "reviewerId: Reviewer ID must be a valid UUID",
            },
          },
        },
        reviewedId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: {
              args: 4,
              msg: "reviewedId: Reviewed ID must be a valid UUID",
            },
          },
        },
        offerId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        rating: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            isInt: { msg: "rating: Rating must be an integer" },
          },
        },
        comment: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "p2p_review",
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
            name: "p2pReviewReviewerIdReviewedIdOfferIdKey",
            unique: true,
            using: "BTREE",
            fields: [
              { name: "reviewerId" },
              { name: "reviewedId" },
              { name: "offerId" },
            ],
          },
          {
            name: "p2pReviewReviewedIdFkey",
            using: "BTREE",
            fields: [{ name: "reviewedId" }],
          },
          {
            name: "p2pReviewOfferIdFkey",
            using: "BTREE",
            fields: [{ name: "offerId" }],
          },
        ],
      }
    );
  }
}
