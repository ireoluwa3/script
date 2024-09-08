import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type {
  ecosystemPrivateLedger,
  ecosystemPrivateLedgerId,
} from "./ecosystemPrivateLedger";
import type { ecosystemUtxo, ecosystemUtxoId } from "./ecosystemUtxo";
import type { investment, investmentId } from "./investment";
import type { transaction, transactionId } from "./transaction";
import type { user, userId } from "./user";
import type { walletData, walletDataId } from "./walletData";

export interface walletAttributes {
  id: string;
  userId: string;
  type: "FIAT" | "SPOT" | "ECO" | "FUTURES";
  currency: string;
  balance: number;
  inOrder?: number;
  address?: {
    [key: string]: { address: string; network: string; balance: number };
  };
  status: boolean;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

export type walletPk = "id";
export type walletId = wallet[walletPk];
export type walletOptionalAttributes =
  | "id"
  | "balance"
  | "inOrder"
  | "address"
  | "status"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
export type walletCreationAttributes = Optional<
  walletAttributes,
  walletOptionalAttributes
>;

export class wallet
  extends Model<walletAttributes, walletCreationAttributes>
  implements walletAttributes
{
  id!: string;
  userId!: string;
  type!: "FIAT" | "SPOT" | "ECO" | "FUTURES";
  currency!: string;
  balance!: number;
  inOrder?: number;
  address?: {
    [key: string]: { address: string; network: string; balance: number };
  };
  status!: boolean;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // wallet belongsTo user via userId
  user!: user;
  getUser!: Sequelize.BelongsToGetAssociationMixin<user>;
  setUser!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createUser!: Sequelize.BelongsToCreateAssociationMixin<user>;
  // wallet hasMany ecosystemPrivateLedger via walletId
  ecosystemPrivateLedgers!: ecosystemPrivateLedger[];
  getEcosystemPrivateLedgers!: Sequelize.HasManyGetAssociationsMixin<ecosystemPrivateLedger>;
  setEcosystemPrivateLedgers!: Sequelize.HasManySetAssociationsMixin<
    ecosystemPrivateLedger,
    ecosystemPrivateLedgerId
  >;
  addEcosystemPrivateLedger!: Sequelize.HasManyAddAssociationMixin<
    ecosystemPrivateLedger,
    ecosystemPrivateLedgerId
  >;
  addEcosystemPrivateLedgers!: Sequelize.HasManyAddAssociationsMixin<
    ecosystemPrivateLedger,
    ecosystemPrivateLedgerId
  >;
  createEcosystemPrivateLedger!: Sequelize.HasManyCreateAssociationMixin<ecosystemPrivateLedger>;
  removeEcosystemPrivateLedger!: Sequelize.HasManyRemoveAssociationMixin<
    ecosystemPrivateLedger,
    ecosystemPrivateLedgerId
  >;
  removeEcosystemPrivateLedgers!: Sequelize.HasManyRemoveAssociationsMixin<
    ecosystemPrivateLedger,
    ecosystemPrivateLedgerId
  >;
  hasEcosystemPrivateLedger!: Sequelize.HasManyHasAssociationMixin<
    ecosystemPrivateLedger,
    ecosystemPrivateLedgerId
  >;
  hasEcosystemPrivateLedgers!: Sequelize.HasManyHasAssociationsMixin<
    ecosystemPrivateLedger,
    ecosystemPrivateLedgerId
  >;
  countEcosystemPrivateLedgers!: Sequelize.HasManyCountAssociationsMixin;
  // wallet hasMany ecosystemUtxo via walletId
  ecosystemUtxos!: ecosystemUtxo[];
  getEcosystemUtxos!: Sequelize.HasManyGetAssociationsMixin<ecosystemUtxo>;
  setEcosystemUtxos!: Sequelize.HasManySetAssociationsMixin<
    ecosystemUtxo,
    ecosystemUtxoId
  >;
  addEcosystemUtxo!: Sequelize.HasManyAddAssociationMixin<
    ecosystemUtxo,
    ecosystemUtxoId
  >;
  addEcosystemUtxos!: Sequelize.HasManyAddAssociationsMixin<
    ecosystemUtxo,
    ecosystemUtxoId
  >;
  createEcosystemUtxo!: Sequelize.HasManyCreateAssociationMixin<ecosystemUtxo>;
  removeEcosystemUtxo!: Sequelize.HasManyRemoveAssociationMixin<
    ecosystemUtxo,
    ecosystemUtxoId
  >;
  removeEcosystemUtxos!: Sequelize.HasManyRemoveAssociationsMixin<
    ecosystemUtxo,
    ecosystemUtxoId
  >;
  hasEcosystemUtxo!: Sequelize.HasManyHasAssociationMixin<
    ecosystemUtxo,
    ecosystemUtxoId
  >;
  hasEcosystemUtxos!: Sequelize.HasManyHasAssociationsMixin<
    ecosystemUtxo,
    ecosystemUtxoId
  >;
  countEcosystemUtxos!: Sequelize.HasManyCountAssociationsMixin;
  // wallet hasMany investment via walletId
  investments!: investment[];
  getInvestments!: Sequelize.HasManyGetAssociationsMixin<investment>;
  setInvestments!: Sequelize.HasManySetAssociationsMixin<
    investment,
    investmentId
  >;
  addInvestment!: Sequelize.HasManyAddAssociationMixin<
    investment,
    investmentId
  >;
  addInvestments!: Sequelize.HasManyAddAssociationsMixin<
    investment,
    investmentId
  >;
  createInvestment!: Sequelize.HasManyCreateAssociationMixin<investment>;
  removeInvestment!: Sequelize.HasManyRemoveAssociationMixin<
    investment,
    investmentId
  >;
  removeInvestments!: Sequelize.HasManyRemoveAssociationsMixin<
    investment,
    investmentId
  >;
  hasInvestment!: Sequelize.HasManyHasAssociationMixin<
    investment,
    investmentId
  >;
  hasInvestments!: Sequelize.HasManyHasAssociationsMixin<
    investment,
    investmentId
  >;
  countInvestments!: Sequelize.HasManyCountAssociationsMixin;
  // wallet hasMany transaction via walletId
  transactions!: transaction[];
  getTransactions!: Sequelize.HasManyGetAssociationsMixin<transaction>;
  setTransactions!: Sequelize.HasManySetAssociationsMixin<
    transaction,
    transactionId
  >;
  addTransaction!: Sequelize.HasManyAddAssociationMixin<
    transaction,
    transactionId
  >;
  addTransactions!: Sequelize.HasManyAddAssociationsMixin<
    transaction,
    transactionId
  >;
  createTransaction!: Sequelize.HasManyCreateAssociationMixin<transaction>;
  removeTransaction!: Sequelize.HasManyRemoveAssociationMixin<
    transaction,
    transactionId
  >;
  removeTransactions!: Sequelize.HasManyRemoveAssociationsMixin<
    transaction,
    transactionId
  >;
  hasTransaction!: Sequelize.HasManyHasAssociationMixin<
    transaction,
    transactionId
  >;
  hasTransactions!: Sequelize.HasManyHasAssociationsMixin<
    transaction,
    transactionId
  >;
  countTransactions!: Sequelize.HasManyCountAssociationsMixin;
  // wallet hasMany walletData via walletId
  walletData!: walletData[];
  getWalletData!: Sequelize.HasManyGetAssociationsMixin<walletData>;
  setWalletData!: Sequelize.HasManySetAssociationsMixin<
    walletData,
    walletDataId
  >;
  addWalletDatum!: Sequelize.HasManyAddAssociationMixin<
    walletData,
    walletDataId
  >;
  addWalletData!: Sequelize.HasManyAddAssociationsMixin<
    walletData,
    walletDataId
  >;
  createWalletDatum!: Sequelize.HasManyCreateAssociationMixin<walletData>;
  removeWalletDatum!: Sequelize.HasManyRemoveAssociationMixin<
    walletData,
    walletDataId
  >;
  removeWalletData!: Sequelize.HasManyRemoveAssociationsMixin<
    walletData,
    walletDataId
  >;
  hasWalletDatum!: Sequelize.HasManyHasAssociationMixin<
    walletData,
    walletDataId
  >;
  hasWalletData!: Sequelize.HasManyHasAssociationsMixin<
    walletData,
    walletDataId
  >;
  countWalletData!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof wallet {
    return wallet.init(
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
        type: {
          type: DataTypes.ENUM("FIAT", "SPOT", "ECO", "FUTURES"),
          allowNull: false,
          validate: {
            isIn: {
              args: [["FIAT", "SPOT", "ECO", "FUTURES"]],
              msg: "type: Type must be one of ['FIAT', 'SPOT', 'ECO', 'FUTURES']",
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
        balance: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          defaultValue: 0,
          validate: {
            isFloat: { msg: "balance: Balance must be a number" },
          },
        },
        inOrder: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          defaultValue: 0,
        },
        address: {
          type: DataTypes.JSON,
          allowNull: true,
          get() {
            const rawData = this.getDataValue("address");
            // Parse the JSON string back into an object
            return rawData ? JSON.parse(rawData as any) : null;
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
        tableName: "wallet",
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
            name: "walletIdKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "walletUserIdCurrencyTypeKey",
            unique: true,
            using: "BTREE",
            fields: [
              { name: "userId" },
              { name: "currency" },
              { name: "type" },
            ],
          },
        ],
      }
    );
  }
}
