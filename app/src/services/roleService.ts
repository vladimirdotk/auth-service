import { Role } from './../models/Role';

export default class RoleService {
    public async getAll(): Promise<Role[]> {
        return Role.query();
    }

    public async getOneByName(name: Role['name']): Promise<Role | undefined> {
        return Role.query().findOne({ name });
    }

    public async getById(id: Role['id']): Promise<Role | undefined> {
        return Role.query().findById(id);
    }

    public async remove(roleId: Role['id']): Promise<number> {
        return Role.query().deleteById(roleId);
    }

    public async create(name: Role['name']): Promise<Role> {
        return Role.query().insert({ name });
    }
}
