import { User } from '../apis/users/users.model';
import UserDB from '../libs/database/mysql/user.lib';
import { RolesEnum } from '../models/roles.model';
import testSendMail from './testSendMail';

async function createUserAdmin() {
   const newAdmin: User = {
      staffCode: 'Admin02',
      email: 'admin@gmail.com',
      firstName: 'Le Trung',
      lastName: 'Dong',
      password: 'Ledong1',
      role: RolesEnum.Admin,
   };
   try {
      try {
         const user = await UserDB.createOne(newAdmin);
         // const user = await UserDB.findByAnyField({});
         // console.log(user);
         console.log('--------------Created User Admin-----------');
         console.log(user.toJSON());
      } catch (error) {
         console.log('Create User Admin Error::\n', error);
      }
   } catch (error) {
      console.log(error);
   }
}

createUserAdmin();
// testSendMail();
