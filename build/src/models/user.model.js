"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userProtectFieldArray = exports.userProtectFieldEnum = void 0;
var userProtectFieldEnum;
(function (userProtectFieldEnum) {
    userProtectFieldEnum["role"] = "role";
    userProtectFieldEnum["managerID"] = "managerID";
    userProtectFieldEnum["staffCode"] = "staffCode";
})(userProtectFieldEnum = exports.userProtectFieldEnum || (exports.userProtectFieldEnum = {}));
exports.userProtectFieldArray = Object.values(userProtectFieldEnum);
