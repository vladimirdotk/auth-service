import { IUser } from './../models/User';
import UserService from '../services/userService';

const userService = new UserService();

export const serialize = (user: IUser, done: (err: any, id?: IUser['id']) => void) => {
    done(null, user.id);
};

export const deserialize = (id: IUser['id'], done: (err: any, user?: IUser) => void) => {
    userService.getById(id)
        .then(user => done(null, user))
        .catch(err => done(err, undefined));
};
