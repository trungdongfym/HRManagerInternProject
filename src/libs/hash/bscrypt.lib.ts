import * as bscrypt from 'bcrypt';
import { AppConst } from '../../commons/constants/app.const';

async function bcryptHash(dataHash: string) {
   try {
      const dataHashed = await bscrypt.hash(dataHash, AppConst.BCRYPT_SALT_ROUND);
      return dataHashed;
   } catch (error) {
      throw error;
   }
}

function bcryptHashSync(dataHash: string) {
   try {
      const dataHashed = bscrypt.hashSync(dataHash, AppConst.BCRYPT_SALT_ROUND);
      return dataHashed;
   } catch (error) {
      throw error;
   }
}
async function bcryptCompare(dataCheck: string, dataHash: string) {
   try {
      const isValid = await bscrypt.compare(dataCheck, dataHash);
      return isValid;
   } catch (error) {
      throw error;
   }
}

export { bcryptHash, bcryptCompare, bcryptHashSync };
