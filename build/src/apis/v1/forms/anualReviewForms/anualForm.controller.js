"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const anualForm_service_1 = require("./anualForm.service");
const anualFormSv = new anualForm_service_1.default();
class AnualFormController {
    async createAll(req, res) {
        try {
            const { user } = req;
            const formRaw = req.body;
            const formCreated = await anualFormSv.createToAllUser(formRaw, user);
            res.json(formCreated);
        }
        catch (error) {
            const err = error;
            res.status(err?.status || 500).json(err.message);
        }
    }
    async updateAll(req, res) {
        try {
            const { formCode } = req.params;
            const { user } = req;
            const formRaw = req.body;
            const formUpdated = await anualFormSv.updateToAllUser(formCode, formRaw, user);
            res.json(formUpdated);
        }
        catch (error) {
            const err = error;
            res.status(err?.status || 500).json(err.message);
        }
    }
    async updateOne(req, res) {
        try {
            const { formID } = req.params;
            const formRaw = req.body;
            const { user } = req;
            const formUpdated = await anualFormSv.updateForm(formID, formRaw, user);
            res.json(formUpdated);
        }
        catch (error) {
            const err = error;
            res.status(err?.status || 500).json(err.message);
        }
    }
    async getForms(req, res) {
        try {
            const formQuery = req.query;
            const deepCloneQuery = JSON.parse(JSON.stringify(formQuery));
            const { user } = req;
            const annualForms = await anualFormSv.getAnnualForms(formQuery, user);
            res.json({
                data: annualForms,
                meta: deepCloneQuery,
            });
        }
        catch (error) {
            const err = error;
            res.status(err?.status || 500).json(err.message);
        }
    }
    async getForm(req, res) {
        try {
            const { formID } = req.query;
            const { user } = req;
            const annualForm = await anualFormSv.getForm(formID, user);
            res.json(annualForm);
        }
        catch (error) {
            const err = error;
            res.status(err?.status || 500).json(err.message);
        }
    }
}
exports.default = AnualFormController;
