"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const compression = require("compression");
const handleErr_middleware_1 = require("../middlewares/handleErr.middleware");
const app_const_1 = require("../commons/constants/app.const");
const path = require("path");
function middleWareConfig(app) {
    app.use(compression({
        threshold: 1024 * 100,
        filter: (req, res) => {
            // if header have field x-no-compression then no compress
            if (req.header[app_const_1.AppConst.NO_COMPRESS_HEADER]) {
                return false;
            }
            return compression.filter(req, res);
        },
    }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static(path.normalize(__dirname + '/../../public'))); // http://localhost:5000/filename
    app.use(cors());
    setImmediate(() => {
        app.use(handleErr_middleware_1.handleHttpErrors);
    });
}
exports.default = middleWareConfig;
