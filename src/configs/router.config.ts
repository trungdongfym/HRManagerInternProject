import * as express from 'express';
import * as glob from 'glob';
import { AppConst } from '../commons/constants/app.const';
import { router } from '../libs/router/customRouter';
import * as path from 'path';

function routerConfig(app: express.Express) {
   //Read all file have pattern *.route.ts
   const routes = glob.sync('../apis/**/*.route.ts', { cwd: __dirname });
   for (const route of routes) {
      const pathRoute = path.normalize(route);
      const routeModule = require(pathRoute).default;
      if (routeModule) {
         console.log(`Ready route /${AppConst.API_PREFIX}/${AppConst.API_VERSION}/${routeModule}`);
      }
   }
   app.use(`/${AppConst.API_PREFIX}/${AppConst.API_VERSION}`, router);
}

export default routerConfig;
