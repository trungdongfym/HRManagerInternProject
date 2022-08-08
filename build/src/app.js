"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const express = require("express");
const apidocs_config_1 = require("./configs/apidocs/apidocs.config");
const app_config_1 = require("./configs/app.config");
const database_1 = require("./configs/database");
const middleware_config_1 = require("./configs/middleware.config");
const router_config_1 = require("./configs/router.config");
const app = express();
dotenv.config();
const PORT = app_config_1.default.ENV.APP.PORT || 3000;
const runMode = process.env.NODE_ENV;
(0, database_1.databaseConfig)(); //connect mysql and redis
(0, middleware_config_1.default)(app);
(0, router_config_1.default)(app);
(0, apidocs_config_1.default)(app, '/apidocs', 'v1');
app.listen(PORT, () => {
    console.log(`Running with mode ${runMode}!`);
    console.log(`Server is running on port ${PORT}!`);
});
