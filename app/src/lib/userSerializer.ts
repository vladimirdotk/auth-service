import { UserModel, IUserModel } from './../models/User';

export const serialize = (user: IUserModel, done: (err: any, id?: IUserModel['id']) => void) => {
    done(null, user.id);
};

export const deserialize = (id: IUserModel['id'], done: (err: any, user?: IUserModel) => void) => {
    UserModel.findById(id, (err, user: IUserModel) => {
        done(err, user);
    });
};
