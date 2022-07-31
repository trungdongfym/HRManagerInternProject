import { FormTypeEnum } from '../../../models/form.model';
import { RolesEnum } from '../../../models/roles.model';
import { IForm } from '../forms.model';

export interface IProbationaryForm extends IForm {
   durationTime: number;
   startTime: Date | string;
   position: RolesEnum;
   comments: string;
   workResult: string;
}

export interface IProbFormData extends IForm {
   [FormTypeEnum.ProbationaryForm]?: Omit<IProbationaryForm, keyof IForm>;
}
