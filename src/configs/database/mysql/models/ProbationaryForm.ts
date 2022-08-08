import { BelongsTo, DataTypes } from 'sequelize';
import { IProbationaryForm } from '../../../../apis/v1/forms/forms.model';
import { FormTypeEnum } from '../../../../models/form.model';
import { rolesArray, RolesEnum } from '../../../../models/roles.model';
import { sequelize } from '../mysql.config';
import Form from './form';

class ProbationaryForm extends Form implements IProbationaryForm {
   declare durationTime: number;
   declare startTime: Date | string;
   declare position: RolesEnum;
   declare comments: string;
   declare workResult: string;
   static Form: BelongsTo;

   static associate() {
      Form.associations[FormTypeEnum.ProbationaryForm] = Form.hasOne(ProbationaryForm, {
         foreignKey: 'formID',
         onDelete: 'CASCADE',
         as: FormTypeEnum.ProbationaryForm,
      });
      ProbationaryForm.Form = ProbationaryForm.belongsTo(Form, {
         as: 'form',
         foreignKey: 'formID',
         constraints: false,
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
      },
      startTime: {
         type: DataTypes.DATE,
      },
      position: {
         type: DataTypes.STRING,
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
