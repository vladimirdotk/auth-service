import { Role, IRoleModel } from './../models/Role';

export default class RoleService {
    public async getAll(): Promise<IRoleModel[]> {
        return Role.find();
    }

    public async getOne(name: IRoleModel['name']): Promise<IRoleModel> {
        return Role.create({ name });
    }

    public async remove(roleId: IRoleModel['id']) {
        Role.findByIdAndRemove({ _id: roleId });
    }
}
