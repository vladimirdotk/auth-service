import { UserModel, IUserModel, comparePassword } from './../models/User';
import { IVerifyOptions } from 'passport-local';

// tslint:disable-next-line: max-line-length
export const strategy = async (email: string, password: string, done: (err: any, user?: any, options?: IVerifyOptions) => void) => {
    let user: IUserModel | null;
    try {
        user = await UserModel.findOne({ email });
        if (!user) {
            return done(null, false, {message: 'Unknown User'});
        }
    } catch (err) {
        return done(err);
    }

    try {
        const match = await comparePassword(password, user.password!);
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
