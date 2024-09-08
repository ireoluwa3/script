import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";

export interface currencyAttributes {
  id: string;
  name: string;
  symbol: string;
  precision: number;
  price?: number | null;
  status: boolean;
}

export type currencyPk = "id";
export type currencyId = currency[currencyPk];
export type currencyOptionalAttributes = "id" | "price";
export type currencyCreationAttributes = Optional<
  currencyAttributes,
  currencyOptionalAttributes
>;

export class currency
  extends Model<currencyAttributes, currencyCreationAttributes>
  implements currencyAttributes
{
  id!: string;
  name!: string;
  symbol!: string;
  precision!: number;
  price?: number | null;
  status!: boolean;

  static initModel(sequelize: Sequelize.Sequelize): typeof currency {
    return currency.init(
      {
        id: {
          type: DataTypes.STRING(191),
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
        symbol: {
          type: DataTypes.STRING(191),
          allowNull: false,
          validate: {
            notEmpty: { msg: "symbol: Symbol must not be empty" },
          },
        },
        precision: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isFloat: { msg: "precision: Precision must be a valid number" },
            min: { args: [0], msg: "precision: Precision cannot be negative" },
          },
        },
        price: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          validate: {
            isFloat: { msg: "price: Price must be a valid number" },
            min: { args: [0], msg: "price: Price cannot be negative" },
          },
        },
        status: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          validate: {
            notNull: { msg: "status: Status cannot be null" },
          },
        },
      },
      {
        sequelize,
        tableName: "currency",
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
