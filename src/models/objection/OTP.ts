import { Model } from 'objection';

import { ObjectionBaseModel } from 'models/common';

import User from './User';

class OTP extends ObjectionBaseModel {
  id!: number;
  code: number;
  type: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;

  static tableName = 'otp';

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'otp.userId',
          to: 'user.id'
        }
      }
    };
  }
}

export default OTP;
