import { User } from '../apis/users/users.model';
import UserDB from '../libs/database/user.lib';
import { RolesEnum } from '../models/roles.model';

async function createUserAdmin() {
   const newAdmin: User = {
      staffCode: 'Admin02',
      email: 'trungdong1@gmail.com',
      firstName: 'Trung',
      lastName: 'Dong',
      password: '123',
      role: RolesEnum.Admin,
   };
   try {
      try {
         // const user = await UserDB.createOne(newAdmin);
         const user = await UserDB.getUserByAnyField({});
         console.log(user);
         console.log('--------------Created User Admin-----------');
         // console.log(user.toJSON());
      } catch (error) {
         console.log('Create User Admin Error::\n', error);
      }
   } catch (error) {
      console.log(error);
   }
}

createUserAdmin();
