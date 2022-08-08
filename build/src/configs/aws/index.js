"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ses = exports.s3 = void 0;
const s3_config_1 = require("./s3.config");
exports.s3 = s3_config_1.default;
const ses_config_1 = require("./ses.config");
exports.ses = ses_config_1.default;
