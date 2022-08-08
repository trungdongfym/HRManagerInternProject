"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_1 = require("../../configs/aws");
class SesLib {
    static async sendMail(sendMailParam) {
        console.log(sendMailParam);
        try {
            const res = await aws_1.ses.sendEmail(sendMailParam).promise();
            return res;
        }
        catch (error) {
            throw error;
        }
    }
    static createSendMailParam(sesParam) {
        const sendMailParam = {
            Destination: {
                BccAddresses: sesParam.destinationsEmail,
            },
            Message: {
                Subject: {
                    Data: sesParam.subject,
                },
                Body: {
                    // Html: sesParam.html || '',
                    Text: sesParam.text,
                },
            },
            Source: sesParam.sourceEmail,
        };
        return sendMailParam;
    }
}
exports.default = SesLib;
