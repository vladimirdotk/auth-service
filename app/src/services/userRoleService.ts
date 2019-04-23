import userService from './../services/userService';
import { IUserModel } from '../models/User';
import { IRoleModel } from '../models/Role';

export default class UserRoleService {
    static async getAll(userId: IUserModel['id']) {
        const user = await userService.getById(userId);
        return { userId: user._id, roles: user.roles };
    }

    static async add(userId: IUserModel['id'], roleId: IRoleModel['id']) {
        const user = await userService.getById(userId);
        const roleIds = (user.roles as IRoleModel['id'][]).map(role => role.toString());
        roleIds.push(roleId);
        user.roles = [...new Set(roleIds)];
        await user.save();
        return { userId: user._id, roles: user.roles };
    }

    static async remove(userId: IUserModel['id'], roleId: IRoleModel['id']) {
        const user = await userService.getById(userId);
        user.roles = (user.roles as IRoleModel['id'][])
            .filter(role => role.toString() !== roleId);
        await user.save();
        return { userId: user._id, roles: user.roles };
    }
}
