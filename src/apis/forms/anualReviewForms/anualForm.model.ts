import { FormStatusEnum, FormTypeEnum } from '../../../models/form.model';
import { IForm } from '../forms.model';

export interface IAnnualReviewForm extends IForm {
   year: string | Date;
   review: string;
   point: number;
}

export interface IAnualFormData extends IForm {
   [FormTypeEnum.AnnualReviewForm]?: Omit<IAnnualReviewForm, keyof IForm>;
}

export function anualFormDataFactory(anualFormData: Object): IAnualFormData {
   // Fake a form have full attribute of IAnualFormData
   const formFakeData: Required<IForm> = {
      formID: null,
      formCode: null,
      ownerID: null,
      reviewerID: null,
      sendTime: null,
      status: null,
      numReject: null,
      title: null,
      createrID: null,
   };
   const anualFormFakeData: Omit<IAnnualReviewForm, keyof IForm> = {
      point: null,
      review: null,
      year: null,
   };
   const keysForm = Object.keys(formFakeData);
   const keysAnualForm = Object.keys(anualFormFakeData);
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
