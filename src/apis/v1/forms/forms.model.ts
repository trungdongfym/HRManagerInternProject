import {
   FormStatusEnum,
   FormStoreAssociation,
   FormStoreStatusEnum,
   FormTypeEnum,
} from '../../../models/form.model';

export interface IForm {
   formID?: string;
   formCode: string;
   status?: FormStatusEnum;
   numReject?: number;
   sendTime?: Date | string;
   ownerID?: string;
   reviewerID?: string;
   createdAt?: Date | string;
   updatedAt?: Date | string;
}

export interface IFormStore {
   formCode: string;
   title: string;
   formType: FormTypeEnum;
   status: FormStoreStatusEnum;
   describe?: string;
   note?: string;
   createrID?: string;
   createdAt?: Date | string;
   updatedAt?: Date | string;
}

export const formStoreObject: Required<IFormStore> = {
   formCode: 'formCode',
   title: 'title',
   formType: 'formType' as any,
   status: 'status' as any,
   describe: 'status',
   note: 'note',
   createrID: 'createrID',
   createdAt: 'createdAt',
   updatedAt: 'updatedAt',
};

// To get object have value refer to include association
export const getAssociationObject = (
   association: FormStoreAssociation,
   include?: Array<keyof typeof formStoreObject>,
   exclude?: Array<keyof typeof formStoreObject>
): IFormStore => {
   const res = {};
   for (const [key, _] of Object.entries(formStoreObject)) {
      if (include) {
         if (include.includes(key as any)) {
            res[key] = `${association}.${key}`;
         }
      } else {
         res[key] = `${association}.${key}`;
      }
      if (exclude && res[key] && exclude.includes(key as any)) {
         delete res[key];
      }
   }
   return res as IFormStore;
};

export * from './anualReviewForms/anualForm.model';
export * from './probationaryForm/probForm.model';
