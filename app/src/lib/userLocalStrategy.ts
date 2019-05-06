import { User, IUser } from '../models/User';
import UserService from '../services/userService';
import { IVerifyOptions } from 'passport-local';

// tslint:disable-next-line: max-line-length
export const strategy = async (email: string, password: string, done: (err: any, user?: any, options?: IVerifyOptions) => void) => {
    const userService = new UserService();
    let user: IUser | undefined;
    try {
        user = await userService.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'Unknown User' });
        }
    } catch (err) {
        return done(err);
    }

    try {
        const match = await userService.comparePassword(password, user.password!);
        if (!match) {
            return done(null, false, { message: 'Invalid password' });
        }
    } catch (err) {
        return done(err);
    }

    return done(null, user);
};

export const settings = {
    usernameField: 'email',
    passwordField: 'password',
};
