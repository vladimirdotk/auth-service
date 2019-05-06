import UserRole from '../models/UserRole';
import { IUser } from '../models/User';
import { IRole } from '../models/Role';

export default class UserRoleService {
    public async getAll(userId: IUser['id']): Promise<UserRole[]> {
        return UserRole
            .query()
            .where({ userId });
    }

    public async add(userId: IUser['id'], roleId: IRole['id']): Promise<UserRole[]> {
        await UserRole
            .query()
            .insert({ userId, roleId });
        return this.getAll(userId);
    }

    public async remove(userId: IUser['id'], roleId: IRole['id']): Promise<UserRole[]> {
        await UserRole
            .query()
            .delete()
            .where({ userId, roleId });
        return this.getAll(userId);
    }
}
