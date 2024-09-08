import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type {
  mlmBinaryNode,
  mlmBinaryNodeCreationAttributes,
  mlmBinaryNodeId,
} from "./mlmBinaryNode";
import type {
  mlmUnilevelNode,
  mlmUnilevelNodeCreationAttributes,
  mlmUnilevelNodeId,
} from "./mlmUnilevelNode";
import type { user, userId } from "./user";

export interface mlmReferralAttributes {
  id: string;
  status: "PENDING" | "ACTIVE" | "REJECTED";
  referrerId: string;
  referredId: string;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

export type mlmReferralPk = "id";
export type mlmReferralId = mlmReferral[mlmReferralPk];
export type mlmReferralOptionalAttributes =
  | "id"
  | "status"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
export type mlmReferralCreationAttributes = Optional<
  mlmReferralAttributes,
  mlmReferralOptionalAttributes
>;

export class mlmReferral
  extends Model<mlmReferralAttributes, mlmReferralCreationAttributes>
  implements mlmReferralAttributes
{
  id!: string;
  status!: "PENDING" | "ACTIVE" | "REJECTED";
  referrerId!: string;
  referredId!: string;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // mlmReferral hasOne mlmBinaryNode via referralId
  mlmBinaryNode!: mlmBinaryNode;
  getMlmBinaryNode!: Sequelize.HasOneGetAssociationMixin<mlmBinaryNode>;
  setMlmBinaryNode!: Sequelize.HasOneSetAssociationMixin<
    mlmBinaryNode,
    mlmBinaryNodeId
  >;
  createMlmBinaryNode!: Sequelize.HasOneCreateAssociationMixin<mlmBinaryNode>;
  // mlmReferral hasOne mlmUnilevelNode via referralId
  mlmUnilevelNode!: mlmUnilevelNode;
  getMlmUnilevelNode!: Sequelize.HasOneGetAssociationMixin<mlmUnilevelNode>;
  setMlmUnilevelNode!: Sequelize.HasOneSetAssociationMixin<
    mlmUnilevelNode,
    mlmUnilevelNodeId
  >;
  createMlmUnilevelNode!: Sequelize.HasOneCreateAssociationMixin<mlmUnilevelNode>;
  // mlmReferral belongsTo user via referrerId
  referrerUu!: user;
  getReferrerUu!: Sequelize.BelongsToGetAssociationMixin<user>;
  setReferrerUu!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createReferrerUu!: Sequelize.BelongsToCreateAssociationMixin<user>;
  // mlmReferral belongsTo user via referredId
  referredUu!: user;
  getReferredUu!: Sequelize.BelongsToGetAssociationMixin<user>;
  setReferredUu!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createReferredUu!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof mlmReferral {
    return mlmReferral.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        referrerId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: {
              args: 4,
              msg: "referrerId: Referrer ID must be a valid UUID",
            },
          },
        },
        referredId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: {
              args: 4,
              msg: "referredId: Referred ID must be a valid UUID",
            },
          },
        },
        status: {
          type: DataTypes.ENUM("PENDING", "ACTIVE", "REJECTED"),
          allowNull: false,
          defaultValue: "PENDING",
          validate: {
            isIn: {
              args: [["PENDING", "ACTIVE", "REJECTED"]],
              msg: "status: Status must be one of PENDING, ACTIVE, REJECTED",
            },
          },
        },
      },
      {
        sequelize,
        tableName: "mlm_referral",
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
            name: "mlmReferralReferredIdKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "referredId" }],
          },
          {
            name: "mlmReferralReferrerIdReferredIdKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "referrerId" }, { name: "referredId" }],
          },
        ],
      }
    );
  }
}
