"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class FileLib {
    static async removeFile(filePath) {
        return new Promise((resolve, reject) => {
            fs.unlink(filePath, (err) => {
                if (err) {
                    reject(err);
                }
                resolve(filePath);
            });
        });
    }
}
exports.default = FileLib;
