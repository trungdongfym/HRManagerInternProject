import { ses } from '../../configs/aws';
import { SendEmailRequest } from 'aws-sdk/clients/ses';
import { ISendMailSes } from '../../commons/interfaces/sendMail';

class SesLib {
   public static async sendMail(sendMailParam: SendEmailRequest) {
      console.log(sendMailParam);
      try {
         const res = await ses.sendEmail(sendMailParam).promise();
         return res;
      } catch (error) {
         throw error;
      }
   }
   public static createSendMailParam(sesParam: ISendMailSes) {
      const sendMailParam: SendEmailRequest = {
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

export default SesLib;
