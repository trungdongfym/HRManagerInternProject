import { RolesEnum } from '../../models/roles.model';

export interface User {
   userID?: string;
   staffCode?: string;
   firstName?: string;
   lastName?: string;
   fullName?: string;
   phone?: string;
   avatar?: string;
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
