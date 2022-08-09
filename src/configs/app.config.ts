import { AppConst } from '../commons/constants/app.const';
import { AppEnv, IAppConfig } from '../commons/interfaces';
import { EnvEnum } from '../models/env.model';
import * as path from 'path';

process.env['NODE_CONFIG_DIR'] = path.resolve(__dirname, AppConst.ENV_DIR) + '/'; // custom dir config
import * as config from 'config';

function getEnv(): AppEnv {
   const mode = process.env.NODE_ENV;
   let env: AppEnv;
   try {
      if (!mode) {
         env = config.get(EnvEnum.dev);
      }
      if (mode === EnvEnum.dev) {
         env = config.get(EnvEnum.dev);
      }
      if (mode === EnvEnum.staging) {
         env = config.get(EnvEnum.staging);
      }
      if (mode === EnvEnum.production) {
         env = config.get(EnvEnum.production);
      }
      if (mode === EnvEnum.test) {
         env = config.get(EnvEnum.test);
      }
   } catch (error) {
      console.log(error);
   }
   return env;
}

const AppConfig = {
   ENV: getEnv(),
} as IAppConfig;

export default AppConfig;
