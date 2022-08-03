import { RolesEnum } from '../../models/roles.model';

export interface OptionsRoutes {
   roles?: Array<RolesEnum>;
   preventRoles?: Array<RolesEnum>;
   requireAuth?: boolean;
}
