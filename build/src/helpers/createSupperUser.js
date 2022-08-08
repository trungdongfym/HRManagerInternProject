"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_lib_1 = require("../libs/database/mysql/user.lib");
const roles_model_1 = require("../models/roles.model");
async function createUserAdmin() {
    const newAdmin = {
        staffCode: 'Admin',
        email: 'admin@gmail.com',
        firstName: 'Le Trung',
        lastName: 'Dong',
        password: 'Ledong1',
        role: roles_model_1.RolesEnum.Admin,
    };
    try {
        try {
            const user = await user_lib_1.default.createOne(newAdmin);
            // const user = await UserDB.findByAnyField({});
            // console.log(user);
            console.log('--------------Created User Admin-----------');
            console.log(user.toJSON());
        }
        catch (error) {
            console.log('Create User Admin Error::\n', error);
        }
    }
    catch (error) {
        console.log(error);
    }
}
createUserAdmin();
// testSendMail();
