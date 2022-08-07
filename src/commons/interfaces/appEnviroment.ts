export interface AppEnv {
   APP: {
      PORT: number;
      HOST?: string;
   };
   DATABASES: {
      MYSQL: {
         database: string;
         username: string;
         password: string;
         host: string;
      };
      REDIS: {
         host: string;
         port: number;
         username?: string;
         password?: string;
         dbNumber: number;
      };
   };
   SECURITY?: {
      JWT: {
         ACCESS_TOKEN_EXPIRE: number;
         REFRESH_TOKEN_EXPIRE: number;
         ACCESS_TOKEN_SECRET: string;
         REFRESH_TOKEN_SECRET: string;
         FIELD_PAYLOAD: Array<string>;
      };
   };
   NOTIFY?: {
      SEND_MAIL?: {
         SERVICE: string;
         USER: string;
         OAUTH2: {
            CLIENT_ID: string;
            CLIENT_SECRET: string;
            REDIRECT_URI: string;
            REFRESH_TOKEN: string;
         };
      };
   };
   AWS?: {
      S3: {
         BUCKET_NAME: string;
         BUCKET_REGION: string;
         ACCESS_KEYID: string;
         SECRET_ACCESS_KEY: string;
         BASE_URL_AVATAR: string;
         FOLDER_AVATAR: string;
      };
      SES: {
         SES_REGION: string;
         ACCESS_KEYID: string;
         SECRET_ACCESS_KEY: string;
      };
   };
}

export interface IAppConfig {
   ENV: AppEnv;
}
