import { FormStatusEnum } from '../../models/form.model';
import { RolesEnum } from '../../models/roles.model';

export interface IForm {
   formID?: string;
   title: string;
   status?: FormStatusEnum;
   sendTime?: Date | string;
   ownerID?: string;
   assignID?: string;
}

export interface IProbationaryForm extends IForm {
   durationTime: number;
   startTime: Date | string;
   position: RolesEnum;
   comments: string;
   workResult: string;
}

export interface IAnnualReviewForm extends IForm {
   year: string | Date;
   review: string;
   point: number;
}
