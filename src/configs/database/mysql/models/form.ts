import { DataTypes, Model } from 'sequelize';
import { IForm } from '../../../../apis/forms/forms.model';
import { FormStatusArray, FormStatusEnum } from '../../../../models/form.model';
import { sequelize } from '../mysql.config';
import User from './user';

class Form extends Model implements IForm {
   declare formID: string;
   declare formCode: string;
   declare title: string;
   declare status: FormStatusEnum;
   declare numReject?: number;
   declare sendTime: string | Date;
   declare ownerID: string;
   declare reviewerID: string;
   declare createrID?: string;
   declare updatedAt?: string;

   static associate() {
      User.associations['Owner'] = User.hasMany(Form, {
         foreignKey: 'ownerID',
         onDelete: 'SET NULL',
         as: 'owner',
      });
      User.associations['Reviewer'] = User.hasMany(Form, {
         foreignKey: 'reviewerID',
         onDelete: 'SET NULL',
         as: 'reviewer',
      });
      User.associations['Creater'] = User.hasMany(Form, {
         foreignKey: 'createrID',
         onDelete: 'SET NULL',
         as: 'creater',
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
      title: {
         type: DataTypes.STRING,
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
