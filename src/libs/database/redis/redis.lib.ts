import { redisClient } from '../../../configs/database/redis/redisConnect';
import RedisKeyPattern from './keyPattern.lib';

class RedisLib {
   /**
    *
    * @param userID
    * @param accessToken
    * @param options NX: If the key exists then do nothing. Default is false
    * @returns
    */
   public static async setAccessToken(
      userID: string,
      accessToken: string,
      options: { EX?: number; NX?: boolean } = { NX: false }
   ) {
      try {
         const result = await redisClient.set(RedisKeyPattern.accessTokenKey(userID), accessToken, {
            EX: options.EX,
            NX: options.NX as any,
         });
         return result;
      } catch (error) {
         throw error;
      }
   }
   public static async getAccessToken(userID: string) {
      try {
         const result = await redisClient.get(RedisKeyPattern.accessTokenKey(userID));
         return result;
      } catch (error) {
         throw error;
      }
   }

   public static async deleteAccessToken(userID: string) {
      try {
         const result = await redisClient.del(RedisKeyPattern.accessTokenKey(userID));
         return result;
      } catch (error) {
         throw error;
      }
   }
}

export default RedisLib;
