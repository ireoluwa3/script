import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { ecommerceProduct, ecommerceProductId } from "./ecommerceProduct";
import type {
  ecommerceWishlist,
  ecommerceWishlistId,
} from "./ecommerceWishlist";

export interface ecommerceWishlistItemAttributes {
  id: string;
  wishlistId: string;
  productId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ecommerceWishlistItemPk = "id";
export type ecommerceWishlistItemId =
  ecommerceWishlistItem[ecommerceWishlistItemPk];
export type ecommerceWishlistItemOptionalAttributes =
  | "id"
  | "createdAt"
  | "updatedAt";
export type ecommerceWishlistItemCreationAttributes = Optional<
  ecommerceWishlistItemAttributes,
  ecommerceWishlistItemOptionalAttributes
>;

export class ecommerceWishlistItem
  extends Model<
    ecommerceWishlistItemAttributes,
    ecommerceWishlistItemCreationAttributes
  >
  implements ecommerceWishlistItemAttributes
{
  id!: string;
  wishlistId!: string;
  productId!: string;
  createdAt?: Date;
  updatedAt?: Date;

  // ecommerceWishlistItem belongsTo ecommerceWishlist via wishlistId
  wishlist!: ecommerceWishlist;
  getecommerceWishlist!: Sequelize.BelongsToGetAssociationMixin<ecommerceWishlist>;
  setecommerceWishlist!: Sequelize.BelongsToSetAssociationMixin<
    ecommerceWishlist,
    ecommerceWishlistId
  >;
  createecommerceWishlist!: Sequelize.BelongsToCreateAssociationMixin<ecommerceWishlist>;
  // ecommerceWishlistItem belongsTo ecommerceProduct via productId
  product!: ecommerceProduct;
  getecommerceProduct!: Sequelize.BelongsToGetAssociationMixin<ecommerceProduct>;
  setecommerceProduct!: Sequelize.BelongsToSetAssociationMixin<
    ecommerceProduct,
    ecommerceProductId
  >;
  createecommerceProduct!: Sequelize.BelongsToCreateAssociationMixin<ecommerceProduct>;

  static initModel(
    sequelize: Sequelize.Sequelize
  ): typeof ecommerceWishlistItem {
    return ecommerceWishlistItem.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        wishlistId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        productId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: {
              args: 4,
              msg: "productId: Product ID must be a valid UUID",
            },
          },
        },
      },
      {
        sequelize,
        tableName: "ecommerce_wishlist_item",
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
            name: "ecommerceWishlistItemWishlistIdProductId",
            unique: true,
            using: "BTREE",
            fields: [{ name: "wishlistId" }, { name: "productId" }],
          },
        ],
      }
    );
  }
}
