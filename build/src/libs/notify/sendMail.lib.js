"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const app_config_1 = require("../../configs/app.config");
const googleapis_1 = require("googleapis");
const nodemailer_1 = require("nodemailer");
const sendMailConfig = app_config_1.default.ENV.NOTIFY.SEND_MAIL;
const oAuth2Config = sendMailConfig.OAUTH2;
const oAuth2Client = new googleapis_1.google.auth.OAuth2(oAuth2Config.CLIENT_ID, oAuth2Config.CLIENT_SECRET, oAuth2Config.REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: oAuth2Config.REFRESH_TOKEN });
async function sendMail(sendMailData) {
    try {
        const accessToken = await oAuth2Client.getAccessToken();
        const transporter = (0, nodemailer_1.createTransport)({
            service: sendMailConfig.SERVICE,
            auth: {
                type: 'OAUTH2',
                user: sendMailConfig.USER,
                clientId: oAuth2Config.CLIENT_ID,
                clientSecret: oAuth2Config.CLIENT_SECRET,
                refreshToken: oAuth2Config.REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: sendMailData.from,
            to: sendMailData.to,
            subject: sendMailData.subject,
            text: sendMailData.text,
            html: sendMailData.html,
        });
        console.log('Send mail Sucess: %s\n', info.messageId);
        return info;
    }
    catch (error) {
        throw error;
    }
}
exports.sendMail = sendMail;
