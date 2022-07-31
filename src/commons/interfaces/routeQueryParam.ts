import { User } from '../../apis/users/users.model';

export interface IAdminQueryUserParams {
   user?: User;
   page?: number;
   pageSize?: number;
   requireManager?: boolean;
}

export interface IUserQueryParams {
   userID?: string;
   requireManager?: boolean;
}
