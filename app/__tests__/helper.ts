import { getRandomName } from './../src/utils';
import UserService from './../src/services/userService';
import RoleService from './../src/services/roleService';
import SessionService from './../src/services/userSessionService';
import UserRoleService from './../src/services/userRoleService';
import { Role, IRole } from './../src/models/Role';
import { IUser, User } from './../src/models/User';
import { Session } from './../src/models/Session';
import { transaction, Model, Transaction } from 'objection';
import UserRole from '../src/models/UserRole';

const userService = new UserService();
const roleService = new RoleService();
const sessionService = new SessionService();
const userRoleService = new UserRoleService();

export const createRole = async (): Promise<Role> => {
    return await roleService.create(getRandomName());
};

export const deleteRole = async (roleId: number) => {
    await roleService.remove(roleId);
};

export const createUser = async (userData: IUser = {}): Promise<User>  => {
    return await userService.create({
        email: userData.email || `${getRandomName()}@test.ru`,
        name: userData.name || getRandomName(),
        password: userData.password || getRandomName(),
    });
};

export const deleteUser = async (userId: number) => {
    userService.removeById(userId);
};

export const createSession = async (userId: number): Promise<Session> => {
    return sessionService.create(new Date(), userId);
};

export const deleteSession = async (sessionId: string) => {
    sessionService.removeOne(sessionId);
};

export const createUserRole = async (userId: IUser['id'], roleId: IRole['id']): Promise<UserRole[]> => {
    return userRoleService.add(userId, roleId);
};

export const transactionPerTest = async () => {
    let trx: Transaction;
    const knex = Model.knex();

    beforeEach(async () => {
        trx = await transaction.start(knex);
        Model.knex(trx);
    });

    afterEach(async () => {
        await trx.rollback();
        Model.knex(knex);
    });

    afterAll(async () => {
        knex.destroy();
    });
};
