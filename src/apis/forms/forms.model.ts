import { FormStatusEnum } from '../../models/form.model';

export interface IForm {
   formID?: string;
   formCode: string;
   title: string;
   status?: FormStatusEnum;
   numReject?: number;
   sendTime?: Date | string;
   ownerID?: string;
   reviewerID?: string;
   createrID?: string;
}

export * from './anualReviewForms/anualForm.model';
export * from './probationaryForm/probForm.model';
