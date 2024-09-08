import * as Sequelize from "sequelize";
import { DataTypes, Model, Optional } from "sequelize";
import type { mlmReferral, mlmReferralId } from "./mlmReferral";

export interface mlmUnilevelNodeAttributes {
  id: string;
  referralId: string;
  parentId?: string;
}

export type mlmUnilevelNodePk = "id";
export type mlmUnilevelNodeId = mlmUnilevelNode[mlmUnilevelNodePk];
export type mlmUnilevelNodeOptionalAttributes = "parentId";
export type mlmUnilevelNodeCreationAttributes = Optional<
  mlmUnilevelNodeAttributes,
  mlmUnilevelNodeOptionalAttributes
>;

export class mlmUnilevelNode
  extends Model<mlmUnilevelNodeAttributes, mlmUnilevelNodeCreationAttributes>
  implements mlmUnilevelNodeAttributes
{
  id!: string;
  referralId!: string;
  parentId?: string;

  // mlmUnilevelNode belongsTo mlmReferral via referralId
  referral!: mlmReferral;
  getReferral!: Sequelize.BelongsToGetAssociationMixin<mlmReferral>;
  setReferral!: Sequelize.BelongsToSetAssociationMixin<
    mlmReferral,
    mlmReferralId
  >;
  createReferral!: Sequelize.BelongsToCreateAssociationMixin<mlmReferral>;
  // mlmUnilevelNode belongsTo mlmUnilevelNode via parentId
  parent!: mlmUnilevelNode;
  getParent!: Sequelize.BelongsToGetAssociationMixin<mlmUnilevelNode>;
  setParent!: Sequelize.BelongsToSetAssociationMixin<
    mlmUnilevelNode,
    mlmUnilevelNodeId
  >;
  createParent!: Sequelize.BelongsToCreateAssociationMixin<mlmUnilevelNode>;

  static initModel(sequelize: Sequelize.Sequelize): typeof mlmUnilevelNode {
    return mlmUnilevelNode.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        referralId: {
          type: DataTypes.UUID,
          allowNull: false,
          validate: {
            isUUID: {
              args: 4,
              msg: "referralId: Referral ID must be a valid UUID",
            },
          },
        },
        parentId: {
          type: DataTypes.UUID,
          allowNull: true,
          validate: {
            isUUID: {
              args: 4,
              msg: "parentId: Parent ID must be a valid UUID",
            },
          },
        },
      },
      {
        sequelize,
        tableName: "mlm_unilevel_node",
        timestamps: false,
        indexes: [
          {
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [{ name: "id" }],
          },
          {
            name: "mlmUnilevelNodeReferralIdKey",
            unique: true,
            using: "BTREE",
            fields: [{ name: "referralId" }],
          },
          {
            name: "mlmUnilevelNodeParentIdFkey",
            using: "BTREE",
            fields: [{ name: "parentId" }],
          },
        ],
      }
    );
  }
}
