"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_service_1 = require("./users.service");
const userService = new users_service_1.default();
class UserController {
    async createUser(req, res) {
        const newUser = req.body;
        if (req.file) {
            newUser.avatar = req.file;
        }
        try {
            const userCreated = await userService.create(newUser);
            res.json(userCreated);
        }
        catch (error) {
            res.status(error?.status || 500).json(error?.message || 'Unknow error!');
        }
    }
    async updateUser(req, res) {
        const userUpdate = req.body;
        const { userID } = req.params;
        const { user: userAction } = req;
        const { role } = userAction || {};
        if (req.file) {
            userUpdate.avatar = req.file;
        }
        try {
            const userUpdated = await userService.update(userUpdate, userID, role);
            res.json(userUpdated);
        }
        catch (error) {
            res.status(error?.status || 500).json(error?.message || 'Unknow error!');
        }
    }
    async loginUser(req, res) {
        const userAccount = req.body;
        try {
            const loginData = await userService.UserLogin(userAccount);
            res.json(loginData);
        }
        catch (error) {
            res.status(error?.status || 500).json(error?.message || 'Unknow error!');
        }
    }
    async logoutUser(req, res) {
        try {
            const { user } = req;
            const result = await userService.UserLogout(user);
            const resultLogout = {
                status: true,
                message: 'Logout successfully',
            };
            if (!result) {
                resultLogout.status = false;
                resultLogout.message = 'Logout failure';
            }
            res.json(resultLogout);
        }
        catch (error) {
            res.status(error?.status || 500).json(error?.message || 'Unknow error!');
        }
    }
    async getUsers(req, res) {
        const queryParam = req.query;
        const { user } = req;
        const { role } = user;
        try {
            const users = await userService.getUsers(queryParam, role);
            res.json({
                data: users,
                meta: queryParam,
            });
        }
        catch (error) {
            res.status(error?.status || 500).json(error?.message || 'Unknow error!');
        }
    }
    async getUser(req, res) {
        const userParam = req.query;
        try {
            const user = await userService.getUserInfo(userParam);
            res.json({
                data: user,
                meta: userParam,
            });
        }
        catch (error) {
            res.status(error?.status || 500).json(error?.message || 'Unknow error!');
        }
    }
    async deleteUser(req, res) {
        try {
            const { userID } = req.params;
            const result = await userService.delete(userID);
            res.json({
                status: result === 1,
                message: result === 1 ? `Delete success userID: ${userID}` : `Delete failure userID: ${userID}`,
            });
        }
        catch (error) {
            res.status(error?.status || 500).json(error?.message || 'Unknow error!');
        }
    }
}
exports.default = UserController;
