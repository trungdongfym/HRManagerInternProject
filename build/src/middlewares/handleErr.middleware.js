"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleHttpErrors = void 0;
const httpErrors_1 = require("../libs/error/httpErrors");
const handleHttpErrors = (err, req, res, next) => {
    if (err instanceof httpErrors_1.default) {
        res.status(err.status).json(err.message);
        return;
    }
    res.status(500).json(err?.message || 'Server unknown error!');
    return;
};
exports.handleHttpErrors = handleHttpErrors;
