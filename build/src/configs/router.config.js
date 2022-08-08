"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const glob = require("glob");
const app_const_1 = require("../commons/constants/app.const");
const customRouter_1 = require("../libs/router/customRouter");
const path = require("path");
function routerConfig(app) {
    //Read all file have pattern *.route.ts
    const routes = glob.sync('**/*.route.ts', { cwd: app_const_1.AppConst.PATH_FOLDER_API });
    for (const route of routes) {
        const pathRoute = path.normalize(app_const_1.AppConst.PATH_FOLDER_API + route);
        const routeModule = require(pathRoute).default;
        if (routeModule) {
            console.log(`Ready route /${app_const_1.AppConst.API_PREFIX}/${app_const_1.AppConst.API_VERSION}/${routeModule}`);
        }
    }
    app.use(`/${app_const_1.AppConst.API_PREFIX}/${app_const_1.AppConst.API_VERSION}`, customRouter_1.router);
}
exports.default = routerConfig;
