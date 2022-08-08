"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionArray = exports.PermissionEnum = exports.rolesRankMap = exports.rolesArray = exports.RolesEnum = void 0;
var RolesEnum;
(function (RolesEnum) {
    RolesEnum["Admin"] = "Admin";
    RolesEnum["Drirector"] = "Drirector";
    RolesEnum["HR"] = "HR";
    RolesEnum["Manager"] = "Manager";
    RolesEnum["Employee"] = "Employee";
})(RolesEnum = exports.RolesEnum || (exports.RolesEnum = {}));
exports.rolesArray = Object.values(RolesEnum);
exports.rolesRankMap = {
    Admin: 100,
    Drirector: 50,
    HR: 20,
    Manager: 20,
    Employee: 10,
};
var PermissionEnum;
(function (PermissionEnum) {
    PermissionEnum["read"] = "R";
    PermissionEnum["write"] = "W";
    PermissionEnum["update"] = "U";
    PermissionEnum["delete"] = "D";
    PermissionEnum["approve"] = "A";
})(PermissionEnum = exports.PermissionEnum || (exports.PermissionEnum = {}));
exports.PermissionArray = Object.values(PermissionEnum);
