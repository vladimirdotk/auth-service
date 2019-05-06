import UserService from '../services/userService';
import { IUser } from '../models/User';
import { Profile } from 'passport';
import { VerifyCallback, VerifyFunctionWithRequest } from 'passport-oauth2';
import { Request } from 'express';

// tslint:disable-next-line: max-line-length
export const strategy: VerifyFunctionWithRequest = async (req: Request, accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
    const userService = new UserService();
    let user: IUser | undefined;
    try {
        user = await userService.findOne({ githubId: profile.id });
    } catch (err) {
        return done(err);
    }

    if (!user) {
        try {
            const githubUser = await userService.create({
                githubId: profile.id,
                name: profile.displayName,
            });
            if (profile.emails) {
                githubUser.email = profile.emails[0].value;
            }
            return done(null, githubUser);
        } catch (err) {
            return done(err);
        }
    }

    return done(null, user);
};
