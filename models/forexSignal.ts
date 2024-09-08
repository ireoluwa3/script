import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { forexAccount, forexAccountId } from "./forexAccount";
import type {
  forexAccountSignal,
  forexAccountSignalId,
} from "./forexAccountSignal";

export interface forexSignalAttributes {
  id: string;
  title: string;
  image: string;
  status: boolean;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

export type forexSignalPk = "id";
export type forexSignalId = forexSignal[forexSignalPk];
export type forexSignalOptionalAttributes =
  | "id"
  | "status"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
export type forexSignalCreationAttributes = Optional<
  forexSignalAttributes,
  forexSignalOptionalAttributes
>;

export class forexSignal
  extends Model<forexSignalAttributes, forexSignalCreationAttributes>
  implements forexSignalAttributes
{
  id!: string;
  title!: string;
  image!: string;
  status!: boolean;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // forexSignal belongsToMany forexAccount via forexSignalId and forexAccountId
  forexAccountIdForexAccounts!: forexAccount[];
  getForexAccountIdForexAccounts!: Sequelize.BelongsToManyGetAssociationsMixin<forexAccount>;
  setForexAccountIdForexAccounts!: Sequelize.BelongsToManySetAssociationsMixin<
    forexAccount,
    forexAccountId
  >;
  addForexAccountIdForexAccount!: Sequelize.BelongsToManyAddAssociationMixin<
    forexAccount,
    forexAccountId
  >;
  addForexAccountIdForexAccounts!: Sequelize.BelongsToManyAddAssociationsMixin<
    forexAccount,
    forexAccountId
  >;
  createForexAccountIdForexAccount!: Sequelize.BelongsToManyCreateAssociationMixin<forexAccount>;
  removeForexAccountIdForexAccount!: Sequelize.BelongsToManyRemoveAssociationMixin<
    forexAccount,
    forexAccountId
  >;
  removeForexAccountIdForexAccounts!: Sequelize.BelongsToManyRemoveAssociationsMixin<
    forexAccount,
    forexAccountId
  >;
  hasForexAccountIdForexAccount!: Sequelize.BelongsToManyHasAssociationMixin<
    forexAccount,
    forexAccountId
  >;
  hasForexAccountIdForexAccounts!: Sequelize.BelongsToManyHasAssociationsMixin<
    forexAccount,
    forexAccountId
  >;
  countForexAccountIdForexAccounts!: Sequelize.BelongsToManyCountAssociationsMixin;
  // forexSignal hasMany forexAccountSignal via forexSignalId
  forexAccountSignals!: forexAccountSignal[];
  getForexAccountSignals!: Sequelize.HasManyGetAssociationsMixin<forexAccountSignal>;
  setForexAccountSignals!: Sequelize.HasManySetAssociationsMixin<
    forexAccountSignal,
    forexAccountSignalId
  >;
  addForexAccountSignal!: Sequelize.HasManyAddAssociationMixin<
    forexAccountSignal,
    forexAccountSignalId
  >;
  addForexAccountSignals!: Sequelize.HasManyAddAssociationsMixin<
    forexAccountSignal,
    forexAccountSignalId
  >;
  createForexAccountSignal!: Sequelize.HasManyCreateAssociationMixin<forexAccountSignal>;
  removeForexAccountSignal!: Sequelize.HasManyRemoveAssociationMixin<
    forexAccountSignal,
    forexAccountSignalId
  >;
  removeForexAccountSignals!: Sequelize.HasManyRemoveAssociationsMixin<
    forexAccountSignal,
    forexAccountSignalId
  >;
  hasForexAccountSignal!: Sequelize.HasManyHasAssociationMixin<
    forexAccountSignal,
    forexAccountSignalId
  >;
  hasForexAccountSignals!: Sequelize.HasManyHasAssociationsMixin<
    forexAccountSignal,
    forexAccountSignalId
  >;
  countForexAccountSignals!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof forexSignal {
    return forexSignal.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING(191),
          allowNull: false,
          validate: {
            notEmpty: { msg: "title: Title cannot be empty" },
          },
        },
        image: {
          type: DataTypes.STRING(191),
          allowNull: false,
          validate: {
            notEmpty: { msg: "image: Image cannot be empty" },
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
        tableName: "forex_signal",
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
