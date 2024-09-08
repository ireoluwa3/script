import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";

export interface supportTicketAttributes {
  id: string;
  userId: string;
  agentId?: string;
  subject: string;
  importance: "LOW" | "MEDIUM" | "HIGH";
  status: "PENDING" | "OPEN" | "REPLIED" | "CLOSED";
  messages?: ChatMessage[];
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

export type supportTicketPk = "id";
export type supportTicketId = supportTicket[supportTicketPk];
export type supportTicketOptionalAttributes =
  | "id"
  | "agentId"
  | "importance"
  | "status"
  | "messages"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
export type supportTicketCreationAttributes = Optional<
  supportTicketAttributes,
  supportTicketOptionalAttributes
>;

export class supportTicket
  extends Model<supportTicketAttributes, supportTicketCreationAttributes>
  implements supportTicketAttributes
{
  id!: string;
  userId!: string;
  agentId?: string;
  subject!: string;
  importance!: "LOW" | "MEDIUM" | "HIGH";
  status!: "PENDING" | "OPEN" | "REPLIED" | "CLOSED";
  messages?: ChatMessage[];
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  static initModel(sequelize: Sequelize.Sequelize): typeof supportTicket {
    return supportTicket.init(
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
        agentId: {
          type: DataTypes.UUID,
          allowNull: true,
          validate: {
            isUUID: { args: 4, msg: "agentId: Agent ID must be a valid UUID" },
          },
        },
        subject: {
          type: DataTypes.STRING(191),
          allowNull: false,
          validate: {
            notEmpty: { msg: "subject: Subject cannot be empty" },
          },
        },
        importance: {
          type: DataTypes.ENUM("LOW", "MEDIUM", "HIGH"),
          allowNull: false,
          defaultValue: "LOW",
          validate: {
            isIn: {
              args: [["LOW", "MEDIUM", "HIGH"]],
              msg: "importance: Importance must be one of ['LOW', 'MEDIUM', 'HIGH']",
            },
          },
        },
        messages: {
          type: DataTypes.JSON,
          allowNull: true,
          get() {
            const value = this.getDataValue("messages");
            return value ? JSON.parse(value as any) : null;
          },
        },
        status: {
          type: DataTypes.ENUM("PENDING", "OPEN", "REPLIED", "CLOSED"),
          allowNull: false,
          defaultValue: "PENDING",
          validate: {
            isIn: {
              args: [["PENDING", "OPEN", "REPLIED", "CLOSED"]],
              msg: "status: Status must be one of ['PENDING', 'OPEN', 'REPLIED', 'CLOSED']",
            },
          },
        },
      },
      {
        sequelize,
        tableName: "support_ticket",
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
            name: "agentId",
            using: "BTREE",
            fields: [{ name: "agentId" }],
          },
          {
            name: "supportTicketUserIdForeign",
            using: "BTREE",
            fields: [{ name: "userId" }],
          },
        ],
      }
    );
  }
}
