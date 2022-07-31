import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import { handleHttpErrors } from '../middlewares/handleErr.middleware';
import { AppConst } from '../commons/constants/app.const';
import * as path from 'path';

export default function middleWareConfig(app: express.Express) {
   app.use(
      compression({
         threshold: 1024 * 100, //compress if response > 100kb
         filter: (req: express.Request, res: express.Response) => {
            // if header have field x-no-compression then no compress
            if (req.header[AppConst.NO_COMPRESS_HEADER]) {
               return false;
            }
            return compression.filter(req, res);
         },
      })
   );
   app.use(bodyParser.json());
   app.use(bodyParser.urlencoded({ extended: true }));
   app.use(express.static(path.normalize(__dirname + '/../../public'))); // http://localhost:5000/filename
   app.use(cors());

   setImmediate(() => {
      app.use(handleHttpErrors);
   });
}
