import { createClient, RedisClientOptions } from 'redis';
import AppConfig from '../../app.config';

const redisConfig = AppConfig.ENV.DATABASES.REDIS;

const redisConnectOptions: RedisClientOptions = {
   socket: {
      host: redisConfig.host,
      port: redisConfig.port,
   },
   database: redisConfig.dbNumber,
};

if (redisConfig.username && redisConfig.password) {
   redisConnectOptions.username = redisConfig.username;
   redisConnectOptions.password = redisConfig.password;
}

const redisClient = createClient(redisConnectOptions);

async function redisConnect() {
   redisClient.on('error', (err) => {
      console.log('Redis connect error::', err.message);
   });

   redisClient.on('connect', () => {
      redisClient.ACL_WHOAMI().then((user) => {
         console.log(`Redis connected to user: ${user}`);
      });
   });

   redisClient.on('ready', () => {
      console.log('Redis ready');
   });
   await redisClient.connect();
}

export { redisConnect, redisClient };
