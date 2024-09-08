import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import { user, userId } from "./user";

export interface ecommerceWishlistAttributes {
  id: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ecommerceWishlistPk = "id";
export type ecommerceWishlistId = ecommerceWishlist[ecommerceWishlistPk];
export type ecommerceWishlistOptionalAttributes =
  | "id"
  | "createdAt"
  | "updatedAt";
export type ecommerceWishlistCreationAttributes = Optional<
  ecommerceWishlistAttributes,
  ecommerceWishlistOptionalAttributes
>;

export class ecommerceWishlist
  extends Model<
    ecommerceWishlistAttributes,
    ecommerceWishlistCreationAttributes
  >
  implements ecommerceWishlistAttributes
{
  id!: string;
  userId!: string;
  createdAt?: Date;
  updatedAt?: Date;

  // ecommerceWishlist belongsTo User via userId
  user!: User;
  getUser!: Sequelize.BelongsToGetAssociationMixin<User>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<User, userId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof ecommerceWishlist {
    return ecommerceWishlist.init(
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
            isUUID: { args: 4, msg: "userId: User ID must be a valid UUID" },
          },
        },
      },
      {
        sequelize,
        tableName: "ecommerce_wishlist",
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
            name: "ecommerceWishlistUserIdFkey",
            using: "BTREE",
            fields: [{ name: "userId" }],
          },
        ],
      }
    );
  }
}
