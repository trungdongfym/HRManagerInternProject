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
      };
   };
   SECURITY?: {
      JWT: {
         ACCESS_TOKEN_EXPIRE: number | string;
         REFRESH_TOKEN_EXPIRE: number | string;
         ACCESS_TOKEN_SECRET: string;
         REFRESH_TOKEN_SECRET: string;
         FIELD_PAYLOAD: Array<string>;
      };
   };
}

export interface IAppConfig {
   ENV: AppEnv;
}
