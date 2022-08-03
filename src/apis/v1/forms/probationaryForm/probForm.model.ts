import { FormTypeEnum } from '../../../../models/form.model';
import { IForm } from '../forms.model';

export interface IProbationaryForm extends IForm {
   durationTime: number;
   startTime: Date | string;
   position: string;
   comments: string;
   workResult: string;
}

export interface IProbFormData extends IForm {
   [FormTypeEnum.ProbationaryForm]?: Omit<IProbationaryForm, keyof IForm>;
}

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

const probFormFakeData: Omit<IProbationaryForm, keyof IForm> = {
   durationTime: `${FormTypeEnum.ProbationaryForm}.department` as any,
   startTime: `${FormTypeEnum.ProbationaryForm}.startTime` as any,
   position: `${FormTypeEnum.ProbationaryForm}.position` as any,
   comments: `${FormTypeEnum.ProbationaryForm}.comments` as any,
   workResult: `${FormTypeEnum.ProbationaryForm}.workResult` as any,
};

const keysProbForm = Object.keys(probFormFakeData);

export function probFormDataFactory(anualFormData: Object): IProbFormData {
   const keysForm = Object.keys(formFakeData);
   const keysData = Object.keys(anualFormData);
   const result = {};
   for (const keyData of keysData) {
      if (keysForm.includes(keyData)) {
         result[keyData] = anualFormData[keyData];
      } else if (keysProbForm.includes(keyData)) {
         if (!result[FormTypeEnum.ProbationaryForm]) {
            result[FormTypeEnum.ProbationaryForm] = {};
         }
         result[FormTypeEnum.ProbationaryForm][keyData] = anualFormData[keyData];
      }
   }
   return result as IProbFormData;
}
