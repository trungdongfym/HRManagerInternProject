import { Request, Response } from 'express';
import HttpErrors from '../../../libs/error/httpErrors';
import FormService from './forms.service';

const formService = new FormService();

class FormController {
   public async updateStatus(req: Request, res: Response) {
      try {
         const { formID } = req.params;
         const { status } = req.body;
         const { user } = req as any;
         const formUpdated = await formService.updateFormStatus(formID, status, user);
         res.json(formUpdated);
      } catch (error) {
         const err = error as HttpErrors;
         res.status(err?.status || 500).json(err.message);
      }
   }

   public async deleteForms(req: Request, res: Response) {
      try {
         const { formCode } = req.params;
         const { user } = req as any;
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
      } catch (error) {
         const err = error as HttpErrors;
         res.status(err?.status || 500).json(err.message);
      }
   }

   public async deleteOneForm(req: Request, res: Response) {
      try {
         const { formID } = req.params;
         const { user } = req as any;
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
      } catch (error) {
         const err = error as HttpErrors;
         res.status(err?.status || 500).json(err.message);
      }
   }
   // form store
   public async createFormStore(req: Request, res: Response) {
      try {
         const formStore = req.body;
         const { user } = req as any;
         const formStoreCreated = await formService.createFormStore(formStore, user);
         res.json(formStoreCreated);
      } catch (error) {
         const err = error as HttpErrors;
         res.status(err?.status || 500).json(err.message);
      }
   }

   public async updateFormStore(req: Request, res: Response) {
      try {
         const formStoreUpdateData = req.body;
         const { user } = req as any;
         const { formCode } = req.params;
         const formStoreUpdated = await formService.updateFormStore(formCode, formStoreUpdateData, user);
         res.json(formStoreUpdated);
      } catch (error) {
         const err = error as HttpErrors;
         res.status(err?.status || 500).json(err.message);
      }
   }

   public async getFormStore(req: Request, res: Response) {
      try {
         const formStoreQuery = req.query;
         const deepCloneQuery = JSON.parse(JSON.stringify(formStoreQuery));
         const { user } = req as any;
         const probForms = await formService.getFormStore(formStoreQuery, user);
         res.json({
            data: probForms,
            meta: deepCloneQuery,
         });
      } catch (error) {
         const err = error as HttpErrors;
         res.status(err?.status || 500).json(err.message);
      }
   }

   public async reportForm(req: Request, res: Response) {
      try {
         const reportQuery = req.query;
         const result = await formService.reportFormStatus(reportQuery);
         res.json(result);
      } catch (error) {
         const err = error as HttpErrors;
         res.status(err?.status || 500).json(err.message);
      }
   }
}

export default FormController;
