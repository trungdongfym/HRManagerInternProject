import { RolesEnum } from '../../../models/roles.model';

export interface User {
   userID?: string;
   staffCode?: string;
   firstName?: string;
   lastName?: string;
   fullName?: string;
   phone?: string;
   avatar?: string | Express.Multer.File;
   cmnd?: string;
   numberBHXH?: string;
   address?: string;
   email?: string;
   password?: string;
   role?: RolesEnum;
   managerID?: string;
   createdAt?: Date | string;
   updatedAt?: Date | string;
}

export interface IUserAccount {
   email: string;
   password: string;
}

export interface IUserLoginPayload {
   userID?: string;
   staffCode?: string;
   fullName?: string;
   phone?: string;
   avatar?: string;
   cmnd?: string;
   numberBHXH?: string;
   address?: string;
   email?: string;
   role?: RolesEnum;
}
