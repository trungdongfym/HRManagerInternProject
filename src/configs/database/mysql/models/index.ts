import User from './user';
import Form from './form';
import ProbationaryForm from './ProbationaryForm';
import AnnualReviewForm from './AnnualReviewForm';
import FormStore from './formStore';
import { FormScope, FormStoreAssociation, FormTypeEnum } from '../../../../models/form.model';
import {
   annualFormFieldToMerge,
   getAssociationObject,
   probFieldToSelectAttr,
} from '../../../../apis/v1/forms/forms.model';

Form.addScope(FormScope.populateAnnualForm, {
   raw: true,
   attributes: [
      ...(annualFormFieldToMerge as any),
      ...Object.values(
         getAssociationObject(FormStoreAssociation.formBelongsToFormStore, null, [
            'createdAt',
            'updatedAt',
            'formType',
            'status',
         ])
      ),
   ],
   include: [
      {
         model: AnnualReviewForm,
         as: FormTypeEnum.AnnualReviewForm,
         attributes: [],
         required: true,
      },
      {
         model: FormStore,
         association: FormStore.associations[FormStoreAssociation.formBelongsToFormStore],
         as: FormStoreAssociation.formBelongsToFormStore,
         attributes: [],
         required: true,
      },
   ],
});

Form.addScope(FormScope.populateProbForm, {
   raw: true,
   attributes: [
      ...(probFieldToSelectAttr as any),
      ...Object.values(
         getAssociationObject(FormStoreAssociation.formBelongsToFormStore, null, [
            'createdAt',
            'updatedAt',
            'formType',
            'status',
         ])
      ),
   ],
   include: [
      {
         model: ProbationaryForm,
         as: FormTypeEnum.ProbationaryForm,
         attributes: [],
         required: true,
      },
      {
         model: FormStore,
         association: FormStore.associations[FormStoreAssociation.formBelongsToFormStore],
         as: FormStoreAssociation.formBelongsToFormStore,
         attributes: [],
         required: true,
      },
   ],
});

export { User, Form, ProbationaryForm, AnnualReviewForm, FormStore };
