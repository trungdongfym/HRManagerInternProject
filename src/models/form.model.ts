export enum FormStatusEnum {
   open = 'open',
   review = 'review',
   reject = 'reject',
   approve = 'approve',
}

export enum FormTypeEnum {
   AnnualReviewForm = 'annualReviewForm',
   ProbationaryForm = 'probationaryForm',
}

export enum FormScope {
   populateAnnualForm = 'populateAnnualForm',
   populateProbForm = 'populateProbForm',
}

export enum FormStoreStatusEnum {
   public = 'public',
   private = 'private',
}

export enum formAssociations {
   formBelongsToOwner = 'owner',
   ownerHasManyForm = 'forms',
   formBelongsToReviewer = 'reviewer',
   reviewerHasManyForm = 'forms',
   formBelongsToFormStore = 'formStore',
}

export enum FormStoreAssociation {
   formBelongsToFormStore = 'formStore',
   formStorehasManyForm = 'forms',
}

const x = {
   search: {
      field: ['title'],
      value: 'title fulltext search',
   },
   filter: {
      status: 'public',
      formCode: 'formStoreId',
      year: 2022,
      ownerID: 'uuidv4',
      reviewerID: 'uuidv4',
   },
   sort: {
      field: ['string'],
      type: 'ASC',
   },
   page: 0,
   pageSize: 6,
};
export const FormStatusArray = Object.values(FormStatusEnum);
export const FormTypeArray = Object.values(FormTypeEnum);
export const FormStoreStatusArray = Object.values(FormStoreStatusEnum);
