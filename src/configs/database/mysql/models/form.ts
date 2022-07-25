import { Association, DataTypes, Model } from 'sequelize';
import { IForm } from '../../../../apis/forms/forms.model';
import { FormStatusArray, FormStatusEnum } from '../../../../models/form.model';
import { sequelize } from '../mysql.config';
import User from './user';

class Form extends Model implements IForm {
   declare formID: string;
   declare title: string;
   declare status: FormStatusEnum;
   declare sendTime: string | Date;
   declare ownerID: string;
   declare assignID: string;

   static associate() {
      User.associations['Owner'] = User.hasMany(Form, {
         foreignKey: 'ownerID',
         onDelete: 'SET NULL',
      });
      User.associations['Assign'] = User.hasMany(Form, {
         foreignKey: 'assignID',
         onDelete: 'SET NULL',
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
      title: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      status: {
         type: DataTypes.ENUM(...FormStatusArray),
         defaultValue: FormStatusEnum.open,
      },
      sendTime: {
         type: DataTypes.DATE,
         defaultValue: DataTypes.NOW(),
         allowNull: true,
      },
      ownerID: {
         type: DataTypes.UUID,
      },
      assignID: {
         type: DataTypes.UUID,
      },
   },
   {
      sequelize,
      tableName: 'Form',
   }
);

Form.associate();

export default Form;
