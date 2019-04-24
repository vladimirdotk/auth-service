import url = require('url');
import { NOT_FOUND } from 'http-status-codes';
import { getRandomName } from './../utils';
import { IUser, UserModel, IUserModel, createUser } from './../models/User';
import * as mailService from './../services/mailService';
import { IError } from './../interfaces/error';

interface IUserData {
    userId: IUserModel['id'];
    protocol: string;
    hostname: string;
    port: number;
    userData: IUser;
    confirmCode?: string;
}

export default class UserService {
    public readonly confirmText = 'Please confirm user data changes';

    public async getAll(): Promise<IUserModel[]> {
        return UserModel.find();
    }

    public async getById(userId: IUserModel['id']): Promise<IUserModel> {
        const user = await UserModel.findOne({ _id: userId });
        this.checkUser(user);
        return user!;
    }

    public async create(data: IUser): Promise<IUserModel> {
        return createUser(data);
    }

    public async removeById(userId: IUserModel['id']): Promise<IUserModel> {
        const user = await UserModel.findById({ _id: userId });
        this.checkUser(user);
        return user!.remove();
    }

    public async changeUser(data: IUserData) {
        const user = await UserModel.findById({ _id: data.userId });
        this.checkUser(user);
        user!.confirmCode = getRandomName();
        await user!.save();
        const confirmUrl = this.createConfirmUrl(Object.assign(data, { confirmCode: user!.confirmCode }));
        const mailOptions = this.createConfirmMailOptions(user!.email!, confirmUrl);
        await mailService.send(mailOptions);
        return confirmUrl;
    }

    public async confirmChanges(data: Partial<IUserData>) {
        let user = await UserModel.findById({ _id: data.userId });
        this.checkUser(user);
        user = Object.assign(user, data.userData, { confirmCode: null });
        await user.save();
        return user;
    }

    private checkUser(user: IUserModel | null) {
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
