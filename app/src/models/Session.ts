import { Model } from 'objection';

export interface ISession {
    expired: Date;
    sid: string;
    sess: string;
}

export class Session extends Model implements ISession {
    expired: Date;
    sid: string;
    sess: string;

    static get tableName() {
        return 'sessions';
    }

    static get idColumn() {
        return 'sid';
    }
}
