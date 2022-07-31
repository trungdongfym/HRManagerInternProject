import { Sequelize } from 'sequelize';
import AppConfig from '../../app.config';

const mysqlConfig = AppConfig.ENV.DATABASES.MYSQL;
const sequelize = new Sequelize(mysqlConfig.database, mysqlConfig.username, mysqlConfig.password, {
   host: mysqlConfig.host,
   dialect: 'mysql',
   logging: false,
});

async function connectMySql() {
   try {
      await sequelize.authenticate();
      console.log('Mysql connect successfully!');
      return sequelize;
   } catch (error) {
      throw error;
   }
}

export { connectMySql, sequelize };
