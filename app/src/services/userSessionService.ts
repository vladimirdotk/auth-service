import { Session, ISessionModel } from './../models/Session';
import { NOT_FOUND } from 'http-status-codes';
import { IError } from '../interfaces/error';
import { IUserModel } from '../models/User';

export default class UserSessionService {
    public async getAll(userId: IUserModel['id']) {
        return Session.find({ session: { $regex: new RegExp(userId) } });
    }

    public async getOne(userId: IUserModel['id'], sessionId: ISessionModel['id']) {
        const session = await Session.findOne({
            _id: sessionId,
            session: { $regex: new RegExp(userId) } },
        );
        this.checkSession(session);
        return session;
    }

    public async removeAll(userId: IUserModel['id']) {
        return await Session.deleteMany({
            session: { $regex: new RegExp(userId) },
        });
    }

    public async removeOne(userId: IUserModel['id'], sessionId: ISessionModel['id']) {
        return await Session.deleteOne({
            _id: sessionId,
            session: { $regex: new RegExp(userId) },
        });
    }

    private async checkSession(session: ISessionModel | null) {
        if (!session) {
            const error: IError = new Error('Session not found');
            error.status = NOT_FOUND;
            throw error;
        }
    }
}
