import { Association, DataTypes, Model } from 'sequelize';
import { IAnnualReviewForm } from '../../../../apis/forms/forms.model';
import { sequelize } from '../mysql.config';
import Form from './form';

class AnnualReviewForm extends Form implements IAnnualReviewForm {
   year: string | Date;
   review: string;
   point: number;

   static associate() {
      Form.associations['AnnualReviewForm'] = Form.hasOne(AnnualReviewForm, {
         foreignKey: 'formID',
         onDelete: 'CASCADE',
         as: 'annualReviewForm',
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
      year: {
         type: DataTypes.DATE,
         allowNull: false,
      },
      review: {
         type: DataTypes.STRING,
      },
      point: {
         type: DataTypes.INTEGER.UNSIGNED,
         allowNull: false,
      },
   },
   {
      sequelize,
      tableName: 'AnnualReviewForm',
      modelName: 'AnnualReviewForm',
      timestamps: false,
   }
);

AnnualReviewForm.associate();

export default AnnualReviewForm;
