import * as fs from 'fs';
import s3 from '../../configs/aws/s3.config';
import { PutObjectRequest, GetObjectRequest, DeleteObjectRequest } from 'aws-sdk/clients/s3';
import AppConfig from '../../configs/app.config';

const s3Config = AppConfig.ENV.AWS.S3;

class S3Lib {
   public static async uploadFile(file: Express.Multer.File, putObjectParams?: PutObjectRequest) {
      const fileStream = fs.createReadStream(file.path);
      const defaultUploadParams: PutObjectRequest = {
         Bucket: s3Config.BUCKET_NAME,
         Body: fileStream,
         Key: file.filename,
         ACL: 'public-read',
         ContentType: file.mimetype,
      };
      const uploadParams: PutObjectRequest = {
         ...defaultUploadParams,
         ...putObjectParams,
      };
      try {
         const res = await s3.upload(uploadParams).promise();
         return res;
      } catch (error) {
         throw error;
      }
   }
   public static getStreamFile(key: string) {
      try {
         const getFileParams: GetObjectRequest = {
            Bucket: s3Config.BUCKET_NAME,
            Key: key,
         };
         const fileStream = s3.getObject(getFileParams).createReadStream();
         return fileStream;
      } catch (error) {
         throw error;
      }
   }
   public static async deleteFile(key: string) {
      try {
         const delFileParams: DeleteObjectRequest = {
            Bucket: s3Config.BUCKET_NAME,
            Key: key,
         };
         const res = await s3.deleteObject(delFileParams).promise();
         return res;
      } catch (error) {
         throw error;
      }
   }
}

export default S3Lib;
