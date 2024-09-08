import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { wallet, walletId } from "./wallet";

export interface ecosystemPrivateLedgerAttributes {
  id: string;
  walletId: string;
  index: number;
  currency: string;
  chain: string;
  network: string;
  offchainDifference: number;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

export type ecosystemPrivateLedgerPk = "id";
export type ecosystemPrivateLedgerId =
  ecosystemPrivateLedger[ecosystemPrivateLedgerPk];
export type ecosystemPrivateLedgerOptionalAttributes =
  | "id"
  | "network"
  | "offchainDifference"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
export type ecosystemPrivateLedgerCreationAttributes = Optional<
  ecosystemPrivateLedgerAttributes,
  ecosystemPrivateLedgerOptionalAttributes
>;

export class ecosystemPrivateLedger
  extends Model<
    ecosystemPrivateLedgerAttributes,
    ecosystemPrivateLedgerCreationAttributes
  >
  implements ecosystemPrivateLedgerAttributes
{
  id!: string;
  walletId!: string;
  index!: number;
  currency!: string;
  chain!: string;
  network!: string;
  offchainDifference!: number;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // ecosystemPrivateLedger belongsTo wallet via walletId
  wallet!: wallet;
  getWallet!: Sequelize.BelongsToGetAssociationMixin<wallet>;
  setWallet!: Sequelize.BelongsToSetAssociationMixin<wallet, walletId>;
  createWallet!: Sequelize.BelongsToCreateAssociationMixin<wallet>;

  static initModel(
    sequelize: Sequelize.Sequelize
  ): typeof ecosystemPrivateLedger {
    return ecosystemPrivateLedger.init(
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
        index: {
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            isInt: { msg: "index: Index must be an integer" },
          },
        },
        currency: {
          type: DataTypes.STRING(50),
          allowNull: false,
          validate: {
            notEmpty: { msg: "currency: Currency must not be empty" },
          },
        },
        chain: {
          type: DataTypes.STRING(50),
          allowNull: false,
          validate: {
            notEmpty: { msg: "chain: Chain must not be empty" },
          },
        },
        network: {
          type: DataTypes.STRING(50),
          allowNull: false,
          defaultValue: "mainnet",
          validate: {
            notEmpty: { msg: "network: Network must not be empty" },
          },
        },
        offchainDifference: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          defaultValue: 0,
          validate: {
            isNumeric: {
              msg: "offchainDifference: Offchain Difference must be a number",
            },
          },
        },
      },
      {
        sequelize,
        tableName: "ecosystem_private_ledger",
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
            name: "uniqueEcosystemPrivateLedger",
            unique: true,
            using: "BTREE",
            fields: [
              { name: "walletId" },
              { name: "index" },
              { name: "currency" },
              { name: "chain" },
              { name: "network" },
            ],
          },
        ],
      }
    );
  }
}
