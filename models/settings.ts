import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";

export interface settingsAttributes {
  key: string;
  value: string | null;
}

export type settingsPk = "key";
export type settingsId = settings[settingsPk];
export type settingsCreationAttributes = settingsAttributes;

export class settings
  extends Model<settingsAttributes, settingsCreationAttributes>
  implements settingsAttributes
{
  key!: string;
  value!: string | null;

  static initModel(sequelize: Sequelize.Sequelize): typeof settings {
    return settings.init(
      {
        key: {
          type: DataTypes.STRING(255),
          allowNull: false,
          primaryKey: true,
        },
        value: {
          type: DataTypes.TEXT("long"),
          allowNull: true,
          validate: {
            notEmpty: { msg: "value: Value cannot be empty" },
          },
        },
      },
      {
        sequelize,
        tableName: "settings",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "key" }],
          },
        ],
      }
    );
  }
}
