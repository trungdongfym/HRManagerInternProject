import HttpErrors from '../libs/error/httpErrors';
import { ObjectSchema } from 'joi';
import { RequestHandler, Request, Response, NextFunction } from 'express';

export default class Validate {
   public static validateBody(validationSchema: ObjectSchema): RequestHandler {
      return async (req: Request, res: Response, next: NextFunction) => {
         const data = req.body;
         try {
            const dataValidated = await Validate.validateData(validationSchema, data);
            req.body = dataValidated;
            next();
         } catch (error) {
            next(error);
         }
      };
   }
   private static validateData = async (
      validationSchema: ObjectSchema,
      data: object | Array<any> | any
   ) => {
      try {
         const value = await validationSchema.validateAsync(data);
         return value;
      } catch (error) {
         if (error?.isJoi) {
            throw HttpErrors.BadRequest(error.message);
         }
         throw HttpErrors.ServerError(error?.message || 'Unknow Error!');
      }
   };
}
