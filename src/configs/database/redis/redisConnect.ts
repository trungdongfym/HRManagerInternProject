import * as redis from 'redis';
import AppConfig from '../../app.config';

const redisConfig = AppConfig.ENV.DATABASES.REDIS;

async function redisConnect() {
   const redisClient = redis.createClient({
      socket: {
         host: redisConfig.host,
         port: redisConfig.port,
      },
   });

   redisClient.on('error', (err) => {
      console.log('Redis connect error::', err.message);
   });

   redisClient.on('connect', () => {
      console.log('Redis connected');
   });

   redisClient.on('ready', () => {
      console.log('Redis ready');
   });
   await redisClient.connect();
}

export default redisConnect;
