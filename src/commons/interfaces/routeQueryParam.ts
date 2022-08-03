import { IFormStore } from '../../apis/v1/forms/forms.model';
import { User } from '../../apis/v1/users/users.model';
import { RolesEnum } from '../../models/roles.model';

export enum sortTypeEnum {
   ASC = 'ASC',
   DESC = 'DESC',
}

export const sortTypeArray = Object.values(sortTypeEnum);

export interface IPaginationParams {
   page?: number;
   pageSize?: number;
}

export interface IAdminQueryUserParams extends IPaginationParams {
   user?: User;
   requireManager?: boolean;
   roles?: Array<RolesEnum>;
}

export interface IUtilsParams<DataModel> {
   // Full text search
   search?: {
      field: Array<keyof DataModel>; //flow field
      value: string;
   };
   filter?: Partial<DataModel>;
   sort?: {
      field: Array<keyof DataModel>;
      type: keyof typeof sortTypeEnum;
   };
}

export interface IUserQueryParams {
   userID?: string;
   requireManager?: boolean;
}

export interface IReportQueryParams<DataModel> {
   filter?: Partial<DataModel>;
   detailsField?: Array<string>;
}

// FormModel: AnnualForm or ProbationaryForm
export interface IFormQueryParams<FormModel> extends IPaginationParams, IUtilsParams<FormModel> {}

export interface IFormStoreQueryParams extends IPaginationParams, IUtilsParams<IFormStore> {}
