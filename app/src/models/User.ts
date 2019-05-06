import { Model } from 'objection';

export interface IUser {
    id?: number;
    name?: string;
    email?: string;
    password?: string;
    githubId?: string;
    googleId?: string;
    confirmCode?: string;
}

export class User extends Model implements IUser {
    id?: number;
    name?: string;
    email?: string;
    password?: string;
    githubId?: string;
    googleId?: string;
    confirmCode?: string;

    static get tableName() {
        return 'users';
    }
}
