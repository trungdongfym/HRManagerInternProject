import { BelongsTo, DataTypes, Model } from 'sequelize';
import { IFormStore } from '../../../../apis/v1/forms/forms.model';
import {
   FormStoreAssociation,
   FormStoreStatusArray,
   FormStoreStatusEnum,
   FormTypeArray,
   FormTypeEnum,
} from '../../../../models/form.model';
import { sequelize } from '../mysql.config';
import Form from './form';
import User from './user';

class FormStore extends Model<IFormStore> implements IFormStore {
   declare formCode: string;
   declare title: string;
   declare status: FormStoreStatusEnum;
   declare formType: FormTypeEnum;
   declare describe?: string;
   declare note?: string;
   declare createrID?: string;
   declare createdAt?: string | Date;
   declare updatedAt?: string | Date;

   static Form: BelongsTo;
   static Creater: BelongsTo;

   static associate() {
      FormStore.associations[FormStoreAssociation.formStorehasManyForm] = FormStore.hasMany(Form, {
         foreignKey: 'formCode',
         onDelete: 'CASCADE',
         as: FormStoreAssociation.formStorehasManyForm,
      });
      FormStore.associations[FormStoreAssociation.formBelongsToFormStore] = Form.belongsTo(FormStore, {
         foreignKey: 'formCode',
         onDelete: 'CASCADE',
         as: FormStoreAssociation.formBelongsToFormStore,
      });
      User.associations['creater'] = User.hasMany(FormStore, {
         foreignKey: 'createrID',
         onDelete: 'SET NULL',
         as: 'creater',
      });
      FormStore.Creater = FormStore.belongsTo(User, {
         foreignKey: 'createrID',
         onDelete: 'SET NULL',
         as: 'creater',
      });
   }
}

FormStore.init(
   {
      formCode: {
         type: DataTypes.STRING,
         primaryKey: true,
         allowNull: false,
      },
      status: {
         type: DataTypes.ENUM(...FormStoreStatusArray),
         defaultValue: FormStoreStatusEnum.private,
      },
      title: {
         type: DataTypes.TEXT,
         allowNull: false,
      },
      formType: {
         type: DataTypes.ENUM(...FormTypeArray),
         allowNull: false,
      },
      describe: {
         type: DataTypes.TEXT,
      },
      note: {
         type: DataTypes.TEXT,
      },
      createrID: {
         type: DataTypes.UUID,
      },
   },
   {
      sequelize: sequelize,
      modelName: 'formstore',
      tableName: 'formstore',
      indexes: [
         {
            type: 'FULLTEXT',
            name: 'search_formStore_title_index',
            fields: ['title'],
         },
      ],
   }
);

FormStore.associate();

export default FormStore;
