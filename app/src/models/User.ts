import { Model } from 'objection';
import bcrypt = require('bcrypt');

export interface IUser {
    name?: string;
    email?: string;
    password?: string;
    githubId?: string;
    googleId?: string;
    roles?: string[] | [];
    confirmCode?: string;
}

export class User extends Model {
    static get tableName() {
        return 'users';
    }

    static createUser = async (userData: IUser): Promise<User> => {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(userData.password, salt);
        userData.password = hash;
        return User.query().insert(<User>userData);
    }

    static comparePassword = async (candidatePassword: string, hash: string): Promise<boolean> => {
        const isMatch = await bcrypt.compare(candidatePassword, hash);
        return Promise.resolve(isMatch);
    }

}
