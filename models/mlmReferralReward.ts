import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type {
  mlmReferralCondition,
  mlmReferralConditionId,
} from "./mlmReferralCondition";
import type { user, userId } from "./user";

export interface mlmReferralRewardAttributes {
  id: string;
  reward: number;
  isClaimed: boolean;
  conditionId: string;
  referrerId: string;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;
}

export type mlmReferralRewardPk = "id";
export type mlmReferralRewardId = mlmReferralReward[mlmReferralRewardPk];
export type mlmReferralRewardOptionalAttributes =
  | "id"
  | "isClaimed"
  | "createdAt"
  | "deletedAt"
  | "updatedAt";
export type mlmReferralRewardCreationAttributes = Optional<
  mlmReferralRewardAttributes,
  mlmReferralRewardOptionalAttributes
>;

export class mlmReferralReward
  extends Model<
    mlmReferralRewardAttributes,
    mlmReferralRewardCreationAttributes
  >
  implements mlmReferralRewardAttributes
{
  id!: string;
  reward!: number;
  isClaimed!: boolean;
  conditionId!: string;
  referrerId!: string;
  createdAt?: Date;
  deletedAt?: Date;
  updatedAt?: Date;

  // mlmReferralReward belongsTo mlmReferralCondition via conditionId
  condition!: mlmReferralCondition;
  getCondition!: Sequelize.BelongsToGetAssociationMixin<mlmReferralCondition>;
  setCondition!: Sequelize.BelongsToSetAssociationMixin<
    mlmReferralCondition,
    mlmReferralConditionId
  >;
  createCondition!: Sequelize.BelongsToCreateAssociationMixin<mlmReferralCondition>;
  // mlmReferralReward belongsTo user via referrerId
  referrerUu!: user;
  getReferrerUu!: Sequelize.BelongsToGetAssociationMixin<user>;
  setReferrerUu!: Sequelize.BelongsToSetAssociationMixin<user, userId>;
  createReferrerUu!: Sequelize.BelongsToCreateAssociationMixin<user>;

  static initModel(sequelize: Sequelize.Sequelize): typeof mlmReferralReward {
    return mlmReferralReward.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        conditionId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: {
              args: 4,
              msg: "conditionId: Condition ID must be a valid UUID",
            },
          },
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
        reward: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          validate: {
            isFloat: { msg: "reward: Reward must be a valid number" },
          },
        },
        isClaimed: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        sequelize,
        tableName: "mlm_referral_reward",
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
            name: "mlmReferralRewardConditionIdFkey",
            using: "BTREE",
            fields: [{ name: "conditionId" }],
          },
          {
            name: "mlmReferralRewardReferrerIdFkey",
            using: "BTREE",
            fields: [{ name: "referrerId" }],
          },
        ],
      }
    );
  }
}
