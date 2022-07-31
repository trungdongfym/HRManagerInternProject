import * as SES from 'aws-sdk/clients/ses';
import AppConfig from '../app.config';

const sesConfig = AppConfig.ENV.AWS.SES;

const ses = new SES({
   region: sesConfig.SES_REGION,
   credentials: {
      accessKeyId: sesConfig.ACCESS_KEYID,
      secretAccessKey: sesConfig.SECRET_ACCESS_KEY,
   },
});

export default ses;
