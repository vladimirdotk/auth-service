import { Model } from 'objection';

export interface ISession {
    expired: Date;
    sid: string;
    sess: string;
}

export class Session extends Model {
    static get tableName() {
        return 'sessions';
    }
}
