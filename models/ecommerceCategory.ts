import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { ecommerceProduct, ecommerceProductId } from "./ecommerceProduct";

export interface ecommerceCategoryAttributes {
  id: string;
  name: string;
  description: string;
  image?: string;
  status: boolean;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

export type ecommerceCategoryPk = "id";
export type ecommerceCategoryId = ecommerceCategory[ecommerceCategoryPk];
export type ecommerceCategoryOptionalAttributes =
  | "id"
  | "image"
  | "status"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
export type ecommerceCategoryCreationAttributes = Optional<
  ecommerceCategoryAttributes,
  ecommerceCategoryOptionalAttributes
>;

export class ecommerceCategory
  extends Model<
    ecommerceCategoryAttributes,
    ecommerceCategoryCreationAttributes
  >
  implements ecommerceCategoryAttributes
{
  id!: string;
  name!: string;
  description!: string;
  image?: string;
  status!: boolean;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // ecommerceCategory hasMany ecommerceProduct via categoryId
  ecommerceProducts!: ecommerceProduct[];
  getEcommerceProducts!: Sequelize.HasManyGetAssociationsMixin<ecommerceProduct>;
  setEcommerceProducts!: Sequelize.HasManySetAssociationsMixin<
    ecommerceProduct,
    ecommerceProductId
  >;
  addEcommerceProduct!: Sequelize.HasManyAddAssociationMixin<
    ecommerceProduct,
    ecommerceProductId
  >;
  addEcommerceProducts!: Sequelize.HasManyAddAssociationsMixin<
    ecommerceProduct,
    ecommerceProductId
  >;
  createEcommerceProduct!: Sequelize.HasManyCreateAssociationMixin<ecommerceProduct>;
  removeEcommerceProduct!: Sequelize.HasManyRemoveAssociationMixin<
    ecommerceProduct,
    ecommerceProductId
  >;
  removeEcommerceProducts!: Sequelize.HasManyRemoveAssociationsMixin<
    ecommerceProduct,
    ecommerceProductId
  >;
  hasEcommerceProduct!: Sequelize.HasManyHasAssociationMixin<
    ecommerceProduct,
    ecommerceProductId
  >;
  hasEcommerceProducts!: Sequelize.HasManyHasAssociationsMixin<
    ecommerceProduct,
    ecommerceProductId
  >;
  countEcommerceProducts!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof ecommerceCategory {
    return ecommerceCategory.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING(191),
          allowNull: false,
          validate: {
            notEmpty: { msg: "name: Name must not be empty" },
          },
        },
        description: {
          type: DataTypes.STRING(191),
          allowNull: false,
          validate: {
            notEmpty: { msg: "description: Description must not be empty" },
          },
        },
        image: {
          type: DataTypes.STRING(191),
          allowNull: true,
          validate: {
            is: {
              args: ["^/(uploads|img)/.*$", "i"],
              msg: "image: Image must be a valid URL",
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
        tableName: "ecommerce_category",
        timestamps: true,
        paranoid: true,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
        ],
      }
    );
  }
}
