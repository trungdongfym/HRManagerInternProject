import * as dotenv from 'dotenv';
import * as express from 'express';
import swaggerConfig from './configs/apidocs/apidocs.config';
import AppConfig from './configs/app.config';
import { databaseConfig } from './configs/database';
import middleWareConfig from './configs/middleware.config';
import routerConfig from './configs/router.config';

const app = express();
dotenv.config();
const PORT = AppConfig.ENV.APP.PORT || 3000;
const runMode = process.env.NODE_ENV;

databaseConfig(); //connect mysql and redis
middleWareConfig(app);
routerConfig(app);
swaggerConfig(app, '/apidocs', 'v1');

app.listen(PORT, () => {
   console.log(`Running with mode ${runMode}!`);
   console.log(`Server is running on port ${PORT}!`);
});
