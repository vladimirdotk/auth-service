import { Role, IRoleModel } from './../models/Role';

export default class RoleService {
    static async getAll(): Promise<IRoleModel[]> {
        return Role.find();
    }

    static async (name: IRoleModel['name']): Promise<IRoleModel> {
        return Role.create({ name });
    }

    static async remove(roleId: IRoleModel['id']) {
        Role.findByIdAndRemove({ _id: roleId });
    }
}
