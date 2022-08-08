"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formStore = exports.users = void 0;
const fs = require("fs");
const path = require("path");
function getMockUser() {
    const filePath = path.join(__dirname, 'users.mock.json');
    const usersRaw = fs.readFileSync(filePath, { encoding: 'utf-8' });
    const users = JSON.parse(usersRaw);
    return users;
}
function getMockFormStore() {
    const filePath = path.join(__dirname, 'formStore.mock.json');
    const formStoreRaw = fs.readFileSync(filePath, { encoding: 'utf-8' });
    const formStore = JSON.parse(formStoreRaw);
    return formStore;
}
const users = getMockUser();
exports.users = users;
const formStore = getMockFormStore();
exports.formStore = formStore;
