"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const probForm_service_1 = require("./probForm.service");
const probFormSv = new probForm_service_1.default();
class ProbFormController {
    async createAll(req, res) {
        try {
            const { user } = req;
            const formRaw = req.body;
            const formCreated = await probFormSv.createToAllUser(formRaw, user);
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
            const formUpdated = await probFormSv.updateToAllUser(formCode, formRaw, user);
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
            const formUpdated = await probFormSv.updateForm(formID, formRaw, user);
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
            const probForms = await probFormSv.getProbForms(formQuery, user);
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
    async getForm(req, res) {
        try {
            const { formID } = req.query;
            const { user } = req;
            const probForm = await probFormSv.getForm(formID, user);
            res.json(probForm);
        }
        catch (error) {
            const err = error;
            res.status(err?.status || 500).json(err.message);
        }
    }
}
exports.default = ProbFormController;
