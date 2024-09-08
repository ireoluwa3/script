import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";

export interface mailwizardBlockAttributes {
  id: string;
  name: string;
  design: string;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

export type mailwizardBlockPk = "id";
export type mailwizardBlockId = mailwizardBlock[mailwizardBlockPk];
export type mailwizardBlockOptionalAttributes =
  | "id"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
export type mailwizardBlockCreationAttributes = Optional<
  mailwizardBlockAttributes,
  mailwizardBlockOptionalAttributes
>;

export class mailwizardBlock
  extends Model<mailwizardBlockAttributes, mailwizardBlockCreationAttributes>
  implements mailwizardBlockAttributes
{
  id!: string;
  name!: string;
  design!: string;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  static initModel(sequelize: Sequelize.Sequelize): typeof mailwizardBlock {
    return mailwizardBlock.init(
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
            notEmpty: { msg: "name: Name cannot be empty" },
          },
        },
        design: {
          type: DataTypes.TEXT,
          allowNull: false,
          validate: {
            notEmpty: { msg: "design: Design description cannot be empty" },
          },
        },
      },
      {
        sequelize,
        tableName: "mailwizard_block",
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
