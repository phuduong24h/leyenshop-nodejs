import { ObjectionBaseModel } from 'models/common';

class Role extends ObjectionBaseModel {
  id!: number;
  roleName: string;
  createdAt: Date;
  updatedAt: Date;

  static tableName = 'role';
}

export default Role;
