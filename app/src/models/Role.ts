import { Document, Schema, Model, model } from 'mongoose';

export interface IRole {
    name: string;
}

export interface IRoleModel extends IRole, Document{}

const roleSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
// tslint:disable-next-line: align
}, { timestamps: true });

export const Role: Model<IRoleModel> = model<IRoleModel>('Role', roleSchema);
