import { FormTypeEnum } from '../../../../models/form.model';
import { IForm } from '../forms.model';

export interface IAnnualReviewForm extends IForm {
   department: string;
   year: string | Date;
   review: string;
   point: number;
}

/**
 * @Format
 * {
      ...IForm,
      AnnualReviewForm: {
         ...IAnnualReviewForm
      }
   }
 */
export interface IAnualFormData extends IForm {
   [FormTypeEnum.AnnualReviewForm]?: Omit<IAnnualReviewForm, keyof IForm>;
}

// Fake a form have full attribute of IAnualFormData
const formFakeData: Required<IForm> = {
   formID: 'formID',
   formCode: 'formCode',
   ownerID: 'ownerID',
   reviewerID: 'reviewerID',
   sendTime: 'sendTime',
   status: 'status' as any,
   numReject: 'numReject' as any,
   createdAt: 'createdAt',
   updatedAt: 'updatedAt',
};

const anualFormFakeData: Omit<IAnnualReviewForm, keyof IForm> = {
   department: `${FormTypeEnum.AnnualReviewForm}.department`,
   point: `${FormTypeEnum.AnnualReviewForm}.point` as any,
   review: `${FormTypeEnum.AnnualReviewForm}.review`,
   year: `${FormTypeEnum.AnnualReviewForm}.year`,
};

// a object contain all properties of IAnualFormData
export const annualFormObject: Required<IAnnualReviewForm> = {
   ...formFakeData,
   ...anualFormFakeData,
};

// a array contain all properties of IAnualFormData
export const annualFormDataKeys = Object.keys(annualFormObject);
export const annualFormFieldToMerge = Object.values(annualFormObject);
const keysAnualForm = Object.keys(anualFormFakeData);

export function anualFormDataFactory(anualFormData: Object): IAnualFormData {
   const keysForm = Object.keys(formFakeData);
   const keysData = Object.keys(anualFormData);
   const result = {};
   for (const keyData of keysData) {
      if (keysForm.includes(keyData)) {
         result[keyData] = anualFormData[keyData];
      } else if (keysAnualForm.includes(keyData)) {
         if (!result[FormTypeEnum.AnnualReviewForm]) {
            result[FormTypeEnum.AnnualReviewForm] = {};
         }
         result[FormTypeEnum.AnnualReviewForm][keyData] = anualFormData[keyData];
      }
   }
   return result as IAnualFormData;
}

export function filterAnualFormFactory(filterData: Object) {
   const filterDataClone = JSON.parse(JSON.stringify(filterData));
   for (const [key, val] of Object.entries(filterDataClone)) {
      // Generate new key for nested associations access
      if (keysAnualForm.includes(key)) {
         delete filterDataClone[key];
         filterDataClone[`$${anualFormFakeData[key]}$`] = val;
      }
   }
   return filterDataClone;
}
