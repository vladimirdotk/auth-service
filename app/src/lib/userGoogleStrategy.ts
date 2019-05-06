import { IUser } from '../models/User';
import UserService from '../services/userService';
import { Profile } from 'passport';
import { VerifyCallback } from 'passport-google-oauth20';

interface IUserData {
    googleId: string;
    email?: string;
    name?: string;
}

// tslint:disable-next-line: max-line-length
export const strategy = async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
    const userService = new UserService();
    let user: IUser | undefined;
    try {
        user = await userService.findOne({ githubId: profile.id });
    } catch (err) {
        return done(err);
    }

    if (!user) {
        try {
            const userData: IUserData = {
                googleId: profile.id,
                email: profile.emails ? profile.emails[0].value : undefined,
                name: profile.name ? profile.name.givenName : undefined,
            };
            const googleUser = await userService.create(userData);
            return done(null, googleUser);
        } catch (err) {
            return done(err);
        }
    }

    return done(null, user);
};
