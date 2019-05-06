import { Session } from './../models/Session';
import { NOT_FOUND } from 'http-status-codes';
import { IError } from '../interfaces/error';
import { IUser } from '../models/User';
import { getRandomName } from '../utils';
import { ref } from 'objection';

export default class UserSessionService {
    public async getAll(userId: IUser['id']): Promise<Session[]> {
        return Session
            .query()
            .where(ref('sessions.sess:passport.user').castText(), userId!.toString());
    }

    public async getOne(sessionId: Session['sid']): Promise<Session> {
        const session = await Session.query()
            .findOne({ sid: sessionId });
        this.checkSession(session);
        return session!;
    }

    public async removeAll(userId: IUser['id']) {
        return Session
            .query()
            .delete()
            .whereJsonSupersetOf('sess', { passport: { user : userId } });
    }

    public async removeOne(sessionId: Session['sid']) {
        return Session
            .query()
            .delete()
            .where({ sid: sessionId });
    }

    public async create(expired: Session['expired'], userId: IUser['id']) {
        return Session
            .query()
            .insert({
                expired,
                sid: getRandomName(),
                sess: JSON.stringify({ passport: { user: userId } }),
            });
    }

    private async checkSession(session: Session | undefined) {
        if (!session) {
            const error: IError = new Error('Session not found');
            error.status = NOT_FOUND;
            throw error;
        }
    }
}
