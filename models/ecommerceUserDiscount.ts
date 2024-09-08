import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type {
  ecommerceDiscount,
  ecommerceDiscountId,
} from "./ecommerceDiscount";
import type { user, userId } from "./user";

export interface ecommerceUserDiscountAttributes {
  id: string;
  userId: string;
  discountId: string;
  status: boolean;
}

export type ecommerceUserDiscountPk = "id";
export type ecommerceUserDiscountId =
  ecommerceUserDiscount[ecommerceUserDiscountPk];
export type ecommerceUserDiscountOptionalAttributes = "id" | "status";
export type ecommerceUserDiscountCreationAttributes = Optional<
  ecommerceUserDiscountAttributes,
  ecommerceUserDiscountOptionalAttributes
>;

export class ecommerceUserDiscount
  extends Model<
    ecommerceUserDiscountAttributes,
    ecommerceUserDiscountCreationAttributes
  >
  implements ecommerceUserDiscountAttributes
{
  id!: string;
  userId!: string;
  discountId!: string;
  status!: boolean;

  // ecommerceUserDiscount belongsTo ecommerceDiscount via discountId
  discount!: ecommerceDiscount;
  getDiscount!: Sequelize.BelongsToGetAssociationMixin<ecommerceDiscount>;
  setDiscount!: Sequelize.BelongsToSetAssociationMixin<
    ecommerceDiscount,
    ecommerceDiscountId
  >;
  createDiscount!: Sequelize.BelongsToCreateAssociationMixin<ecommerceDiscount>;
  // ecommerceUserDiscount belongsTo user via userId
  user!: user;
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(
    sequelize: Sequelize.Sequelize
  ): typeof ecommerceUserDiscount {
    return ecommerceUserDiscount.init(
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
        discountId: {
          type: DataTypes.UUID,
          allowNull: false,

          validate: {
            notNull: { msg: "discountId: Discount ID cannot be null" },
            isUUID: {
              args: 4,
              msg: "discountId: Discount ID must be a valid UUID",
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
        tableName: "ecommerce_user_discount",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "ecommerceUserDiscountUserIdDiscountIdUnique",
            unique: true,
            using: "BTREE",
            fields: [{ name: "userId" }, { name: "discountId" }],
          },
          {
            name: "ecommerceUserDiscountDiscountIdFkey",
            using: "BTREE",
            fields: [{ name: "discountId" }],
          },
        ],
      }
    );
  }
}
