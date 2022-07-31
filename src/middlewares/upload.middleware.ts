import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as multer from 'multer';
import HttpErrors from '../libs/error/httpErrors';

class Upload {
   public static uploadImage(fieldName: string, destination: string) {
      const storage = multer.diskStorage({
         destination: function (req, file, cb) {
            cb(null, destination);
         },
         filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname);
         },
      });

      const upload = multer({
         storage: storage,
         limits: {
            fileSize: 1024 * 1024, //1MB
         },
         fileFilter: function (req: Request, file, cb) {
            const fileTypes = /jpeg|jpg|png/;
            const mimeType = fileTypes.test(file.mimetype);
            if (mimeType) {
               cb(null, true);
               return;
            }
            const uploadErr = HttpErrors.UploadError();
            uploadErr.setStatus = StatusCodes.BAD_REQUEST;
            uploadErr.message = 'File must be an image!';
            cb(uploadErr as any, false);
         },
      }).single(fieldName);

      return (req: Request, res: Response, next: NextFunction) => {
         const uploadErr = HttpErrors.UploadError();
         upload(req, res, function (err: any) {
            uploadErr.setMessage = err?.message;
            if (err instanceof multer.MulterError) {
               res.status(uploadErr.status).json(uploadErr.message);
               return;
            } else if (err) {
               next(err);
               return;
            }
            next();
         });
      };
   }
}

export default Upload;
