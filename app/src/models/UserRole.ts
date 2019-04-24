import { Model } from 'objection';

export interface IRole {
    name: string;
}

export class Role extends Model {
    static get tableName() {
        return 'user_roles';
    }
}