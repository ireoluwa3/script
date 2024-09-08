import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { wallet, walletId } from "./wallet";

export interface ecosystemUtxoAttributes {
  id: string;
  walletId: string;
  transactionId: string;
  index: number;
  amount: number;
  script: string;
  status: boolean;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

export type ecosystemUtxoPk = "id";
export type ecosystemUtxoId = ecosystemUtxo[ecosystemUtxoPk];
export type ecosystemUtxoOptionalAttributes =
  | "id"
  | "status"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
export type ecosystemUtxoCreationAttributes = Optional<
  ecosystemUtxoAttributes,
  ecosystemUtxoOptionalAttributes
>;

export class ecosystemUtxo
  extends Model<ecosystemUtxoAttributes, ecosystemUtxoCreationAttributes>
  implements ecosystemUtxoAttributes
{
  id!: string;
  walletId!: string;
  transactionId!: string;
  index!: number;
  amount!: number;
  script!: string;
  status!: boolean;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // ecosystemUtxo belongsTo wallet via walletId
  wallet!: wallet;
  getWallet!: Sequelize.BelongsToGetAssociationMixin<wallet>;
  setWallet!: Sequelize.BelongsToSetAssociationMixin<wallet, walletId>;
  createWallet!: Sequelize.BelongsToCreateAssociationMixin<wallet>;

  static initModel(sequelize: Sequelize.Sequelize): typeof ecosystemUtxo {
    return ecosystemUtxo.init(
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
            notNull: { msg: "walletId: Wallet ID cannot be null" },
            isUUID: {
              args: 4,
              msg: "walletId: Wallet ID must be a valid UUID",
            },
          },
        },
        transactionId: {
          type: DataTypes.STRING(255),
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "transactionId: Transaction ID must not be empty",
            },
          },
        },
        index: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            isInt: { msg: "index: Index must be an integer" },
          },
        },
        amount: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isNumeric: { msg: "amount: Amount must be a number" },
          },
        },
        script: {
          type: DataTypes.STRING(1000),
          allowNull: false,
          validate: {
            notEmpty: { msg: "script: Script must not be empty" },
          },
        },
        status: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          validate: {
            isBoolean: { msg: "status: Status must be a boolean value" },
          },
        },
      },
      {
        sequelize,
        tableName: "ecosystem_utxo",
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
            name: "ecosystemUtxoWalletIdIdx",
            using: "BTREE",
            fields: [{ name: "walletId" }],
          },
        ],
      }
    );
  }
}
