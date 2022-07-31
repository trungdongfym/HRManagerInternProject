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

export const FormStatusArray = Object.values(FormStatusEnum);
export const FormTypeArray = Object.values(FormTypeEnum);
