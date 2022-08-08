"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SesLib = exports.S3Lib = void 0;
const s3_lib_1 = require("./s3.lib");
exports.S3Lib = s3_lib_1.default;
const ses_lib_1 = require("./ses.lib");
exports.SesLib = ses_lib_1.default;
