import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { forexAccount, forexAccountId } from "./forexAccount";
import type { forexSignal, forexSignalId } from "./forexSignal";

export interface forexAccountSignalAttributes {
  forexAccountId: string;
  forexSignalId: string;
}

export type forexAccountSignalPk = "forexAccountId" | "forexSignalId";
export type forexAccountSignalId = forexAccountSignal[forexAccountSignalPk];
export type forexAccountSignalCreationAttributes = forexAccountSignalAttributes;

export class forexAccountSignal
  extends Model<
    forexAccountSignalAttributes,
    forexAccountSignalCreationAttributes
  >
  implements forexAccountSignalAttributes
{
  forexAccountId!: string;
  forexSignalId!: string;

  // forexAccountSignal belongsTo forexAccount via forexAccountId
  forexAccount!: forexAccount;
  getForexAccount!: Sequelize.BelongsToGetAssociationMixin<forexAccount>;
  setForexAccount!: Sequelize.BelongsToSetAssociationMixin<
    forexAccount,
    forexAccountId
  >;
  createForexAccount!: Sequelize.BelongsToCreateAssociationMixin<forexAccount>;
  // forexAccountSignal belongsTo forexSignal via forexSignalId
  forexSignal!: forexSignal;
  getForexSignal!: Sequelize.BelongsToGetAssociationMixin<forexSignal>;
  setForexSignal!: Sequelize.BelongsToSetAssociationMixin<
    forexSignal,
    forexSignalId
  >;
  createForexSignal!: Sequelize.BelongsToCreateAssociationMixin<forexSignal>;

  static initModel(sequelize: Sequelize.Sequelize): typeof forexAccountSignal {
    return forexAccountSignal.init(
      {
        forexAccountId: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        forexSignalId: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
        },
      },
      {
        sequelize,
        tableName: "forex_account_signal",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "forexAccountId" }, { name: "forexSignalId" }],
          },
          {
            name: "forexAccountSignalForexSignalIdFkey",
            using: "BTREE",
            fields: [{ name: "forexSignalId" }],
          },
        ],
      }
    );
  }
}
