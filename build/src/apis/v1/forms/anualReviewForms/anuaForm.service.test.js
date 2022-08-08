"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../../../configs/database");
const mysql_1 = require("../../../../libs/database/mysql");
const httpErrors_1 = require("../../../../libs/error/httpErrors");
const form_model_1 = require("../../../../models/form.model");
const roles_model_1 = require("../../../../models/roles.model");
const anualForm_service_1 = require("./anualForm.service");
const __test__1 = require("../../../../__test__");
jest.mock('../../../../libs/notify/sendMail.lib', () => {
    const originalModule = jest.requireActual('../../../../libs/notify/sendMail.lib');
    return {
        __esModule: true,
        ...originalModule,
        sendMail: jest.fn(async () => true),
    };
});
const annualFormService = new anualForm_service_1.default();
describe('AnualFormService', () => {
    const formStoreFakeData = new database_1.db.FormStore({
        formCode: 'form01',
        formType: form_model_1.FormTypeEnum.AnnualReviewForm,
        status: form_model_1.FormStoreStatusEnum.private,
        createrID: 'uuidv4',
    });
    const actor = {
        role: roles_model_1.RolesEnum.HR,
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
            const actor = {
                role: roles_model_1.RolesEnum.HR,
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
            jest.spyOn(database_1.db.FormStore, 'findOne').mockImplementation(() => mockFn());
            await expect(annualFormService.createToAllUser(annualForm, actor)).rejects.toThrow(httpErrors_1.default.BadRequest('formCode not exists!'));
            const formStoreFakeData = new database_1.db.FormStore({ formCode: annualForm.formCode });
            /*
               formType = 'ProbationaryForm' => form type error
            */
            formStoreFakeData.formType = form_model_1.FormTypeEnum.ProbationaryForm; // => FormType invalid
            mockFn.mockReturnValue(formStoreFakeData);
            jest.spyOn(database_1.db.FormStore, 'findOne').mockImplementation(() => mockFn());
            await expect(annualFormService.createToAllUser(annualForm, actor)).rejects.toThrow(httpErrors_1.default.BadRequest('FormType invalid!'));
            /*
               form is published => error FormStore is published
            */
            formStoreFakeData.formType = form_model_1.FormTypeEnum.AnnualReviewForm;
            formStoreFakeData.status = form_model_1.FormStoreStatusEnum.public; // => FormStore is published
            mockFn.mockReturnValue(formStoreFakeData);
            jest.spyOn(database_1.db.FormStore, 'findOne').mockImplementation(() => mockFn());
            await expect(annualFormService.createToAllUser(annualForm, actor)).rejects.toThrow(httpErrors_1.default.BadRequest('FormStore is published!'));
            /*
               rank of role < drirecttor and createrID != actor id => Not Permission
            */
            formStoreFakeData.formType = form_model_1.FormTypeEnum.AnnualReviewForm;
            formStoreFakeData.status = form_model_1.FormStoreStatusEnum.private;
            formStoreFakeData.createrID = actor.userID + 'must_different'; // => Not Permission
            mockFn.mockReturnValue(formStoreFakeData);
            jest.spyOn(database_1.db.FormStore, 'findOne').mockImplementation(() => mockFn());
            await expect(annualFormService.createToAllUser(annualForm, actor)).rejects.toThrow(httpErrors_1.default.Forbiden('Not Permission!'));
        });
        test('Should be successful', async () => {
            /*
               actor = HR and createrID = actor id
             */
            database_1.db.FormStore.findOne = jest.fn(() => formStoreFakeData);
            mysql_1.UserDB.getAll = jest.fn(() => __test__1.mockData.users);
            mysql_1.FormLib.bulkCreate = jest.fn(async () => true);
            formStoreFakeData.save = jest.fn();
            const res = await annualFormService.createToAllUser(annualForm, actor);
            expect(res).toBe(true);
            /*
               actor = admin and createrID != actor id
             */
            actor.role = roles_model_1.RolesEnum.Admin;
            actor.userID = formStoreFakeData.createrID + '#1'; //make userID != createrID
            formStoreFakeData.status = form_model_1.FormStoreStatusEnum.private;
            const res1 = await annualFormService.createToAllUser(annualForm, actor);
            expect(res1).toBe(true);
            /*
               actor = Drirector and createrID != actor id
             */
            actor.role = roles_model_1.RolesEnum.Drirector;
            actor.userID = formStoreFakeData.createrID + '#2';
            formStoreFakeData.status = form_model_1.FormStoreStatusEnum.private;
            const res2 = await annualFormService.createToAllUser(annualForm, actor);
            expect(res2).toBe(true);
        });
    });
    describe('Update annual form to all user', () => {
        test('Should throw exception', async () => {
            /*
               db.FormStore.findOne return null => formCode nost exists
            */
            database_1.db.FormStore.findOne = jest.fn(() => null);
            await expect(annualFormService.updateToAllUser(formStoreFakeData.formCode, annualForm, actor)).rejects.toThrow(httpErrors_1.default.NotFound('Not Found formCode!'));
            /*
               rank of role < drirecttor and createrID != actor id => Not Permission
            */
            actor.role = roles_model_1.RolesEnum.HR;
            formStoreFakeData.createrID = actor.userID + 'must_different'; // => Not Permission
            jest.spyOn(database_1.db.FormStore, 'findOne').mockImplementation(() => formStoreFakeData);
            await expect(annualFormService.updateToAllUser(formStoreFakeData.formCode, annualForm, actor)).rejects.toThrow(httpErrors_1.default.Forbiden('Not Permission!'));
        });
        test('Should be successful', async () => {
            database_1.db.FormStore.findOne = jest.fn(() => formStoreFakeData);
            mysql_1.FormLib.findAndUpdate = jest.fn(() => true);
            /*
               actor = HR and createrID = actor id
            */
            formStoreFakeData.createrID = actor.userID;
            actor.role = roles_model_1.RolesEnum.HR;
            const res = await annualFormService.updateToAllUser(annualForm.formCode, annualForm, actor);
            expect(res).toBe(true);
            /*
               actor = admin and createrID != actor id
            */
            actor.role = roles_model_1.RolesEnum.Admin;
            actor.userID = formStoreFakeData.createrID + '#1'; //make userID != createrID
            const res1 = await annualFormService.updateToAllUser(annualForm.formCode, annualForm, actor);
            expect(res1).toBe(true);
            /*
               actor = Drirector and createrID != actor id
            */
            actor.role = roles_model_1.RolesEnum.Drirector;
            actor.userID = formStoreFakeData.createrID + '#2';
            const res2 = await annualFormService.updateToAllUser(annualForm.formCode, annualForm, actor);
            expect(res2).toBe(true);
        });
    });
    describe('Get annual forms', () => {
        const queryParams = {};
        test('Should throw exception', async () => {
            /*
               actor role = employee and ownerID != actor id => not permission
            */
            actor.role = roles_model_1.RolesEnum.Employee;
            queryParams.filter = {};
            queryParams.filter.ownerID = actor.userID + '#1';
            await expect(annualFormService.getAnnualForms(queryParams, actor)).rejects.toThrow(httpErrors_1.default.Forbiden(`You don't have permission to get this resource!`));
            /*
               actor role = Manager and ownerID != actor id => not permission
            */
            actor.role = roles_model_1.RolesEnum.Manager;
            queryParams.filter = {};
            queryParams.filter.ownerID = actor.userID + '#1';
            await expect(annualFormService.getAnnualForms(queryParams, actor)).rejects.toThrow(httpErrors_1.default.Forbiden(`You don't have permission to get this resource!`));
        });
        test('Should be successful', async () => {
            const retrievedRecord = {};
            database_1.db.Form.findAndCountAll = jest.fn(() => Promise.resolve(retrievedRecord));
            database_1.db.Form.findAll = jest.fn(() => Promise.resolve(retrievedRecord));
            /*
               have page and pageSize
               role = admin
            */
            queryParams.page = 0;
            queryParams.pageSize = 3;
            actor.role = roles_model_1.RolesEnum.Admin;
            const res = await annualFormService.getAnnualForms(queryParams, actor);
            expect(res).toEqual(retrievedRecord);
        });
    });
});
