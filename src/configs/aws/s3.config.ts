import * as S3 from 'aws-sdk/clients/s3';
import AppConfig from '../app.config';

const s3Config = AppConfig.ENV.AWS.S3;

const s3 = new S3({
   region: s3Config.BUCKET_REGION,
   credentials: {
      accessKeyId: s3Config.ACCESS_KEYID,
      secretAccessKey: s3Config.SECRET_ACCESS_KEY,
   },
});

export default s3;
