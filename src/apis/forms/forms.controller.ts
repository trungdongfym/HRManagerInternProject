import { Request, Response } from 'express';
import HttpErrors from '../../libs/error/httpErrors';
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
         const deletedCount = await formService.deleteForms(formCode, user);
         const responseData = {
            status: true,
            message: `Form with formCode:${formCode} deleted!`,
            deleteCount: deletedCount,
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
}

export default FormController;
