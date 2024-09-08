import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { wallet, walletId } from "./wallet";

export interface walletDataAttributes {
  id: string;
  walletId: string;
  currency: string;
  chain: string;
  balance: number;
  index: number;
  data: string;
}

export type walletDataPk = "id";
export type walletDataId = walletData[walletDataPk];
export type walletDataOptionalAttributes = "id" | "balance";
export type walletDataCreationAttributes = Optional<
  walletDataAttributes,
  walletDataOptionalAttributes
>;

export class walletData
  extends Model<walletDataAttributes, walletDataCreationAttributes>
  implements walletDataAttributes
{
  id!: string;
  walletId!: string;
  currency!: string;
  chain!: string;
  balance!: number;
  index!: number;
  data!: string;

  // walletData belongsTo wallet via walletId
  wallet!: wallet;
  getWallet!: Sequelize.BelongsToGetAssociationMixin<wallet>;
  setWallet!: Sequelize.BelongsToSetAssociationMixin<wallet, walletId>;
  createWallet!: Sequelize.BelongsToCreateAssociationMixin<wallet>;

  static initModel(sequelize: Sequelize.Sequelize): typeof walletData {
    return walletData.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        walletId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: {
              args: 4,
              msg: "walletId: Wallet ID must be a valid UUID",
            },
          },
        },
        currency: {
          type: DataTypes.STRING(255),
          allowNull: false,
          validate: {
            notEmpty: { msg: "currency: Currency cannot be empty" },
          },
        },
        chain: {
          type: DataTypes.STRING(255),
          allowNull: false,
          validate: {
            notEmpty: { msg: "chain: Chain cannot be empty" },
          },
        },
        balance: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          defaultValue: 0,
          validate: {
            isFloat: { msg: "balance: Balance must be a number" },
          },
        },
        index: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            isInt: { msg: "index: Index must be an integer" },
          },
        },
        data: {
          type: DataTypes.TEXT,
          allowNull: false,
          validate: {
            notEmpty: { msg: "data: Data cannot be empty" },
          },
        },
      },
      {
        sequelize,
        tableName: "wallet_data",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "walletDataWalletIdCurrencyChainKey",
            unique: true,
            using: "BTREE",
            fields: [
              { name: "walletId" },
              { name: "currency" },
              { name: "chain" },
            ],
          },
        ],
      }
    );
  }
}
