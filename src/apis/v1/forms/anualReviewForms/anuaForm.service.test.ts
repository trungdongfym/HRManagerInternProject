import { IFormQueryParams, ITokenPayload } from '../../../../commons/interfaces';
import { db } from '../../../../configs/database';
import { FormLib, UserDB } from '../../../../libs/database/mysql';
import HttpErrors from '../../../../libs/error/httpErrors';
import { FormScope, FormStoreStatusEnum, FormTypeEnum } from '../../../../models/form.model';
import { RolesEnum } from '../../../../models/roles.model';
import AnualFormService from './anualForm.service';
import { mockData } from '../../../../__test__';
import { IAnnualReviewForm } from './anualForm.model';

jest.mock('../../../../libs/notify/sendMail.lib', () => {
   const originalModule = jest.requireActual('../../../../libs/notify/sendMail.lib');
   return {
      __esModule: true,
      ...originalModule,
      sendMail: jest.fn(async () => true),
   };
});

const annualFormService = new AnualFormService();

describe('AnualFormService', () => {
   const formStoreFakeData = new db.FormStore({
      formCode: 'form01',
      formType: FormTypeEnum.AnnualReviewForm,
      status: FormStoreStatusEnum.private,
      createrID: 'uuidv4',
   });

   const actor: ITokenPayload = {
      role: RolesEnum.HR,
      email: 'hr1@gmail.com',
      userID: formStoreFakeData.createrID,
   };

   const annualForm = {
      formCode: formStoreFakeData.formCode,
      year: '2022',
      review: 'fake ok',
   };
   describe('Create annual form to all user', () => {
      test('Should throw exception', async () => {
         const actor: ITokenPayload = {
            role: RolesEnum.HR,
            email: 'hr1@gmail.com',
            userID: 'uuidv4',
         };
         const annualForm = {
            formCode: 'form07',
            year: '2022',
            review: 'fake ok',
         };
         const mockFn = jest.fn();

         /*
            Not found formCode => findOne = null => exception
         */
         mockFn.mockReturnValue(null); //findOne = null => formCode not exists
         jest.spyOn(db.FormStore, 'findOne').mockImplementation(() => mockFn());
         await expect(annualFormService.createToAllUser(annualForm, actor)).rejects.toThrow(
            HttpErrors.BadRequest('formCode not exists!')
         );

         const formStoreFakeData = new db.FormStore({ formCode: annualForm.formCode });
         /*
            formType = 'ProbationaryForm' => form type error
         */
         formStoreFakeData.formType = FormTypeEnum.ProbationaryForm; // => FormType invalid
         mockFn.mockReturnValue(formStoreFakeData);
         jest.spyOn(db.FormStore, 'findOne').mockImplementation(() => mockFn() as any);
         await expect(annualFormService.createToAllUser(annualForm, actor)).rejects.toThrow(
            HttpErrors.BadRequest('FormType invalid!')
         );

         /*
            form is published => error FormStore is published
         */
         formStoreFakeData.formType = FormTypeEnum.AnnualReviewForm;
         formStoreFakeData.status = FormStoreStatusEnum.public; // => FormStore is published
         mockFn.mockReturnValue(formStoreFakeData);
         jest.spyOn(db.FormStore, 'findOne').mockImplementation(() => mockFn() as any);
         await expect(annualFormService.createToAllUser(annualForm, actor)).rejects.toThrow(
            HttpErrors.BadRequest('FormStore is published!')
         );

         /*
            rank of role < drirecttor and createrID != actor id => Not Permission
         */
         formStoreFakeData.formType = FormTypeEnum.AnnualReviewForm;
         formStoreFakeData.status = FormStoreStatusEnum.private;
         formStoreFakeData.createrID = actor.userID + 'must_different'; // => Not Permission
         mockFn.mockReturnValue(formStoreFakeData);
         jest.spyOn(db.FormStore, 'findOne').mockImplementation(() => mockFn() as any);
         await expect(annualFormService.createToAllUser(annualForm, actor)).rejects.toThrow(
            HttpErrors.Forbiden('Not Permission!')
         );
      });

      test('Should be successful', async () => {
         /*
            actor = HR and createrID = actor id
          */
         db.FormStore.findOne = jest.fn(() => formStoreFakeData) as any;
         UserDB.getAll = jest.fn(() => mockData.users as any);
         FormLib.bulkCreate = jest.fn(async () => true) as any;
         formStoreFakeData.save = jest.fn();
         const res = await annualFormService.createToAllUser(annualForm, actor);
         expect(res).toBe(true);

         /*
            actor = admin and createrID != actor id
          */
         actor.role = RolesEnum.Admin;
         actor.userID = formStoreFakeData.createrID + '#1'; //make userID != createrID
         formStoreFakeData.status = FormStoreStatusEnum.private;
         const res1 = await annualFormService.createToAllUser(annualForm, actor);
         expect(res1).toBe(true);

         /*
            actor = Drirector and createrID != actor id
          */
         actor.role = RolesEnum.Drirector;
         actor.userID = formStoreFakeData.createrID + '#2';
         formStoreFakeData.status = FormStoreStatusEnum.private;
         const res2 = await annualFormService.createToAllUser(annualForm, actor);
         expect(res2).toBe(true);
      });
   });

   describe('Update annual form to all user', () => {
      test('Should throw exception', async () => {
         /*
            db.FormStore.findOne return null => formCode nost exists
         */
         db.FormStore.findOne = jest.fn(() => null);
         await expect(
            annualFormService.updateToAllUser(formStoreFakeData.formCode, annualForm, actor)
         ).rejects.toThrow(HttpErrors.NotFound('Not Found formCode!'));

         /*
            rank of role < drirecttor and createrID != actor id => Not Permission
         */
         actor.role = RolesEnum.HR;
         formStoreFakeData.createrID = actor.userID + 'must_different'; // => Not Permission
         jest.spyOn(db.FormStore, 'findOne').mockImplementation(() => formStoreFakeData as any);
         await expect(
            annualFormService.updateToAllUser(formStoreFakeData.formCode, annualForm, actor)
         ).rejects.toThrow(HttpErrors.Forbiden('Not Permission!'));
      });

      test('Should be successful', async () => {
         db.FormStore.findOne = jest.fn(() => formStoreFakeData as any);
         FormLib.findAndUpdate = jest.fn(() => true as any);

         /*
            actor = HR and createrID = actor id
         */
         formStoreFakeData.createrID = actor.userID;
         actor.role = RolesEnum.HR;
         const res = await annualFormService.updateToAllUser(annualForm.formCode, annualForm, actor);
         expect(res).toBe(true);

         /*
            actor = admin and createrID != actor id
         */
         actor.role = RolesEnum.Admin;
         actor.userID = formStoreFakeData.createrID + '#1'; //make userID != createrID
         const res1 = await annualFormService.updateToAllUser(annualForm.formCode, annualForm, actor);
         expect(res1).toBe(true);

         /*
            actor = Drirector and createrID != actor id
         */
         actor.role = RolesEnum.Drirector;
         actor.userID = formStoreFakeData.createrID + '#2';
         const res2 = await annualFormService.updateToAllUser(annualForm.formCode, annualForm, actor);
         expect(res2).toBe(true);
      });
   });

   describe('Get annual forms', () => {
      const queryParams: IFormQueryParams<IAnnualReviewForm> = {};

      test('Should throw exception', async () => {
         /*
            actor role = employee and ownerID != actor id => not permission
         */
         actor.role = RolesEnum.Employee;
         queryParams.filter = {};
         queryParams.filter.ownerID = actor.userID + '#1';
         await expect(annualFormService.getAnnualForms(queryParams, actor)).rejects.toThrow(
            HttpErrors.Forbiden(`You don't have permission to get this resource!`)
         );
         /*
            actor role = Manager and ownerID != actor id => not permission
         */
         actor.role = RolesEnum.Manager;
         queryParams.filter = {};
         queryParams.filter.ownerID = actor.userID + '#1';
         await expect(annualFormService.getAnnualForms(queryParams, actor)).rejects.toThrow(
            HttpErrors.Forbiden(`You don't have permission to get this resource!`)
         );
      });
      test('Should be successful', async () => {
         const retrievedRecord = {};
         db.Form.findAndCountAll = jest.fn(() => Promise.resolve(retrievedRecord)) as any;
         db.Form.findAll = jest.fn(() => Promise.resolve(retrievedRecord)) as any;
         /*
            have page and pageSize
            role = admin
         */
         queryParams.page = 0;
         queryParams.pageSize = 3;
         actor.role = RolesEnum.Admin;
         const res = await annualFormService.getAnnualForms(queryParams, actor);
         expect(res).toEqual(retrievedRecord);
      });
   });
});
