import { Association, DataTypes, Model } from 'sequelize';
import { User as IUser } from '../../../../apis/users/users.model';
import { bcryptHashSync } from '../../../../libs/hash/bscrypt.lib';
import { rolesArray, RolesEnum } from '../../../../models/roles.model';
import { sequelize } from '../mysql.config';
import Form from './form';

class User extends Model<IUser> implements IUser {
   declare userID: string;
   declare staffCode: string;
   declare firstName: string;
   declare lastName: string;
   declare phone: string;
   declare avatar: string;
   declare cmnd: string;
   declare numberBHXH: string;
   declare address: string;
   declare email: string;
   declare password: string;
   declare role: RolesEnum;
   declare managerID: string;
   declare fullName: string;

   // define association
   static associate() {
      User.associations['manager'] = User.hasOne(User, {
         foreignKey: 'managerID',
         onDelete: 'SET NULL',
         as: 'manager',
      });
   }
}

User.init(
   {
      userID: {
         type: DataTypes.UUID,
         allowNull: false,
         primaryKey: true,
         defaultValue: DataTypes.UUIDV4,
      },
      staffCode: {
         type: DataTypes.STRING,
         allowNull: false,
         unique: true,
      },
      firstName: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      lastName: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      fullName: {
         type: DataTypes.VIRTUAL,
         get() {
            return `${this.firstName} ${this.lastName}`;
         },
      },
      phone: {
         type: DataTypes.STRING,
         allowNull: true,
      },
      avatar: DataTypes.STRING,
      cmnd: {
         type: DataTypes.STRING,
         unique: true,
      },
      numberBHXH: DataTypes.STRING,
      address: DataTypes.STRING,
      email: {
         type: DataTypes.STRING,
         unique: true,
      },
      password: {
         type: DataTypes.STRING,
         set(password: string) {
            this.setDataValue('password', bcryptHashSync(password));
         },
      },
      role: {
         type: DataTypes.ENUM(...rolesArray),
         allowNull: false,
         defaultValue: RolesEnum.Employee,
      },
   },
   {
      sequelize,
      modelName: 'User',
      tableName: 'User',
      paranoid: true,
   }
);

User.associate();

export default User;
