import { getRandomName } from './../src/utils';
import { Role, IRoleModel } from './../src/models/Role';
import { IUser, UserModel, createUser as createOne, IUserModel } from './../src/models/User';
import { Session, ISessionModel } from './../src/models/Session';

export const createRole = async (): Promise<IRoleModel> => {
    return await Role.create({ name: getRandomName() });
};

export const deleteRole = async (roleId: string) => {
    await Role.findByIdAndRemove({ _id: roleId });
};

export const createUser = async (userData: IUser = {}): Promise<IUserModel>  => {
    return await createOne({
        email: userData.email || `${getRandomName()}@test.ru`,
        name: userData.name || getRandomName(),
        password: userData.password || getRandomName(),
        roles: userData.roles || [],
    });
};

export const deleteUser = async (userId: string) => {
    UserModel.findByIdAndDelete({ _id: userId });
};

export const createSession = async (userId: string): Promise<ISessionModel> => {
    return Session.create({
        expires: new Date(),
        session: userId,
    });
};

export const deleteSession = async (sessionId: string) => {
    Session.findByIdAndDelete({ _id: sessionId });
};
