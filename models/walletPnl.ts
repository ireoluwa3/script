import { userId } from "./user";
import { DataTypes, Model, Optional } from "sequelize";
import type { Sequelize } from "sequelize";

export interface walletPnlAttributes {
  id: string;
  userId: string;
  balances: {
    FIAT: number;
    SPOT: number;
    ECO: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export type walletPnlOptionalAttributes =
  | "id"
  | "balances"
  | "createdAt"
  | "updatedAt";
export type walletPnlCreationAttributes = Optional<
  walletPnlAttributes,
  walletPnlOptionalAttributes
>;

export class walletPnl
  extends Model<walletPnlAttributes, walletPnlCreationAttributes>
  implements walletPnlAttributes
{
  id!: string;
  userId!: string;
  balances!: {
    FIAT: number;
    SPOT: number;
    ECO: number;
  };
  createdAt?: Date;
  updatedAt?: Date;

  static initModel(sequelize: Sequelize): typeof walletPnl {
    return walletPnl.init(
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
            isUUID: {
              args: 4,
              msg: "userId: User ID must be a valid UUID",
            },
          },
        },
        balances: {
          type: DataTypes.JSON,
          allowNull: true,
          get() {
            const rawData = this.getDataValue("balances");
            // Parse the JSON string back into an object
            return rawData ? JSON.parse(rawData as any) : null;
          },
        },
      },
      {
        sequelize,
        tableName: "wallet_pnl",
        timestamps: true,
      }
    );
  }
}
