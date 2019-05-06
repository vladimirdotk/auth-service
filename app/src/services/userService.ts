import url = require('url');
import bcrypt = require('bcrypt');
import { NOT_FOUND } from 'http-status-codes';
import { getRandomName } from './../utils';
import { User, IUser } from './../models/User';
import * as mailService from './../services/mailService';
import { IError } from './../interfaces/error';

interface IUserData {
    userId: IUser['id'];
    protocol: string;
    hostname: string;
    port: number;
    userData: IUser;
    confirmCode?: string;
}

export default class UserService {
    public readonly confirmText = 'Please confirm user data changes';

    public async getAll(): Promise<User[]> {
        return User.query();
    }

    public async getById(userId: IUser['id']): Promise<User> {
        const user = await User
            .query()
            .findById(<number>userId);
        this.checkUser(user);
        return user!;
    }

    public async findOne(data: IUser): Promise<User | undefined> {
        return await User.query().findOne(data);
    }

    public async create(data: IUser): Promise<User> {
        if (data.password) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(data.password, salt);
            data.password = hash;
        }
        return User.query().insert(<User>data);
    }

    public async removeById(userId: IUser['id']): Promise<number> {
        return User.query().deleteById(<number>userId);
    }

    public async changeUser(data: IUserData) {
        const user = await User.query().findById(<number>data.userId);
        const confirmCode = getRandomName();
        this.checkUser(user);
        await User
            .query()
            .update({ confirmCode })
            .where('id', user!.id);
        const confirmUrl = this.createConfirmUrl(Object.assign(data, { confirmCode }));
        const mailOptions = this.createConfirmMailOptions(user!.email!, confirmUrl);
        await mailService.send(mailOptions);
        return confirmUrl;
    }

    public async confirmChanges(data: Partial<IUserData>): Promise<User> {
        const user = await User.query().findById(<number>data.userId);
        this.checkUser(user);
        return user!
            .$query()
            .updateAndFetch({ confirmCode: undefined, ...data.userData });
    }

    public async comparePassword (candidatePassword: string, hash: string): Promise<boolean> {
        const isMatch = await bcrypt.compare(candidatePassword, hash);
        return Promise.resolve(isMatch);
    }

    private checkUser(user: IUser | undefined) {
        if (!user) {
            const error: IError = new Error('User not found');
            error.status = NOT_FOUND;
            throw error;
        }
    }

    private createConfirmUrl(data: IUserData) {
        return url.format({
            protocol: data.protocol,
            hostname: data.hostname,
            port: data.port,
            pathname: `/users/${data.userId}/confirm-changes`,
            query: Object.assign(data.userData, { confirmCode: data.confirmCode }),
        });
    }

    private createConfirmMailOptions(email: string, confirmUrl: string) {
        return {
            from: process.env.MAILER_EMAIL,
            to: email,
            subject: this.confirmText,
            text: `${this.confirmText}: ${confirmUrl}`,
            html: `<div>${this.confirmText}: ${confirmUrl}</div>`,
        };
    }
}
