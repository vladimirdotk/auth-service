import { Document, Schema, Model, model } from 'mongoose';
import bcrypt = require('bcrypt');
import { Role } from './../models/Role';

export interface IUser {
    name?: string;
    email?: string;
    password?: string;
    githubId?: string;
    googleId?: string;
    roles?: string[] | [];
    confirmCode?: string;
}

export interface IUserModel extends IUser, Document{}

export const userSchema: Schema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true,
        sparse: true,
    },
    password: String,
    githubId: String,
    googleId: String,
    roles: [{ type: Schema.Types.ObjectId, ref: Role }],
    confirmCode: String,
},
// tslint:disable-next-line: align
    {
        timestamps: true,
        toJSON: {
            transform: (doc, ret) => {
                return {
                    _id: ret._id,
                    name: ret.name,
                    email: ret.email,
                    roles: ret.roles,
                };
            },
        },
    },
);

export const UserModel: Model<IUserModel> = model<IUserModel>('UserModel', userSchema);

export const createUser = async function(userData: IUser) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(userData.password, salt);
    userData.password = hash;
    return UserModel.create(userData);
};

export const comparePassword = async (candidatePassword: string, hash: string) => {
    const isMatch = await bcrypt.compare(candidatePassword, hash);
    return Promise.resolve(isMatch);
};
