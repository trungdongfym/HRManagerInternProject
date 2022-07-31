import { RolesEnum } from '../../models/roles.model';

export interface ITokenPayload {
   userID: string;
   email: string;
   role: RolesEnum;
}
