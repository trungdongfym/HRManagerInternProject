import { redisConnect } from './redis/redisConnect';
import { connectMySql } from './mysql/mysql.config';
import * as db from './mysql/models';

async function databaseConfig() {
   try {
      await connectMySql();
      await redisConnect();
   } catch (error) {
      console.log(error);
   }
}

export { databaseConfig, db };
