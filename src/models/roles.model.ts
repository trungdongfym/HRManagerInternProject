export enum RolesEnum {
   Admin = 'Admin',
   Drirector = 'Drirector',
   HR = 'HR',
   Manager = 'Manager',
   Employee = 'Employee',
}

export const rolesArray = Object.values(RolesEnum);

export enum rolesRank {
   Admin,
}

export enum PermissionEnum {
   read = 'R',
   write = 'W',
   update = 'U',
   delete = 'D',
   approve = 'A',
}

export const PermissionArray = Object.values(PermissionEnum);
