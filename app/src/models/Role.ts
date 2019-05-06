import { Model } from 'objection';

export interface IRole {
    id: number;
    name: string;
}

export class Role extends Model implements IRole {
    id: number;
    name: string;

    static get tableName() {
        return 'roles';
    }
}
