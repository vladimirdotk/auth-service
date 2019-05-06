import { Model } from 'objection';

export interface IUserRole {
    id?: number;
    userId: number;
    roleId: number;
}

export default class UserRole extends Model implements IUserRole {
    id?: number;
    userId: number;
    roleId: number;

    static get tableName() {
        return 'userRoles';
    }
}
