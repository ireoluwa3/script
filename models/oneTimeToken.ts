import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";

export interface oneTimeTokenAttributes {
  id: string;
  tokenId: string;
  tokenType?: "RESET";
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type oneTimeTokenPk = "id";
export type oneTimeTokenId = oneTimeToken[oneTimeTokenPk];
export type oneTimeTokenOptionalAttributes =
  | "id"
  | "tokenType"
  | "createdAt"
  | "updatedAt";
export type oneTimeTokenCreationAttributes = Optional<
  oneTimeTokenAttributes,
  oneTimeTokenOptionalAttributes
>;

export class oneTimeToken
  extends Model<oneTimeTokenAttributes, oneTimeTokenCreationAttributes>
  implements oneTimeTokenAttributes
{
  id!: string;
  tokenId!: string;
  tokenType?: "RESET";
  expiresAt!: Date;
  createdAt?: Date;
  updatedAt?: Date;

  static initModel(sequelize: Sequelize.Sequelize): typeof oneTimeToken {
    return oneTimeToken.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        tokenId: {
          type: DataTypes.STRING(60),
          allowNull: false,
          validate: {
            notEmpty: { msg: "tokenId: Token ID cannot be empty" },
          },
        },
        tokenType: {
          type: DataTypes.ENUM("RESET"),
          allowNull: true,
          validate: {
            isIn: {
              args: [["RESET"]],
              msg: "tokenType: Token type must be RESET",
            },
          },
        },
        expiresAt: {
          type: DataTypes.DATE,
          allowNull: false,
          validate: {
            isDate: {
              msg: "expiresAt: Expires At must be a valid date",
              args: true,
            },
          },
        },
      },
      {
        sequelize,
        tableName: "one_time_token",
        timestamps: true,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "tokenId",
            unique: true,
            using: "BTREE",
            fields: [{ name: "tokenId" }],
          },
        ],
      }
    );
  }
}
