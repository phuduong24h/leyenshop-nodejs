import bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import jwt from 'jsonwebtoken';
import { Model } from 'objection';

import { EStatus } from 'enums';
import { ObjectionBaseModel } from 'models/common';

import File from './File';
import Role from './Role';

class User extends ObjectionBaseModel {
  id!: number;
  phone: string;
  email: string;
  password: string;
  fullName: string;
  address: string;
  status: EStatus;
  lastLoginAt: Date;
  fileId: number;
  roleId: number;
  createdAt: Date;
  updatedAt: Date;

  static tableName = 'user';

  static get relationMappings() {
    return {
      file: {
        relation: Model.HasOneRelation,
        modelClass: File,
        join: {
          from: 'user.fileId',
          to: 'file.id'
        }
      },
      role: {
        relation: Model.BelongsToOneRelation,
        modelClass: Role,
        join: {
          from: 'user.roleId',
          to: 'role.id'
        }
      }
    };
  }

  static modifiers = {
    ...ObjectionBaseModel.modifiers,
    defaultSelects(query) {
      const { ref } = User;
      query.select(...['id', 'phone', 'email', 'fullName', 'address', 'status', 'lastLoginAt'].map(ref));
    }
  };

  get $secureFields(): string[] {
    return ['password'];
  }

  toJsonWithToken() {
    const token = jwt.sign(
      {
        id: this.id,
        at: dayjs().format('YYYYMMDD')
      },
      process.env.JWT_SECRET
    );

    return token;
  }

  static generateHashPassword(password: string): string {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  }

  static validPassword(input: string, password: string): boolean {
    return bcrypt.compareSync(input, password);
  }

  static async $getInfoByToken(token: string): Promise<User | null> {
    const decoded = User.$decodeToken(token);

    if (decoded) {
      const me = await User.query().patchAndFetchById(decoded.id, { updatedAt: new Date() });
      return me;
    }

    return null;
  }

  static $decodeToken(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET);
  }
}

export default User;
