import { DataTypes, Model } from 'sequelize';
import { IForm } from '../../../../apis/v1/forms/forms.model';
import { formAssociations, FormStatusArray, FormStatusEnum } from '../../../../models/form.model';
import { sequelize } from '../mysql.config';
import User from './user';

class Form extends Model implements IForm {
   declare formID: string;
   declare formCode: string;
   declare status: FormStatusEnum;
   declare numReject?: number;
   declare sendTime: string | Date;
   declare ownerID: string;
   declare reviewerID: string;
   declare updatedAt?: string;

   static associate() {
      Form.associations['Owner'] = User.hasMany(Form, {
         foreignKey: 'ownerID',
         onDelete: 'CASCADE',
         as: 'owner',
      });
      Form.associations['Reviewer'] = User.hasMany(Form, {
         foreignKey: 'reviewerID',
         onDelete: 'CASCADE',
         as: 'reviewer',
      });
      Form.associations[formAssociations.formBelongsToOwner] = Form.belongsTo(User, {
         foreignKey: 'ownerID',
         onDelete: 'CASCADE',
         as: formAssociations.formBelongsToOwner,
      });
      Form.associations[formAssociations.formBelongsToReviewer] = Form.belongsTo(User, {
         foreignKey: 'reviewerID',
         onDelete: 'CASCADE',
         as: formAssociations.formBelongsToReviewer,
      });
   }
}

Form.init(
   {
      formID: {
         type: DataTypes.UUID,
         defaultValue: DataTypes.UUIDV4,
         primaryKey: true,
      },
      formCode: {
         type: DataTypes.STRING(30),
         allowNull: false,
      },
      status: {
         type: DataTypes.ENUM(
            ...FormStatusArray.filter((val) => {
               return val !== FormStatusEnum.reject;
            })
         ),
         defaultValue: FormStatusEnum.open,
      },
      numReject: {
         type: DataTypes.INTEGER.UNSIGNED,
         defaultValue: 0,
      },
      sendTime: {
         type: DataTypes.DATE,
         allowNull: true,
      },
      ownerID: {
         type: DataTypes.UUID,
         allowNull: false,
      },
   },
   {
      sequelize,
      tableName: 'form',
      modelName: 'form',
      indexes: [
         {
            fields: ['formCode', 'ownerID'],
            unique: true,
            name: 'formCode_ownerID_unique_key',
         },
      ],
   }
);

Form.associate();

export default Form;
