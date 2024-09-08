import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { user, userId } from "./user";

export interface exchangeWatchlistAttributes {
  id: string;
  userId: string;
  symbol: string;
}

export type exchangeWatchlistPk = "id";
export type exchangeWatchlistId = exchangeWatchlist[exchangeWatchlistPk];
export type exchangeWatchlistOptionalAttributes = "id";
export type exchangeWatchlistCreationAttributes = Optional<
  exchangeWatchlistAttributes,
  exchangeWatchlistOptionalAttributes
>;

export class exchangeWatchlist
  extends Model<
    exchangeWatchlistAttributes,
    exchangeWatchlistCreationAttributes
  >
  implements exchangeWatchlistAttributes
{
  id!: string;
  userId!: string;
  symbol!: string;

  // exchangeWatchlist belongsTo user via userId
  user!: user;
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof exchangeWatchlist {
    return exchangeWatchlist.init(
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
        symbol: {
          type: DataTypes.STRING(191),
          allowNull: false,
          validate: {
            notEmpty: { msg: "symbol: Symbol must not be empty" },
          },
        },
      },
      {
        sequelize,
        tableName: "exchange_watchlist",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "exchangeWatchlistUserIdForeign",
            using: "BTREE",
            fields: [{ name: "userId" }],
          },
        ],
      }
    );
  }
}
