import { BelongsTo, DataTypes } from 'sequelize';
import { IAnnualReviewForm } from '../../../../apis/v1/forms/forms.model';
import { FormTypeEnum } from '../../../../models/form.model';
import { sequelize } from '../mysql.config';
import Form from './form';

class AnnualReviewForm extends Form implements IAnnualReviewForm {
   declare department: string;
   declare year: string | Date;
   declare review: string;
   declare point: number;
   static Form: BelongsTo;

   static associate() {
      Form.associations[FormTypeEnum.AnnualReviewForm] = Form.hasOne(AnnualReviewForm, {
         foreignKey: 'formID',
         onDelete: 'CASCADE',
         as: FormTypeEnum.AnnualReviewForm,
      });
      AnnualReviewForm.Form = AnnualReviewForm.belongsTo(Form, {
         as: 'form',
         foreignKey: 'formID',
         onDelete: 'CASCADE',
         constraints: false,
      });
   }
}

AnnualReviewForm.init(
   {
      formID: {
         type: DataTypes.UUID,
         defaultValue: DataTypes.UUIDV4,
         primaryKey: true,
      },
      department: {
         type: DataTypes.STRING,
      },
      year: {
         type: DataTypes.INTEGER({ length: 4 }),
         allowNull: false,
      },
      review: {
         type: DataTypes.STRING,
      },
      point: {
         type: DataTypes.INTEGER.UNSIGNED,
         defaultValue: 0,
         allowNull: true,
      },
   },
   {
      sequelize,
      tableName: 'annualreviewform',
      modelName: 'AnnualReviewForm',
      timestamps: false,
   }
);

AnnualReviewForm.associate();

export default AnnualReviewForm;
