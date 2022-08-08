"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const multer = require("multer");
const httpErrors_1 = require("../libs/error/httpErrors");
class Upload {
    static uploadImage(fieldName, destination) {
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, destination);
            },
            filename: function (req, file, cb) {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname);
            },
        });
        const upload = multer({
            storage: storage,
            limits: {
                fileSize: 1024 * 1024, //1MB
            },
            fileFilter: function (req, file, cb) {
                const fileTypes = /jpeg|jpg|png/;
                const mimeType = fileTypes.test(file.mimetype);
                if (mimeType) {
                    cb(null, true);
                    return;
                }
                const uploadErr = httpErrors_1.default.UploadError();
                uploadErr.setStatus = http_status_codes_1.StatusCodes.BAD_REQUEST;
                uploadErr.message = 'File must be an image!';
                cb(uploadErr, false);
            },
        }).single(fieldName);
        return (req, res, next) => {
            const uploadErr = httpErrors_1.default.UploadError();
            upload(req, res, function (err) {
                uploadErr.setMessage = err?.message;
                if (err instanceof multer.MulterError) {
                    res.status(uploadErr.status).json(uploadErr.message);
                    return;
                }
                else if (err) {
                    next(err);
                    return;
                }
                next();
            });
        };
    }
}
exports.default = Upload;
