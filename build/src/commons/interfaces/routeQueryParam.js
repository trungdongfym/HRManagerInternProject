"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortTypeArray = exports.sortTypeEnum = void 0;
var sortTypeEnum;
(function (sortTypeEnum) {
    sortTypeEnum["ASC"] = "ASC";
    sortTypeEnum["DESC"] = "DESC";
})(sortTypeEnum = exports.sortTypeEnum || (exports.sortTypeEnum = {}));
exports.sortTypeArray = Object.values(sortTypeEnum);
