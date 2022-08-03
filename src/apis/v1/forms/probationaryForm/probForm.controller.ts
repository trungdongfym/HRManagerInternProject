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
}
export default ProbFormController;
