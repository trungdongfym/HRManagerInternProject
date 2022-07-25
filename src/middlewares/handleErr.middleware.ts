import { NextFunction, Request, Response } from 'express';
import { IError } from '../commons/interfaces';
import HttpErrors from '../libs/error/httpErrors';

const handleHttpErrors = (err: IError, req: Request, res: Response, next: NextFunction) => {
   if (err instanceof HttpErrors) {
      res.status(err.status).json(err.message);
      return;
   }
   res.status(500).json(err?.message || 'Server unknown error!');
   return;
};

export { handleHttpErrors };
