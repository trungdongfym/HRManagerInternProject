import * as fs from 'fs';
import { User } from '../../apis/v1/users/users.model';
import * as path from 'path';
import { IFormStore } from '../../apis/v1/forms/forms.model';

function getMockUser() {
   const filePath = path.join(__dirname, 'users.mock.json');
   const usersRaw = fs.readFileSync(filePath, { encoding: 'utf-8' });
   const users: User[] = JSON.parse(usersRaw);
   return users;
}

function getMockFormStore() {
   const filePath = path.join(__dirname, 'formStore.mock.json');
   const formStoreRaw = fs.readFileSync(filePath, { encoding: 'utf-8' });
   const formStore: IFormStore[] = JSON.parse(formStoreRaw);
   return formStore;
}

const users = getMockUser();
const formStore = getMockFormStore();
export { users, formStore };
