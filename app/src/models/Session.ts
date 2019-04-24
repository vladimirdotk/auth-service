import { Document, Schema, Model, model } from 'mongoose';

export interface ISession {
    expires: Date;
    session: string;
}

export interface ISessionModel extends ISession, Document{}

const sessionSchema = new Schema({
    expires: {
        type: Date,
        required: true,
    },
    session: {
        type: String,
        required: true,
    },
// tslint:disable-next-line: align
}, { timestamps: true });

export const Session: Model<ISessionModel> = model<ISessionModel>('Session', sessionSchema);
