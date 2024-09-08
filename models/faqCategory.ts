import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { faq, faqId } from "./faq";

export interface faqCategoryAttributes {
  id: string;
}

export type faqCategoryPk = "id";
export type faqCategoryId = faqCategory[faqCategoryPk];
export type faqCategoryOptionalAttributes = "id";
export type faqCategoryCreationAttributes = Optional<
  faqCategoryAttributes,
  faqCategoryOptionalAttributes
>;

export class faqCategory
  extends Model<faqCategoryAttributes, faqCategoryCreationAttributes>
  implements faqCategoryAttributes
{
  id!: string;

  // faqCategory hasMany faq via faqCategoryId
  faqs!: faq[];
  getFaqs!: Sequelize.HasManyGetAssociationsMixin<faq>;
  setFaqs!: Sequelize.HasManySetAssociationsMixin<faq, faqId>;
  addFaq!: Sequelize.HasManyAddAssociationMixin<faq, faqId>;
  addFaqs!: Sequelize.HasManyAddAssociationsMixin<faq, faqId>;
  createFaq!: Sequelize.HasManyCreateAssociationMixin<faq>;
  removeFaq!: Sequelize.HasManyRemoveAssociationMixin<faq, faqId>;
  removeFaqs!: Sequelize.HasManyRemoveAssociationsMixin<faq, faqId>;
  hasFaq!: Sequelize.HasManyHasAssociationMixin<faq, faqId>;
  hasFaqs!: Sequelize.HasManyHasAssociationsMixin<faq, faqId>;
  countFaqs!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof faqCategory {
    return faqCategory.init(
      {
        id: {
          type: DataTypes.STRING(191),
          allowNull: false,
          primaryKey: true,
        },
      },
      {
        sequelize,
        tableName: "faq_category",
        timestamps: false,
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
