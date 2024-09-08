import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";

export interface sliderAttributes {
  id: string;
  image: string;
  link?: string;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export type sliderPk = "id";
export type sliderId = slider[sliderPk];
export type sliderOptionalAttributes =
  | "id"
  | "link"
  | "status"
  | "createdAt"
  | "updatedAt"
  | "deletedAt";
export type sliderCreationAttributes = Optional<
  sliderAttributes,
  sliderOptionalAttributes
>;

export class slider
  extends Model<sliderAttributes, sliderCreationAttributes>
  implements sliderAttributes
{
  id!: string;
  image!: string;
  link?: string;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;

  static initModel(sequelize: Sequelize.Sequelize): typeof slider {
    return slider.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        image: {
          type: DataTypes.STRING(255),
          allowNull: false,
          validate: {
            notEmpty: { msg: "image: Image cannot be empty" },
          },
        },
        link: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        status: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.NOW,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.NOW,
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "slider",
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
