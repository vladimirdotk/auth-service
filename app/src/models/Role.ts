import { Document, Schema, Model, model } from 'mongoose';
import { IRole } from './../interfaces/role';

export interface IUserModel extends IRole, Document{}

const roleSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
// tslint:disable-next-line: align
}, { timestamps: true });

export const Role: Model<IUserModel> = model<IUserModel>('User', roleSchema);
