import * as express from 'express';
import * as glob from 'glob';
import { AppConst } from '../commons/constants/app.const';
import { router } from '../libs/router/customRouter';
import * as path from 'path';

const pathApi = 'D:\\Projects\\HRManagerment\\src\\apis\\';

function routerConfig(app: express.Express) {
   const routes = glob.sync('**/*.route.ts', { cwd: pathApi });
   for (const route of routes) {
      const pathRoute = path.normalize(pathApi + route);
      const routeModule = require(pathRoute).default;
      if (routeModule) {
         console.log(`Ready route /${AppConst.API_PREFIX}/${AppConst.API_VERSION}/${routeModule}`);
      }
   }
   app.use(`/${AppConst.API_PREFIX}/${AppConst.API_VERSION}`, router);
}

export default routerConfig;
