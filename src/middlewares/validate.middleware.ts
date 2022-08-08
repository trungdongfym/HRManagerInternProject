import HttpErrors from '../libs/error/httpErrors';
import { ObjectSchema } from 'joi';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import FileLib from '../libs/fileHandle/file.lib';

export default class Validate {
   public static validateBody(validationSchema: ObjectSchema): RequestHandler {
      return async (req: Request, res: Response, next: NextFunction) => {
         const data = req.body;
         try {
            const dataValidated = await Validate.validateData(validationSchema, data);
            req.body = dataValidated;
            next();
         } catch (error) {
            if (req.file) {
               FileLib.removeFile(req.file.path).catch((err) => {
                  console.log(err);
               });
            }
            next(error);
         }
      };
   }

   public static validateQueryParams(validationSchema: ObjectSchema) {
      return async (req: Request, res: Response, next: NextFunction) => {
         const data = req.query?.qs ?? req.query; // qs for qs libary
         try {
            const queryParam = await Validate.validateData(validationSchema, data);
            req.query = queryParam;
            next();
         } catch (error) {
            const err = HttpErrors.BadRequest(error?.message || 'Unknow Error!');
            next(err);
         }
      };
   }
   private static validateData = async (validationSchema: ObjectSchema, data: object | Array<any> | any) => {
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
