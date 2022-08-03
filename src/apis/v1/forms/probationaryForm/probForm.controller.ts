import { Request, Response } from 'express';
import HttpErrors from '../../../../libs/error/httpErrors';
import ProbFormService from './probForm.service';

const probFormSv = new ProbFormService();
class ProbFormController {
   public async createAll(req: Request, res: Response) {
      try {
         const { user } = req as any;
         const formRaw = req.body;
         const formCreated = await probFormSv.createToAllUser(formRaw, user);
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
         const formUpdated = await probFormSv.updateToAllUser(formCode, formRaw, user);
         res.json(formUpdated);
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
         const formUpdated = await probFormSv.updateForm(formID, formRaw, user);
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
         const probForms = await probFormSv.getProbForms(formQuery, user);
         res.json({
            data: probForms,
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
         const probForm = await probFormSv.getForm(formID as any, user);
         res.json(probForm);
      } catch (error) {
         const err = error as HttpErrors;
         res.status(err?.status || 500).json(err.message);
      }
   }
}
export default ProbFormController;
