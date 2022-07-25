import { DataTypes } from 'sequelize';
import { IProbationaryForm } from '../../../../apis/forms/forms.model';
import { rolesArray, RolesEnum } from '../../../../models/roles.model';
import { sequelize } from '../mysql.config';
import Form from './form';

class ProbationaryForm extends Form implements IProbationaryForm {
   durationTime: number;
   startTime: Date | string;
   position: RolesEnum;
   comments: string;
   workResult: string;
   static associate() {
      Form.associations['ProbationaryForm'] = Form.hasOne(ProbationaryForm, {
         foreignKey: 'formID',
         onDelete: 'CASCADE',
         as: 'probationaryForm',
      });
   }
}

ProbationaryForm.init(
   {
      formID: {
         type: DataTypes.UUID,
         defaultValue: DataTypes.UUIDV4,
         primaryKey: true,
      },
      durationTime: {
         type: DataTypes.INTEGER.UNSIGNED,
         allowNull: false,
      },
      startTime: {
         type: DataTypes.DATE,
         allowNull: false,
      },
      position: {
         type: DataTypes.ENUM(...rolesArray),
         allowNull: false,
      },
      comments: {
         type: DataTypes.STRING,
      },
      workResult: {
         type: DataTypes.STRING,
      },
   },
   {
      sequelize,
      tableName: 'ProbationaryForm',
      modelName: 'ProbationaryForm',
      timestamps: false,
   }
);

ProbationaryForm.associate();

export default ProbationaryForm;
