"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forms_service_1 = require("./forms.service");
const formService = new forms_service_1.default();
class FormController {
    async updateStatus(req, res) {
        try {
            const { formID } = req.params;
            const { status } = req.body;
            const { user } = req;
            const formUpdated = await formService.updateFormStatus(formID, status, user);
            res.json(formUpdated);
        }
        catch (error) {
            const err = error;
            res.status(err?.status || 500).json(err.message);
        }
    }
    async deleteForms(req, res) {
        try {
            const { formCode } = req.params;
            const { user } = req;
            const deletedCount = await formService.deleteFormStore(formCode, user);
            const responseData = {
                status: true,
                message: `Form with formCode:${formCode} deleted!`,
            };
            if (deletedCount <= 0) {
                responseData.status = false;
                responseData.message = `Delete form with formCode:${formCode} fail!`;
            }
            res.json(responseData);
        }
        catch (error) {
            const err = error;
            res.status(err?.status || 500).json(err.message);
        }
    }
    async deleteOneForm(req, res) {
        try {
            const { formID } = req.params;
            const { user } = req;
            const deletedCount = await formService.deleteForm(formID, user);
            const responseData = {
                status: true,
                message: `Form with formID:${formID} deleted!`,
            };
            if (deletedCount !== 1) {
                responseData.status = false;
                responseData.message = `Delete form with formID:${formID} fail!`;
            }
            res.json(responseData);
        }
        catch (error) {
            const err = error;
            res.status(err?.status || 500).json(err.message);
        }
    }
    // form store
    async createFormStore(req, res) {
        try {
            const formStore = req.body;
            const { user } = req;
            const formStoreCreated = await formService.createFormStore(formStore, user);
            res.json(formStoreCreated);
        }
        catch (error) {
            const err = error;
            res.status(err?.status || 500).json(err.message);
        }
    }
    async updateFormStore(req, res) {
        try {
            const formStoreUpdateData = req.body;
            const { user } = req;
            const { formCode } = req.params;
            const formStoreUpdated = await formService.updateFormStore(formCode, formStoreUpdateData, user);
            res.json(formStoreUpdated);
        }
        catch (error) {
            const err = error;
            res.status(err?.status || 500).json(err.message);
        }
    }
    async getFormStore(req, res) {
        try {
            const formStoreQuery = req.query;
            const deepCloneQuery = JSON.parse(JSON.stringify(formStoreQuery));
            const { user } = req;
            const probForms = await formService.getFormStore(formStoreQuery, user);
            res.json({
                data: probForms,
                meta: deepCloneQuery,
            });
        }
        catch (error) {
            const err = error;
            res.status(err?.status || 500).json(err.message);
        }
    }
    async reportForm(req, res) {
        try {
            const reportQuery = req.query;
            const result = await formService.reportFormStatus(reportQuery);
            res.json(result);
        }
        catch (error) {
            const err = error;
            res.status(err?.status || 500).json(err.message);
        }
    }
}
exports.default = FormController;
