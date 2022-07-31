export enum RolesEnum {
   Admin = 'Admin',
   Drirector = 'Drirector',
   HR = 'HR',
   Manager = 'Manager',
   Employee = 'Employee',
}

export const rolesArray = Object.values(RolesEnum);

export const rolesRankMap = {
   Admin: 100,
   Drirector: 50,
   HR: 20,
   Manager: 20,
   Employee: 10,
};

export enum PermissionEnum {
   read = 'R',
   write = 'W',
   update = 'U',
   delete = 'D',
   approve = 'A',
}

export const PermissionArray = Object.values(PermissionEnum);
