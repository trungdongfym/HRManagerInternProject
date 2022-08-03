import { Request, Response } from 'express';
import HttpErrors from '../../../../libs/error/httpErrors';
import AnualFormService from './anualForm.service';

const anualFormSv = new AnualFormService();

class AnualFormController {
   public async createAll(req: Request, res: Response) {
      try {
         const { user } = req as any;
         const formRaw = req.body;
         const formCreated = await anualFormSv.createToAllUser(formRaw, user);
         res.json(formCreated);
      } catch (error) {
         const err = error as HttpErrors;
         res.status(err?.status || 500).json(err.message);
      }
   }
   public async updateAll(req: Request, res: Response) {
      try {
         const { formCode } = req.params;
         const { user } = req as any;
         const formRaw = req.body;
         const formCreated = await anualFormSv.updateToAllUser(formCode, formRaw, user);
         res.json(formCreated);
      } catch (error) {
         const err = error as HttpErrors;
         res.status(err?.status || 500).json(err.message);
      }
   }

   public async updateOne(req: Request, res: Response) {
      try {
         const { formID } = req.params;
         const formRaw = req.body;
         const { user } = req as any;
         const formUpdated = await anualFormSv.updateForm(formID, formRaw, user);
         res.json(formUpdated);
      } catch (error) {
         const err = error as HttpErrors;
         res.status(err?.status || 500).json(err.message);
      }
   }

   public async getForms(req: Request, res: Response) {
      try {
         const formQuery = req.query;
         const deepCloneQuery = JSON.parse(JSON.stringify(formQuery));
         const { user } = req as any;
         const annualForms = await anualFormSv.getAnnualForms(formQuery, user);
         res.json({
            data: annualForms,
            meta: deepCloneQuery,
         });
      } catch (error) {
         const err = error as HttpErrors;
         res.status(err?.status || 500).json(err.message);
      }
   }

   public async getForm(req: Request, res: Response) {
      try {
         const { formID } = req.query;
         const { user } = req as any;
         const annualForm = await anualFormSv.getForm(formID as any, user);
         res.json(annualForm);
      } catch (error) {
         const err = error as HttpErrors;
         res.status(err?.status || 500).json(err.message);
      }
   }
}

export default AnualFormController;
