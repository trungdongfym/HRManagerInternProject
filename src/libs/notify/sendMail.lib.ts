import AppConfig from '../../configs/app.config';
import { google } from 'googleapis';
import { createTransport } from 'nodemailer';
import { ISendMail } from '../../commons/interfaces/sendMail';

const sendMailConfig = AppConfig.ENV.NOTIFY.SEND_MAIL;
const oAuth2Config = sendMailConfig.OAUTH2;

const oAuth2Client = new google.auth.OAuth2(
   oAuth2Config.CLIENT_ID,
   oAuth2Config.CLIENT_SECRET,
   oAuth2Config.REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: oAuth2Config.REFRESH_TOKEN });

async function sendMail(sendMailData: ISendMail) {
   try {
      const accessToken = await oAuth2Client.getAccessToken();

      const transporter = createTransport({
         service: sendMailConfig.SERVICE,
         auth: {
            type: 'OAUTH2',
            user: sendMailConfig.USER,
            clientId: oAuth2Config.CLIENT_ID,
            clientSecret: oAuth2Config.CLIENT_SECRET,
            refreshToken: oAuth2Config.REFRESH_TOKEN,
            accessToken: accessToken as any,
         },
      });
      // send mail with defined transport object
      const info = await transporter.sendMail({
         from: sendMailData.from, // sender address
         to: sendMailData.to, // list of receivers
         subject: sendMailData.subject, // Subject line
         text: sendMailData.text, // plain text body
         html: sendMailData.html,
      });
      console.log('Send mail Sucess: %s\n', info.messageId);
      return info;
   } catch (error) {
      throw error;
   }
}

export { sendMail };
