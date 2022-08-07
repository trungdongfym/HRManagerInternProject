import * as bscrypt from 'bcrypt';
import { AppConst } from '../../commons/constants/app.const';

class BcryptLib {
   static async bcryptHash(dataHash: string) {
      try {
         const dataHashed = await bscrypt.hash(dataHash, AppConst.BCRYPT_SALT_ROUND);
         return dataHashed;
      } catch (error) {
         throw error;
      }
   }

   static bcryptHashSync(dataHash: string) {
      try {
         const dataHashed = bscrypt.hashSync(dataHash, AppConst.BCRYPT_SALT_ROUND);
         return dataHashed;
      } catch (error) {
         throw error;
      }
   }
   static async bcryptCompare(dataCheck: string, dataHash: string) {
      try {
         const isValid = await bscrypt.compare(dataCheck, dataHash);
         return isValid;
      } catch (error) {
         throw error;
      }
   }
}

export default BcryptLib;
