import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { handleHttpErrors } from '../middlewares/handleErr.middleware';

export default function middleWareConfig(app: express.Express) {
   app.use(cors());
   app.use(express.static('./public'));
   app.use(bodyParser.json());
   app.use(bodyParser.urlencoded({ extended: true }));

   setImmediate(() => {
      app.use(handleHttpErrors);
   });
}
