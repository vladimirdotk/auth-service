declare module 'passport-google-oauth20' {
    import { Request } from 'express';

    export interface StrategyOptions {
        clientID: string;
        clientSecret: string;
        callbackURL: string;
        passReqToCallback?: true;
        scope?: string[];
        proxy?: boolean;
    }

    export interface StrategyOptionsWithRequest {
        clientID: string;
        clientSecret: string;
        callbackURL: string;
        passReqToCallback: true;
        scope?: string[];
        }

    export interface VerifyOptions {
        message: string;
    }

    export type VerifyCallback = (error: any, user?: any, options?: VerifyOptions) => void;

    export type VerifyFunctionWithRequest = (
        req: Request,
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback
    ) => void;

    export type VerifyFunction = (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) => void;

    export class Strategy implements Strategy {
        name: string;
        authenticate: (req: Request, options?: object) => void;

        constructor(options: StrategyOptionsWithRequest, verify: VerifyFunctionWithRequest);
        constructor(options: StrategyOptions, verify: VerifyFunction);
        constructor(verify: VerifyFunction);
    }

}